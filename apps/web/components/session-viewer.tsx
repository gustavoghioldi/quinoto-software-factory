"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AgentSession, SessionEvent } from "@/lib/types";

export function SessionViewer({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<AgentSession | null>(null);
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
              maxHeight: 480,
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
    </section>
  );
}
