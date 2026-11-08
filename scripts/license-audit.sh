#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

output="$(mktemp)"
trap 'rm -f "$output"' EXIT

pnpm licenses list --json > "$output"

node - "$output" <<'NODE'
const fs = require("node:fs");
const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const disallowed = ["SSPL", "BUSL", "UNLICENSED", "Commons Clause"];
const bad = [];

for (const [license, packages] of Object.entries(data)) {
  if (disallowed.some((token) => license.includes(token))) {
    for (const pkg of packages) {
      bad.push(`${pkg.name}@${pkg.versions} (${license})`);
    }
  }
}

if (bad.length > 0) {
  console.error("Disallowed licenses found:");
  for (const item of bad) console.error(`- ${item}`);
  process.exit(1);
}

console.log("License audit passed");
NODE
