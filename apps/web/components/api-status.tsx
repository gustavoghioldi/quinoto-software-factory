"use client";

import { useEffect, useState } from "react";

type Status = "loading" | "ok" | "error";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function ApiStatus() {
  const [status, setStatus] = useState<Status>("loading");
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    fetch(`${apiUrl}/healthz`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<{ status: string }>;
      })
      .then((body) => {
        if (!cancelled) {
          setStatus(body.status === "ok" ? "ok" : "error");
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setStatus("error");
          setDetail(error instanceof Error ? error.message : "error desconocido");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return <p>Comprobando API…</p>;
  }

  if (status === "ok") {
    return <p>API conectada.</p>;
  }

  return <p>API no disponible ({detail}). Reintentá cuando el servicio esté arriba.</p>;
}
