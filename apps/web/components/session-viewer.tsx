"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import type { AgentSession, PullRequestResult, SessionDiff, SessionEvent } from "@/lib/types";

export function SessionViewer({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<AgentSession | null>(null);
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [diff, setDiff] = useState<SessionDiff | null>(null);
  const [pullRequest, setPullRequest] = useState<PullRequestResult | null>(null);
  const [title, setTitle] = useState("");
  const [baseBranch, setBaseBranch] = useState("main");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .getSession(sessionId)
      .then((data) => {
        if (active) setSession(data);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof Error ? cause.message : "No se pudo cargar la sesión");
      });

    api
      .sessionEvents(sessionId)
      .then((data) => {
        if (active) setEvents(data.events);
      })
      .catch(() => undefined);

    api
      .getSessionDiff(sessionId)
      .then((data) => {
        if (active) setDiff(data);
      })
      .catch(() => {
        if (active) setDiff(null);
      });

    const source = new EventSource(api.sessionEventsUrl(sessionId));
    source.onmessage = (message) => {
      const event = JSON.parse(message.data) as SessionEvent;
      setEvents((current) =>
        current.some((item) => item.id === event.id) ? current : [...current, event],
      );
    };

    return () => {
      active = false;
      source.close();
    };
  }, [sessionId]);

  const cancel = async () => {
    setBusy(true);
    setError(null);
    try {
      setSession(await api.cancelSession(sessionId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cancelar la sesión");
    } finally {
      setBusy(false);
    }
  };

  const openPullRequest = async (event: FormEvent) => {
    event.preventDefault();
    setOpening(true);
    setError(null);
    try {
      setPullRequest(
        await api.openPullRequest(sessionId, {
          title,
          body: "Generado por Quinoto Software Factory",
          baseBranch,
        }),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo abrir el Pull Request");
    } finally {
      setOpening(false);
    }
  };

  const active = session?.status === "running" || session?.status === "provisioning";

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      {error ? (
        <div
          role="alert"
          style={{ border: "1px solid #f0b4b4", borderRadius: 8, padding: "0.75rem" }}
        >
          {error}
        </div>
      ) : null}

      {!session ? (
        <p>Cargando sesión…</p>
      ) : (
        <>
          <p style={{ margin: 0 }}>
            Estado: <strong>{session.status}</strong> · Etapa: <strong>{session.stage}</strong>
            {session.runnerServiceId ? ` · Runner: ${session.runnerServiceId}` : ""}
          </p>
          {active ? (
            <button
              onClick={cancel}
              disabled={busy}
              style={{
                border: "1px solid #a51d1d",
                background: "#a51d1d",
                color: "white",
                borderRadius: 6,
                padding: "0.45rem 0.9rem",
                cursor: "pointer",
                justifySelf: "start",
              }}
            >
              {busy ? "Cancelando…" : "Cancelar sesión"}
            </button>
          ) : null}
          <pre
            style={{
              background: "#111",
              color: "#eee",
              padding: "1rem",
              borderRadius: 8,
              maxHeight: 360,
              overflow: "auto",
              fontSize: 13,
              whiteSpace: "pre-wrap",
            }}
          >
            {events.length === 0
              ? "Sin eventos todavía."
              : events
                  .map((event) => `[${event.type}] ${JSON.stringify(event.payload)}`)
                  .join("\n")}
          </pre>
        </>
      )}

      <div>
        <h2 style={{ fontSize: "1.05rem" }}>Diff</h2>
        {diff ? (
          diff.files.map((file) => (
            <details
              key={file.path}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 6,
                padding: "0.5rem 0.75rem",
                marginBottom: 8,
              }}
            >
              <summary style={{ cursor: "pointer" }}>{file.path}</summary>
              <pre style={{ overflow: "auto", fontSize: 12 }}>{file.patch}</pre>
            </details>
          ))
        ) : (
          <p style={{ color: "#666" }}>Sin diff disponible para esta sesión.</p>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: "1.05rem" }}>Pull Request</h2>
        {pullRequest ? (
          <p>
            PR abierto:{" "}
            <a href={pullRequest.url} target="_blank" rel="noreferrer">
              #{pullRequest.number}
            </a>
          </p>
        ) : (
          <form
            onSubmit={openPullRequest}
            style={{ display: "grid", gap: "0.75rem", maxWidth: 520 }}
          >
            <label style={labelStyle}>
              Título
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Branch base
              <input
                value={baseBranch}
                onChange={(event) => setBaseBranch(event.target.value)}
                required
                style={inputStyle}
              />
            </label>
            <button type="submit" disabled={opening} style={buttonStyle}>
              {opening ? "Abriendo…" : "Crear Pull Request"}
            </button>
          </form>
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
  padding: "0.5rem 1rem",
  cursor: "pointer",
  justifySelf: "start",
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
