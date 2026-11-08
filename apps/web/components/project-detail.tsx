"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import type { Deployment, ProjectOverview, RailwayLink } from "@/lib/types";

export function ProjectDetail({ projectId }: { projectId: string }) {
  const [overview, setOverview] = useState<ProjectOverview | null>(null);
  const [link, setLink] = useState<RailwayLink | null>(null);
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [railwayProjectId, setRailwayProjectId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [environmentId, setEnvironmentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await api.listOverview();
      setOverview(data.projects.find((project) => project.id === projectId) ?? null);

      try {
        const current = await api.getRailwayLink(projectId);
        setLink(current);
        setRailwayProjectId(current.railwayProjectId);
        setServiceId(current.serviceId);
        setEnvironmentId(current.environmentId);
      } catch (cause) {
        if (cause instanceof ApiError && cause.status === 404) {
          setLink(null);
        }
      }

      try {
        setDeployment(await api.getDeploy(projectId));
      } catch {
        setDeployment(null);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar el proyecto");
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const linkRailway = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setLink(await api.linkRailway(projectId, { railwayProjectId, serviceId, environmentId }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo vincular Railway");
    } finally {
      setBusy(false);
    }
  };

  const deploy = async () => {
    setBusy(true);
    setError(null);
    try {
      setDeployment(await api.triggerDeploy(projectId));
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo disparar el deploy");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section style={{ display: "grid", gap: "1.25rem" }}>
      {error ? (
        <div
          role="alert"
          style={{ border: "1px solid #f0b4b4", borderRadius: 8, padding: "0.75rem" }}
        >
          {error}
        </div>
      ) : null}

      {!overview ? (
        <p>Cargando proyecto…</p>
      ) : (
        <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: "1rem" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.15rem" }}>{overview.name}</h2>
          <p style={{ margin: 0, color: "#555" }}>
            {overview.repoFullName} · {overview.defaultBranch}
          </p>
          <p style={{ marginBottom: 0 }}>
            Etapa: <strong>{overview.workflow?.currentStage ?? "sin workflow"}</strong> · Estado:{" "}
            <strong>{overview.workflow?.status ?? "—"}</strong>
          </p>
        </div>
      )}

      <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: "1rem" }}>
        <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Railway</h3>
        <form onSubmit={linkRailway} style={{ display: "grid", gap: "0.6rem", maxWidth: 520 }}>
          <label style={labelStyle}>
            Railway Project ID
            <input
              value={railwayProjectId}
              onChange={(event) => setRailwayProjectId(event.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Service ID
            <input
              value={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Environment ID
            <input
              value={environmentId}
              onChange={(event) => setEnvironmentId(event.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="submit" disabled={busy} style={secondaryButtonStyle}>
              {link ? "Actualizar vínculo" : "Vincular Railway"}
            </button>
            <button type="button" onClick={deploy} disabled={busy || !link} style={buttonStyle}>
              {busy ? "Procesando…" : "Deploy"}
            </button>
          </div>
        </form>

        {deployment ? (
          <p style={{ marginBottom: 0 }}>
            Último deploy: <strong>{deployment.status}</strong>
            {deployment.url ? (
              <>
                {" · "}
                <a href={deployment.url} target="_blank" rel="noreferrer">
                  {deployment.url}
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </section>
  );
}

const buttonStyle = {
  border: "1px solid #1a5fb4",
  background: "#1a5fb4",
  color: "white",
  borderRadius: 6,
  padding: "0.5rem 1rem",
  cursor: "pointer",
} as const;

const secondaryButtonStyle = {
  border: "1px solid #1a5fb4",
  background: "white",
  color: "#1a5fb4",
  borderRadius: 6,
  padding: "0.5rem 1rem",
  cursor: "pointer",
} as const;

const labelStyle = {
  display: "grid",
  gap: "0.35rem",
  fontSize: 14,
  fontWeight: 600,
} as const;

const inputStyle = {
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: "0.5rem 0.6rem",
  fontSize: 14,
  fontWeight: 400,
} as const;
