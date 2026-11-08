import { describe, expect, it } from "vitest";
import { ConfigError, loadConfig } from "./config.js";

describe("loadConfig", () => {
  it("applies safe defaults", () => {
    const config = loadConfig({});
    expect(config.PORT).toBe(4000);
    expect(config.MAX_SESSION_MINUTES).toBe(30);
    expect(config.TELEMETRY_ENABLED).toBe(false);
  });

  it("rejects an invalid port", () => {
    expect(() => loadConfig({ PORT: "not-a-number" })).toThrow(ConfigError);
  });

  it("names the invalid variable", () => {
    try {
      loadConfig({ MAX_SESSION_MINUTES: "0" });
      throw new Error("expected loadConfig to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect((error as ConfigError).issues.join(" ")).toContain("MAX_SESSION_MINUTES");
    }
  });

  it("parses boolean flags", () => {
    expect(loadConfig({ TELEMETRY_ENABLED: "true" }).TELEMETRY_ENABLED).toBe(true);
  });

  it("treats empty optional values as undefined", () => {
    const config = loadConfig({ FACTORY_MASTER_KEY: "", DATABASE_URL: "" });
    expect(config.FACTORY_MASTER_KEY).toBeUndefined();
    expect(config.DATABASE_URL).toBeUndefined();
  });
});
