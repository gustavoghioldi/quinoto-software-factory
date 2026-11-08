import { randomUUID } from "node:crypto";
import type { RailwayClient } from "@factory/adapters-railway";

export type SessionStatus =
  "provisioning" | "running" | "cancelled" | "completed" | "failed" | "timed_out";

export interface AgentSession {
  id: string;
  projectId: string;
  stage: string;
  prompt: string;
  status: SessionStatus;
  runnerServiceId: string | null;
  startedAt: string;
  endedAt: string | null;
  maxMinutes: number;
}

export interface SessionEvent {
  id: number;
  sessionId: string;
  type: string;
  payload: unknown;
  createdAt: string;
}

export interface StartSessionInput {
  projectId: string;
  stage: string;
  prompt: string;
  maxMinutes?: number;
}

export interface AgentRuntime {
  start(input: StartSessionInput): Promise<AgentSession>;
  get(sessionId: string): Promise<AgentSession | null>;
  cancel(sessionId: string): Promise<AgentSession>;
  events(sessionId: string): Promise<SessionEvent[]>;
  appendEvent(sessionId: string, type: string, payload: unknown): Promise<SessionEvent>;
  reconcileTimeouts(now?: Date): Promise<string[]>;
  reconcileOrphans(): Promise<string[]>;
}

export type SessionErrorCode = "session_not_found" | "session_not_active";

export class SessionError extends Error {
  constructor(
    public readonly code: SessionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SessionError";
  }
}

export interface AgentRuntimeOptions {
  railway: RailwayClient;
  image?: string;
  now?: () => Date;
}

export function createAgentRuntime(options: AgentRuntimeOptions): AgentRuntime {
  const sessions = new Map<string, AgentSession>();
  const events = new Map<string, SessionEvent[]>();
  const now = options.now ?? (() => new Date());
  const image = options.image ?? "ghcr.io/quinoto/factory-runner:latest";
  let nextEventId = 1;

  function isActive(session: AgentSession): boolean {
    return session.status === "running" || session.status === "provisioning";
  }

  async function terminate(session: AgentSession, status: SessionStatus): Promise<AgentSession> {
    if (session.runnerServiceId) {
      await options.railway.deleteRunner(session.runnerServiceId);
    }
    session.status = status;
    session.endedAt = now().toISOString();
    return session;
  }

  return {
    async start(input: StartSessionInput): Promise<AgentSession> {
      const session: AgentSession = {
        id: randomUUID(),
        projectId: input.projectId,
        stage: input.stage,
        prompt: input.prompt,
        status: "provisioning",
        runnerServiceId: null,
        startedAt: now().toISOString(),
        endedAt: null,
        maxMinutes: input.maxMinutes ?? 30,
      };
      sessions.set(session.id, session);
      events.set(session.id, []);

      try {
        const runner = await options.railway.createRunner({
          projectId: input.projectId,
          sessionId: session.id,
          image,
          env: {
            SESSION_ID: session.id,
            STAGE: input.stage,
            PROMPT: input.prompt,
          },
          maxMinutes: session.maxMinutes,
        });
        session.runnerServiceId = runner.serviceId;
        session.status = runner.status === "healthy" ? "running" : "provisioning";
        return session;
      } catch (error) {
        session.status = "failed";
        session.endedAt = now().toISOString();
        throw error;
      }
    },

    async get(sessionId: string): Promise<AgentSession | null> {
      return sessions.get(sessionId) ?? null;
    },

    async cancel(sessionId: string): Promise<AgentSession> {
      const session = sessions.get(sessionId);
      if (!session) {
        throw new SessionError("session_not_found", "session not found");
      }
      if (!isActive(session)) {
        throw new SessionError("session_not_active", "session is not active");
      }
      return terminate(session, "cancelled");
    },

    async events(sessionId: string): Promise<SessionEvent[]> {
      return events.get(sessionId) ?? [];
    },

    async appendEvent(sessionId: string, type: string, payload: unknown): Promise<SessionEvent> {
      const list = events.get(sessionId);
      if (!list) {
        throw new SessionError("session_not_found", "session not found");
      }
      const event: SessionEvent = {
        id: nextEventId++,
        sessionId,
        type,
        payload,
        createdAt: now().toISOString(),
      };
      list.push(event);
      return event;
    },

    async reconcileTimeouts(at = now()): Promise<string[]> {
      const timedOut: string[] = [];
      for (const session of sessions.values()) {
        if (!isActive(session)) {
          continue;
        }
        const ageMinutes = (at.getTime() - Date.parse(session.startedAt)) / 60_000;
        if (ageMinutes >= session.maxMinutes) {
          await terminate(session, "timed_out");
          timedOut.push(session.id);
        }
      }
      return timedOut;
    },

    async reconcileOrphans(): Promise<string[]> {
      const runners = await options.railway.listRunners();
      const activeRunners = new Set(
        [...sessions.values()]
          .filter((session) => isActive(session) && session.runnerServiceId)
          .map((session) => session.runnerServiceId as string),
      );
      const orphans = runners.filter((runner) => !activeRunners.has(runner.serviceId));
      for (const runner of orphans) {
        await options.railway.deleteRunner(runner.serviceId);
      }
      return orphans.map((runner) => runner.serviceId);
    },
  };
}
