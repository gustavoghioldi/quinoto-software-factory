"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";

export function ProjectList() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    setProjects(null);
    api
      .listProjects()
      .then((data) => setProjects(data.projects))
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "No se pudieron cargar los proyectos"),
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div role="alert" style={{ border: "1px solid #f0b4b4", borderRadius: 8, padding: "1rem" }}>
        <p style={{ marginTop: 0 }}>No se pudieron cargar los proyectos: {error}</p>
        <button onClick={load} style={buttonStyle}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!projects) {
    return <p>Cargando proyectos…</p>;
  }

  if (projects.length === 0) {
    return (
      <div style={{ border: "1px dashed #ccc", borderRadius: 8, padding: "1.5rem" }}>
        <p style={{ marginTop: 0 }}>Todavía no hay proyectos.</p>
        <Link href="/projects/new" style={{ color: "#1a5fb4", fontWeight: 600 }}>
          Conectar tu primer repositorio
        </Link>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
      {projects.map((project) => (
        <li
          key={project.id}
          style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: "0.75rem 1rem" }}
        >
          <strong>{project.name}</strong>
          <div style={{ color: "#555", fontSize: 14, marginTop: 4 }}>
            {project.repoFullName} · {project.defaultBranch} · {project.status}
          </div>
        </li>
      ))}
    </ul>
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
