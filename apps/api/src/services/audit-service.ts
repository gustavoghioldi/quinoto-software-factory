import { redactValue } from "@factory/core";
import type { AuditEntry, AuditRepository, NewAuditEntry } from "@factory/db";

export interface AuditService {
  record(entry: NewAuditEntry): Promise<void>;
  list(projectId: string): Promise<AuditEntry[]>;
}

export function createAuditService(repository: AuditRepository): AuditService {
  return {
    async record(entry: NewAuditEntry): Promise<void> {
      await repository.append({
        ...entry,
        detail: entry.detail === undefined ? null : redactValue(entry.detail),
      });
    },
    list: (projectId: string) => repository.listByProject(projectId),
  };
}
