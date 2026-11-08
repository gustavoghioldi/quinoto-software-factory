"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Approval, Project, Workflow } from "@/lib/types";

export function WorkflowPanel({ project }: { project: Project }) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [notStarted, setNotStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [current, history] = await Promise.all([
        api.getWorkflow(project.id),
        api.listApprovals(project.id),
      ]);
      setWorkflow(current);
      setApprovals(history.approvals);
      setNotStarted(false);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 404) {
        setWorkflow(null);
        setNotStarted(true);
        return;
      }
      setError(cause instanceof Error ? cause.message : "No se pudo cargar el workflow");
    }
  }, [project.id]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La acción falló");
    } finally {
      setBusy(false);
    }
  };

  const approveProposal = () =>
    run(async () => {
      await api.createApproval({
        projectId: project.id,
        subject: "proposal",
        decision: "approved",
        decidedBy: "operator",
        scope: "proposal",
        rationale: "Aprobado desde la UI",
      });
      await api.advanceWorkflow(project.id, "user_stories");
    });

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: "1rem" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>{project.name}</h2>
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
          {project.repoFullName} · {project.defaultBranch}
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          style={{ border: "1px solid #f0b4b4", borderRadius: 8, padding: "0.75rem" }}
        >
          {error}
        </div>
      ) : null}

      {notStarted ? (
        <div style={{ border: "1px dashed #ccc", borderRadius: 8, padding: "1rem" }}>
          <p style={{ marginTop: 0 }}>El workflow todavía no arrancó.</p>
          <button
            onClick={() => run(() => api.startWorkflow(project.id))}
            disabled={busy}
            style={buttonStyle}
          >
            {busy ? "Iniciando…" : "Iniciar workflow"}
          </button>
        </div>
      ) : null}

      {workflow ? (
        <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: "1rem" }}>
          <p style={{ marginTop: 0 }}>
            Etapa actual: <strong>{workflow.currentStage}</strong> · Estado:{" "}
            <strong>{workflow.status}</strong>
          </p>
          <ol style={{ margin: "0.5rem 0 1rem", paddingLeft: "1.25rem", color: "#444" }}>
            {workflow.stages.map((stage) => (
              <li key={stage.stage} style={{ marginBottom: 4 }}>
                <code>{stage.stage}</code> — {stage.status}
                {stage.attempts > 1 ? ` (intento ${stage.attempts})` : ""}
                {stage.error ? ` · ${stage.error}` : ""}
              </li>
            ))}
          </ol>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {workflow.currentStage === "approval_proposal" ? (
              <button onClick={approveProposal} disabled={busy} style={buttonStyle}>
                {busy ? "Aprobando…" : "Aprobar propuesta"}
              </button>
            ) : null}
            {workflow.status === "failed" ? (
              <button
                onClick={() => run(() => api.retryWorkflow(project.id))}
                disabled={busy}
                style={secondaryButtonStyle}
              >
                Reintentar etapa
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div>
        <h3 style={{ fontSize: "1rem" }}>Historial de aprobaciones</h3>
        {approvals.length === 0 ? (
          <p style={{ color: "#666" }}>Sin aprobaciones registradas.</p>
        ) : (
          <ul style={{ paddingLeft: "1.25rem", color: "#444" }}>
            {approvals.map((approval) => (
              <li key={approval.id} style={{ marginBottom: 6 }}>
                <strong>{approval.subject}</strong> — {approval.decision} por {approval.decidedBy} (
                {new Date(approval.decidedAt).toLocaleString()})
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

const buttonStyle = {
  border: "1px solid #1a5fb4",
  background: "#1a5fb4",
  color: "white",
  borderRadius: 6,
  padding: "0.45rem 0.9rem",
  cursor: "pointer",
} as const;

const secondaryButtonStyle = {
  border: "1px solid #1a5fb4",
  background: "white",
  color: "#1a5fb4",
  borderRadius: 6,
  padding: "0.45rem 0.9rem",
  cursor: "pointer",
} as const;
