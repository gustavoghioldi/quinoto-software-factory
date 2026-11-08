"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import type { Repository } from "@/lib/types";

type Phase = "loading" | "install" | "select" | "error";

export function GitHubConnect() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [repoFullName, setRepoFullName] = useState("");
  const [branch, setBranch] = useState("main");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadRepositories = useCallback(() => {
    setPhase("loading");
    setError(null);
    api
      .listRepositories()
      .then((data) => {
        setRepositories(data.repositories);
        setPhase("select");
      })
      .catch((cause: unknown) => {
        if (cause instanceof ApiError && cause.status === 409) {
          setPhase("install");
          return;
        }
        setError(cause instanceof Error ? cause.message : "No se pudieron cargar los repos");
        setPhase("error");
      });
  }, []);

  useEffect(() => {
    loadRepositories();
  }, [loadRepositories]);

  const startInstallation = async () => {
    setPhase("loading");
    setError(null);
    try {
      const manifest = await api.getManifest();
      const state = crypto.randomUUID();
      sessionStorage.setItem("factory.manifest.state", state);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = `https://github.com/settings/apps/new?state=${encodeURIComponent(state)}`;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "manifest";
      input.value = JSON.stringify(manifest);
      form.appendChild(input);

      document.body.appendChild(form);
      form.submit();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo iniciar la instalación");
      setPhase("error");
    }
  };

  const createProject = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createProject({ name, repoFullName, defaultBranch: branch });
      window.location.href = "/";
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear el proyecto");
      setSubmitting(false);
    }
  };

  if (phase === "loading") {
    return <p>Verificando la conexión con GitHub…</p>;
  }

  if (phase === "install") {
    return (
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: "1.25rem" }}>
        <p style={{ marginTop: 0 }}>
          La GitHub App todavía no está instalada en esta instancia. Vas a crear la app en tu cuenta
          y luego elegir el repositorio.
        </p>
        <p style={{ color: "#666", fontSize: 14 }}>
          Para recibir webhooks, <code>FACTORY_BASE_URL</code> debe ser una URL pública (túnel o
          dominio).
        </p>
        <button onClick={startInstallation} style={buttonStyle}>
          Instalar GitHub App
        </button>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div role="alert" style={{ border: "1px solid #f0b4b4", borderRadius: 8, padding: "1rem" }}>
        <p style={{ marginTop: 0 }}>{error}</p>
        <button onClick={loadRepositories} style={buttonStyle}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={createProject} style={{ display: "grid", gap: "1rem", maxWidth: 520 }}>
      <label style={labelStyle}>
        Repositorio
        <select
          value={repoFullName}
          onChange={(event) => {
            const selected = repositories.find((repo) => repo.fullName === event.target.value);
            setRepoFullName(event.target.value);
            setBranch(selected?.defaultBranch ?? "main");
            setName(selected?.fullName.split("/")[1] ?? "");
          }}
          required
          style={inputStyle}
        >
          <option value="">Seleccioná un repositorio</option>
          {repositories.map((repo) => (
            <option key={repo.id} value={repo.fullName}>
              {repo.fullName} {repo.private ? "(privado)" : ""}
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Branch base
        <input
          value={branch}
          onChange={(event) => setBranch(event.target.value)}
          required
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Nombre del proyecto
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          style={inputStyle}
        />
      </label>

      {error ? <p style={{ color: "#a51d1d", margin: 0 }}>{error}</p> : null}

      <button type="submit" disabled={submitting} style={buttonStyle}>
        {submitting ? "Creando…" : "Crear proyecto"}
      </button>
    </form>
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
