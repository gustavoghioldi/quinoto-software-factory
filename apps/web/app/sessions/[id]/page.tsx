import Link from "next/link";
import { SessionViewer } from "@/components/session-viewer";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
        <Link href="/approvals" style={{ color: "#1a5fb4" }}>
          ← Volver a aprobaciones
        </Link>
      </p>
      <h1 style={{ marginBottom: "0.5rem" }}>Sesión de agente</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Logs en vivo del runner y control de cancelación.
      </p>
      <SessionViewer sessionId={id} />
    </main>
  );
}
