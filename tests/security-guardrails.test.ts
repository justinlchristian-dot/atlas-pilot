import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const sourceDirs = ["app", "components", "data", "hooks"];
const forbiddenFunctionNames = [
  "sendEmail",
  "sendText",
  "placeOrder",
  "submitPayment",
  "cancelSubscription",
  "contactVendor",
  "autoOrder",
  "autoPay",
  "executeExternalAction",
];

function filesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return filesIn(path);
    if (/\.(ts|tsx)$/.test(path)) return [path];
    return [];
  });
}

function sourceFiles() {
  return sourceDirs.flatMap(filesIn);
}

describe("security and privacy guardrails", () => {
  it("does not implement external-action function names", () => {
    const implementationPattern = new RegExp(
      String.raw`(?:function|const|let|var)\s+(${forbiddenFunctionNames.join("|")})\b|export\s+(?:async\s+)?function\s+(${forbiddenFunctionNames.join("|")})\b`,
    );

    const offenders = sourceFiles().filter((file) =>
      implementationPattern.test(readFileSync(file, "utf8")),
    );

    expect(offenders).toEqual([]);
  });

  it("does not commit obvious production API key placeholders or public secrets", () => {
    const secretPattern = /(sk-proj-|sk-live-|NEXT_PUBLIC_[A-Z0-9_]*(SECRET|TOKEN|KEY)\s*=)/;
    const offenders = sourceFiles().filter((file) =>
      secretPattern.test(readFileSync(file, "utf8")),
    );

    expect(offenders).toEqual([]);
  });

  it("does not call fetch in source modules for commerce, payment, or messaging integrations", () => {
    const endpointPattern = /fetch\s*\([^)]*(stripe|paypal|walmart|amazon|twilio|sendgrid|gmail|graph\.microsoft|checkout|payment|order)/i;
    const offenders = sourceFiles().filter((file) =>
      endpointPattern.test(readFileSync(file, "utf8")),
    );

    expect(offenders).toEqual([]);
  });

  it("documents the Bank-Grade Security Gate before real data or connectors", () => {
    const auditDoc = readFileSync("docs/cybersecurity-audit.md", "utf8");
    const roadmapDoc = readFileSync("docs/production-security-roadmap.md", "utf8");

    expect(auditDoc).toContain("Bank-Grade Security Gate");
    expect(auditDoc).toContain("No sensitive data in localStorage");
    expect(auditDoc).toContain("External security review before production");
    expect(roadmapDoc).toContain("Level 0: Mock Demo");
    expect(roadmapDoc).toContain("Level 6: External-Security-Reviewed Production");
  });

  it("documents connector token storage and approval limits", () => {
    const connectorDoc = readFileSync("docs/connector-security-model.md", "utf8");

    expect(connectorDoc).toContain("Connector tokens must live in a server-side token vault");
    expect(connectorDoc).toContain("Connector tokens must never be stored in browser localStorage");
    expect(connectorDoc).toMatch(
      /No connector may send, order, pay, cancel, message, modify, or contact a\s+vendor without explicit user approval/,
    );
  });

  it("documents Codex security-gate blocking rules", () => {
    const operatingRules = readFileSync("docs/codex-operating-rules.md", "utf8");

    expect(operatingRules).toContain("Codex may not implement real connectors");
    expect(operatingRules).toContain("Bank-Grade Security Gate is explicitly scoped and approved");
  });
});
