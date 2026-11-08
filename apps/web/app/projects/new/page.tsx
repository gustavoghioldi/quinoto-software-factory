import Link from "next/link";
import { GitHubConnect } from "@/components/github-connect";

export default function NewProjectPage() {
  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "3rem",
        maxWidth: 720,
        lineHeight: 1.6,
      }}
    >
      <p style={{ marginBottom: "0.25rem" }}>
        <Link href="/" style={{ color: "#1a5fb4" }}>
          ← Volver al dashboard
        </Link>
      </p>
      <h1 style={{ marginBottom: "0.5rem" }}>Conectar GitHub</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Instalá la app, elegí el repositorio y el branch base. La factory nunca escribe directo en
        la rama principal.
      </p>
      <GitHubConnect />
    </main>
  );
}
