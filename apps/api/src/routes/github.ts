import { buildGitHubAppManifest } from "@factory/adapters-github";
import type { FastifyInstance } from "fastify";
import type { ApiDependencies } from "../deps.js";

export async function registerGitHubRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.get("/github/manifest", async () =>
    buildGitHubAppManifest({
      name: deps.manifest.name,
      baseUrl: deps.manifest.baseUrl,
    }),
  );

  app.get("/github/manifest/callback", async (request, reply) => {
    const { code } = request.query as { code?: string };
    if (!code) {
      return reply.code(400).send({ error: "missing_code" });
    }

    const credentials = await deps.github.exchangeManifestCode(code);
    await deps.installations.save({
      appId: credentials.appId,
      slug: credentials.slug,
      clientId: credentials.clientId,
      installationId: null,
      accountLogin: null,
      privateKeyCiphertext: await deps.cipher.encrypt(credentials.privateKeyPem),
      webhookSecretCiphertext: await deps.cipher.encrypt(credentials.webhookSecret),
    });

    return reply.redirect(`https://github.com/apps/${credentials.slug}/installations/new`);
  });

  app.get("/github/callback", async (request, reply) => {
    const { installation_id: installationId } = request.query as { installation_id?: string };
    if (!installationId) {
      return reply.code(400).send({ error: "missing_installation_id" });
    }

    const latest = await deps.installations.findLatest();
    if (!latest) {
      return reply.code(409).send({ error: "github_app_not_configured" });
    }

    await deps.installations.updateInstallation(
      latest.id,
      Number(installationId),
      latest.accountLogin ?? "unknown",
    );
    return reply.redirect("/projects/new");
  });

  app.get("/github/repos", async (_request, reply) => {
    const latest = await deps.installations.findLatest();
    if (!latest?.installationId) {
      return reply.code(409).send({ error: "github_app_not_installed" });
    }

    const token = await deps.github.getInstallationToken(latest.installationId);
    return { repositories: await deps.github.listRepositories(token) };
  });
}
