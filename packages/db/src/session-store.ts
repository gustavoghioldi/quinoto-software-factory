import type { AgentSession, SessionEvent, SessionStore } from "@factory/core";
import { eq, inArray } from "drizzle-orm";
import type { Database } from "./client.js";
import { sessionEvents, sessions } from "./schema.js";

function mapSession(row: typeof sessions.$inferSelect): AgentSession {
  return {
    id: row.id,
    projectId: row.projectId,
    stage: row.stage,
    prompt: row.prompt,
    status: row.status as AgentSession["status"],
    runnerServiceId: row.runnerServiceId,
    startedAt: row.startedAt.toISOString(),
    endedAt: row.endedAt?.toISOString() ?? null,
    maxMinutes: row.maxMinutes,
  };
}

function mapEvent(row: typeof sessionEvents.$inferSelect): SessionEvent {
  return {
    id: row.id,
    sessionId: row.sessionId,
    type: row.type,
    payload: row.payload,
    createdAt: row.createdAt.toISOString(),
  };
}

export class InMemorySessionStore implements SessionStore {
  private readonly sessionsById = new Map<string, AgentSession>();
  private readonly eventsBySession = new Map<string, SessionEvent[]>();
  private nextEventId = 1;

  async create(session: AgentSession): Promise<void> {
    this.sessionsById.set(session.id, structuredClone(session));
    this.eventsBySession.set(session.id, []);
  }

  async get(id: string): Promise<AgentSession | null> {
    const session = this.sessionsById.get(id);
    return session ? structuredClone(session) : null;
  }

  async update(session: AgentSession): Promise<void> {
    this.sessionsById.set(session.id, structuredClone(session));
  }

  async listActive(): Promise<AgentSession[]> {
    return [...this.sessionsById.values()]
      .filter((session) => session.status === "running" || session.status === "provisioning")
      .map((session) => structuredClone(session));
  }

  async listByProject(projectId: string): Promise<AgentSession[]> {
    return [...this.sessionsById.values()]
      .filter((session) => session.projectId === projectId)
      .map((session) => structuredClone(session));
  }

  async appendEvent(input: Omit<SessionEvent, "id" | "createdAt">): Promise<SessionEvent> {
    const event: SessionEvent = {
      ...input,
      id: this.nextEventId++,
      createdAt: new Date().toISOString(),
    };
    const list = this.eventsBySession.get(input.sessionId) ?? [];
    list.push(event);
    this.eventsBySession.set(input.sessionId, list);
    return event;
  }

  async events(sessionId: string): Promise<SessionEvent[]> {
    return [...(this.eventsBySession.get(sessionId) ?? [])];
  }
}

export class PostgresSessionStore implements SessionStore {
  constructor(private readonly db: Database) {}

  async create(session: AgentSession): Promise<void> {
    await this.db.insert(sessions).values({
      id: session.id,
      projectId: session.projectId,
      stage: session.stage,
      prompt: session.prompt,
      status: session.status,
      runnerServiceId: session.runnerServiceId,
      startedAt: new Date(session.startedAt),
      endedAt: session.endedAt ? new Date(session.endedAt) : null,
      maxMinutes: session.maxMinutes,
    });
  }

  async get(id: string): Promise<AgentSession | null> {
    const rows = await this.db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    return rows[0] ? mapSession(rows[0]) : null;
  }

  async update(session: AgentSession): Promise<void> {
    await this.db
      .update(sessions)
      .set({
        status: session.status,
        runnerServiceId: session.runnerServiceId,
        endedAt: session.endedAt ? new Date(session.endedAt) : null,
      })
      .where(eq(sessions.id, session.id));
  }

  async listActive(): Promise<AgentSession[]> {
    const rows = await this.db
      .select()
      .from(sessions)
      .where(inArray(sessions.status, ["running", "provisioning"]));
    return rows.map(mapSession);
  }

  async listByProject(projectId: string): Promise<AgentSession[]> {
    const rows = await this.db.select().from(sessions).where(eq(sessions.projectId, projectId));
    return rows.map(mapSession);
  }

  async appendEvent(input: Omit<SessionEvent, "id" | "createdAt">): Promise<SessionEvent> {
    const [row] = await this.db
      .insert(sessionEvents)
      .values({
        sessionId: input.sessionId,
        type: input.type,
        payload: input.payload,
      })
      .returning();
    if (!row) {
      throw new Error("failed to append session event");
    }
    return mapEvent(row);
  }

  async events(sessionId: string): Promise<SessionEvent[]> {
    const rows = await this.db
      .select()
      .from(sessionEvents)
      .where(eq(sessionEvents.sessionId, sessionId))
      .orderBy(sessionEvents.id);
    return rows.map(mapEvent);
  }
}
