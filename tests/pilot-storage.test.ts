import { describe, expect, it } from "vitest";
import {
  getAllAtlasPilotStorageKeys,
  getPilotStorageKeysForScope,
  resetAtlasPilotStorage,
} from "../data/pilot-storage";

function createMockStorage() {
  const values = new Map<string, string>();

  return {
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
    has(key: string) {
      return values.has(key);
    },
    keys() {
      return [...values.keys()];
    },
  };
}

describe("pilot storage reset helpers", () => {
  it("targets only onboarding keys for onboarding reset", () => {
    expect(getPilotStorageKeysForScope("onboarding")).toEqual([
      "atlas-pilot-onboarding-v1",
      "atlas-pilot-active-persona-v1",
    ]);
  });

  it("targets workflow keys for approvals and audit reset", () => {
    expect(getPilotStorageKeysForScope("workflow")).toEqual([
      "atlas-pilot-approvals-v02",
      "atlas-pilot-audit-v02",
    ]);
  });

  it("clears only Atlas keys for the selected reset scope", () => {
    const storage = createMockStorage();
    storage.setItem("atlas-pilot-onboarding-v1", "pilot");
    storage.setItem("atlas-pilot-active-persona-v1", "persona");
    storage.setItem("atlas-pilot-audit-v02", "audit");
    storage.setItem("unrelated-app-key", "keep");

    const cleared = resetAtlasPilotStorage(storage, "onboarding");

    expect(cleared).toEqual([
      "atlas-pilot-onboarding-v1",
      "atlas-pilot-active-persona-v1",
    ]);
    expect(storage.has("atlas-pilot-onboarding-v1")).toBe(false);
    expect(storage.has("atlas-pilot-active-persona-v1")).toBe(false);
    expect(storage.has("atlas-pilot-audit-v02")).toBe(true);
    expect(storage.has("unrelated-app-key")).toBe(true);
  });

  it("full reset clears all known Atlas pilot keys and preserves unrelated storage", () => {
    const storage = createMockStorage();
    getAllAtlasPilotStorageKeys().forEach((key) => storage.setItem(key, "pilot"));
    storage.setItem("unrelated-app-key", "keep");

    const cleared = resetAtlasPilotStorage(storage, "all");

    expect(cleared).toEqual(getAllAtlasPilotStorageKeys());
    expect(storage.keys()).toEqual(["unrelated-app-key"]);
  });
});
