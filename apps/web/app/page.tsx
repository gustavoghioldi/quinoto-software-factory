import Link from "next/link";
import { ProjectList } from "@/components/project-list";

export default function HomePage() {
  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "3rem",
        maxWidth: 820,
        lineHeight: 1.6,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Quinoto Software Factory</h1>
          <p style={{ marginTop: 0, color: "#555" }}>
            Plano de control self-hosted para OpenCode + QuinotoSpec.
          </p>
        </div>
        <Link
          href="/projects/new"
          style={{
            background: "#1a5fb4",
            color: "white",
            borderRadius: 6,
            padding: "0.5rem 1rem",
            textDecoration: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Nuevo proyecto
        </Link>
      </header>

      <section>
        <h2 style={{ fontSize: "1.15rem" }}>Proyectos</h2>
        <ProjectList />
      </section>
    </main>
  );
}
