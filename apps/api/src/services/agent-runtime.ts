import { randomUUID } from "node:crypto";
import type { RailwayClient } from "@factory/adapters-railway";
import type { AgentSession, SessionEvent, SessionStatus, SessionStore } from "@factory/core";
import { redactValue } from "@factory/core";

export type { AgentSession, SessionEvent, SessionStatus } from "@factory/core";

export interface StartSessionInput {
  projectId: string;
  stage: string;
  prompt: string;
  maxMinutes?: number;
}

export interface AgentRuntime {
  start(input: StartSessionInput): Promise<AgentSession>;
  get(sessionId: string): Promise<AgentSession | null>;
  listByProject(projectId: string): Promise<AgentSession[]>;
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
  store: SessionStore;
  image?: string;
  now?: () => Date;
}

export function createAgentRuntime(options: AgentRuntimeOptions): AgentRuntime {
  const now = options.now ?? (() => new Date());
  const image = options.image ?? "ghcr.io/quinoto/factory-runner:latest";

  function isActive(session: AgentSession): boolean {
    return session.status === "running" || session.status === "provisioning";
  }

  async function terminate(session: AgentSession, status: SessionStatus): Promise<AgentSession> {
    if (session.runnerServiceId) {
      await options.railway.deleteRunner(session.runnerServiceId);
    }
    session.status = status;
    session.endedAt = now().toISOString();
    await options.store.update(session);
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
      await options.store.create(session);

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
        await options.store.update(session);
        return session;
      } catch (error) {
        session.status = "failed";
        session.endedAt = now().toISOString();
        await options.store.update(session);
        throw error;
      }
    },

    get: (sessionId: string) => options.store.get(sessionId),

    listByProject: (projectId: string) => options.store.listByProject(projectId),

    async cancel(sessionId: string): Promise<AgentSession> {
      const session = await options.store.get(sessionId);
      if (!session) {
        throw new SessionError("session_not_found", "session not found");
      }
      if (!isActive(session)) {
        throw new SessionError("session_not_active", "session is not active");
      }
      return terminate(session, "cancelled");
    },

    events: (sessionId: string) => options.store.events(sessionId),

    async appendEvent(sessionId: string, type: string, payload: unknown): Promise<SessionEvent> {
      const session = await options.store.get(sessionId);
      if (!session) {
        throw new SessionError("session_not_found", "session not found");
      }
      return options.store.appendEvent({ sessionId, type, payload: redactValue(payload) });
    },

    async reconcileTimeouts(at = now()): Promise<string[]> {
      const active = await options.store.listActive();
      const timedOut: string[] = [];
      for (const session of active) {
        const ageMinutes = (at.getTime() - Date.parse(session.startedAt)) / 60_000;
        if (ageMinutes >= session.maxMinutes) {
          await terminate(session, "timed_out");
          timedOut.push(session.id);
        }
      }
      return timedOut;
    },

    async reconcileOrphans(): Promise<string[]> {
      const active = await options.store.listActive();
      const activeRunners = new Set(
        active
          .filter((session) => session.runnerServiceId)
          .map((session) => session.runnerServiceId as string),
      );
      const runners = await options.railway.listRunners();
      const orphans = runners.filter((runner) => !activeRunners.has(runner.serviceId));
      for (const runner of orphans) {
        await options.railway.deleteRunner(runner.serviceId);
      }
      return orphans.map((runner) => runner.serviceId);
    },
  };
}
