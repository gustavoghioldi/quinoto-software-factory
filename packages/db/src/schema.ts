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
