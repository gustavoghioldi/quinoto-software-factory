import { ApiStatus } from "@/components/api-status";

export default function HomePage() {
  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "3rem",
        maxWidth: 720,
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ marginBottom: "0.25rem" }}>Quinoto Software Factory</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Plano de control self-hosted para OpenCode + QuinotoSpec.
      </p>
      <ApiStatus />
    </main>
  );
}
