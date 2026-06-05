import { describe, expect, it } from "vitest";
import { createAuditEvent, mockApprovalItems, type ApprovalItem } from "../data/approvals";
import {
  cleanupHiddenRejected,
  normalizeApproval,
  normalizeAudit,
  normalizeOrigin,
  safeJsonParse,
} from "../hooks/use-workflow-store";

describe("workflow store core", () => {
  it("loads default approval items from seed data", () => {
    expect(mockApprovalItems.length).toBeGreaterThan(0);
    expect(mockApprovalItems.some((item) => item.status === "Needs Review")).toBe(true);
  });

  it("normalizes legacy approval records safely", () => {
    const item = normalizeApproval(
      {
        title: "Legacy household item",
        origin: "Home Operations" as ApprovalItem["origin"],
      },
      0,
    );

    expect(item.id).toBe("legacy-household-item-0");
    expect(item.origin).toBe("Household");
    expect(item.status).toBe("Needs Review");
    expect(item.createdAt).toBeTruthy();
  });

  it("normalizes legacy audit records safely", () => {
    const event = normalizeAudit(
      {
        timestamp: "2026-06-04T10:00:00.000Z",
        relatedItem: "Legacy item",
        risk: "High",
      },
      0,
    );

    expect(event.dateTime).toBe("2026-06-04T10:00:00.000Z");
    expect(event.riskLevel).toBe("High");
    expect(event.origin).toBe("Mock");
  });

  it("does not crash on malformed localStorage-shaped JSON", () => {
    expect(safeJsonParse("{not-json", [{ ok: true }])).toEqual([{ ok: true }]);
  });

  it("updates approval decisions by creating audit-style records", () => {
    const item = mockApprovalItems[0];
    const event = createAuditEvent(item, "Approved");

    expect(event.relatedItem).toBe(item.title);
    expect(event.userDecision).toBe("Approved");
    expect(event.result).toContain("No external action");
    expect(event.origin).toBe(item.origin);
  });

  it("cleans hidden and rejected approvals", () => {
    const [first, second, third] = mockApprovalItems;
    const visible = cleanupHiddenRejected([
      { ...first, status: "Hidden" },
      { ...second, status: "Rejected" },
      third,
    ]);

    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe(third.id);
  });

  it("normalizes unknown origins to Mock", () => {
    expect(normalizeOrigin("Unexpected")).toBe("Mock");
  });
});
