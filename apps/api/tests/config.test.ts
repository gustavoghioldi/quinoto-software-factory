import { ConfigError, loadConfig } from "@factory/core";
import { describe, expect, it } from "vitest";

describe("api environment", () => {
  it("loads a valid environment", () => {
    const config = loadConfig({ PORT: "4100" });
    expect(config.PORT).toBe(4100);
  });

  it("fails fast with the variable name", () => {
    expect(() => loadConfig({ PORT: "-1" })).toThrow(ConfigError);
  });
});
