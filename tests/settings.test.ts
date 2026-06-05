import { describe, expect, it } from "vitest";
import {
  applyApprovalRuleToggle,
  defaultAtlasSettings,
  mergeAtlasSettings,
  restoreHiddenRecommendationById,
} from "../data/settings";

describe("atlas settings core", () => {
  it("loads default settings with approval required autonomy", () => {
    expect(defaultAtlasSettings.autonomyMode).toBe("Approval required");
    expect(defaultAtlasSettings.modules.length).toBeGreaterThan(0);
  });

  it("round-trips settings through localStorage-compatible JSON", () => {
    const restored = mergeAtlasSettings(
      JSON.parse(JSON.stringify({ autonomyMode: "Prepare only" })),
    );

    expect(restored.autonomyMode).toBe("Prepare only");
    expect(restored.modules.length).toBe(defaultAtlasSettings.modules.length);
  });

  it("keeps locked approval rules enabled in pilot mode", () => {
    const lockedRule = defaultAtlasSettings.approvalRules.find((rule) => rule.locked);
    expect(lockedRule).toBeTruthy();

    const updated = applyApprovalRuleToggle(defaultAtlasSettings, lockedRule!.id, false);
    const sameRule = updated.approvalRules.find((rule) => rule.id === lockedRule!.id);

    expect(sameRule?.enabled).toBe(true);
  });

  it("restores hidden recommendations locally", () => {
    const hidden = defaultAtlasSettings.hiddenRecommendations[0];
    const updated = restoreHiddenRecommendationById(defaultAtlasSettings, hidden.id);

    expect(updated.hiddenRecommendations.find((item) => item.id === hidden.id)?.restored).toBe(true);
  });
});
