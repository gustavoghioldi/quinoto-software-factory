"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WorkflowPanel } from "@/components/workflow-panel";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";

export default function ApprovalsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listProjects()
      .then((data) => {
        setProjects(data.projects);
        setSelected(data.projects[0]?.id ?? "");
      })
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "No se pudieron cargar los proyectos"),
      );
  }, []);

  const project = projects?.find((item) => item.id === selected) ?? null;

  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "3rem",
        maxWidth: 820,
        lineHeight: 1.6,
      }}
    >
      <p style={{ marginBottom: "0.25rem" }}>
        <Link href="/" style={{ color: "#1a5fb4" }}>
          ← Volver al dashboard
        </Link>
      </p>
      <h1 style={{ marginBottom: "0.5rem" }}>Aprobaciones y workflow</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Revisá la etapa actual y aprobá los artefactos que bloquean el avance.
      </p>

      {error ? (
        <div role="alert" style={{ border: "1px solid #f0b4b4", borderRadius: 8, padding: "1rem" }}>
          {error}
        </div>
      ) : null}

      {!projects ? <p>Cargando proyectos…</p> : null}

      {projects && projects.length === 0 ? (
        <p>
          No hay proyectos todavía.{" "}
          <Link href="/projects/new" style={{ color: "#1a5fb4" }}>
            Conectar GitHub
          </Link>
        </p>
      ) : null}

      {projects && projects.length > 0 ? (
        <>
          <label style={{ display: "grid", gap: "0.35rem", maxWidth: 360, marginBottom: "1.5rem" }}>
            Proyecto
            <select
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
              style={{ border: "1px solid #ccc", borderRadius: 6, padding: "0.5rem" }}
            >
              {projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          {project ? <WorkflowPanel project={project} /> : null}
        </>
      ) : null}
    </main>
  );
}
