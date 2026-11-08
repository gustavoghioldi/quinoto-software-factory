import { loadConfig } from "./config.js";

const config = loadConfig();

console.log(
  `[worker] started (max session: ${config.MAX_SESSION_MINUTES}m, max sessions/project: ${config.MAX_SESSIONS_PER_PROJECT})`,
);
