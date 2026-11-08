import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const githubInstallations = pgTable("github_installations", {
  id: uuid("id").defaultRandom().primaryKey(),
  appId: text("app_id").notNull(),
  slug: text("slug").notNull(),
  clientId: text("client_id"),
  installationId: integer("installation_id"),
  accountLogin: text("account_login"),
  privateKeyCiphertext: text("private_key_ciphertext").notNull(),
  webhookSecretCiphertext: text("webhook_secret_ciphertext").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  repoFullName: text("repo_full_name").notNull(),
  defaultBranch: text("default_branch").notNull(),
  installationId: integer("installation_id").notNull(),
  status: text("status").notNull().default("ready"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workflowRuns = pgTable("workflow_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  currentStage: text("current_stage").notNull(),
  status: text("status").notNull().default("running"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workflowStages = pgTable("workflow_stages", {
  id: uuid("id").defaultRandom().primaryKey(),
  runId: uuid("run_id")
    .notNull()
    .references(() => workflowRuns.id, { onDelete: "cascade" }),
  stage: text("stage").notNull(),
  status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  error: text("error"),
});

export const artifacts = pgTable("artifacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  runId: uuid("run_id").references(() => workflowRuns.id, { onDelete: "set null" }),
  sessionId: uuid("session_id"),
  kind: text("kind").notNull(),
  path: text("path").notNull(),
  checksum: text("checksum").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const approvals = pgTable("approvals", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  decision: text("decision").notNull(),
  decidedBy: text("decided_by").notNull(),
  decidedAt: timestamp("decided_at", { withTimezone: true }).defaultNow().notNull(),
  scope: text("scope").notNull(),
  rationale: text("rationale").notNull(),
});
