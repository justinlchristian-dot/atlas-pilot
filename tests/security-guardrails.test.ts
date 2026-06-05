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
});
