import Link from "next/link";
import { ProjectDetail } from "@/components/project-detail";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
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
        <Link href="/" style={{ color: "#1a5fb4" }}>
          ← Volver al dashboard
        </Link>
      </p>
      <h1 style={{ marginBottom: "0.5rem" }}>Proyecto</h1>
      <ProjectDetail projectId={id} />
    </main>
  );
}
