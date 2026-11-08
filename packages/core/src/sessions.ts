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

export interface SessionStore {
  create(session: AgentSession): Promise<void>;
  get(id: string): Promise<AgentSession | null>;
  update(session: AgentSession): Promise<void>;
  listActive(): Promise<AgentSession[]>;
  listByProject(projectId: string): Promise<AgentSession[]>;
  appendEvent(input: Omit<SessionEvent, "id" | "createdAt">): Promise<SessionEvent>;
  events(sessionId: string): Promise<SessionEvent[]>;
}
