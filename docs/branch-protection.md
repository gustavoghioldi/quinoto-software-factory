# Branch protection

`main` es la rama protegida del proyecto. La configuración recomendada en GitHub es:

1. **Require a pull request before merging**.
2. **Require status checks to pass before merging**:
   - `quality` (workflow `CI`).
3. **Require branches to be up to date before merging**.
4. **Do not allow bypassing the above settings** (salvo administradores de emergencia).
5. **Require linear history** (opcional, recomendado).

## Cómo aplicarlo

Con GitHub CLI:

```bash
gh api -X PUT repos/{owner}/{repo}/branches/main/protection \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]="quality" \
  -f enforce_admins=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f restrictions=null
```

Verificar:

```bash
gh api repos/{owner}/{repo}/branches/main/protection
```

La app de la factory nunca escribe directo en `main`: crea branches y abre PRs (PA-004).
