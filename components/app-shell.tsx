"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Command,
  Home,
  ShoppingCart,
  ScrollText,
  Settings,
  Shield,
  UsersRound,
  UserRound,
} from "lucide-react";
import type { ApprovalItem } from "@/data/approvals";
import { approvalsStorageKey } from "@/hooks/use-workflow-store";

const navItems = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/command", label: "Life Map", icon: Command },
  { href: "/approvals", label: "Approvals", icon: CheckCircle2 },
  { href: "/shopping", label: "Shopping", icon: ShoppingCart },
  { href: "/personas", label: "Personas", icon: UsersRound },
  { href: "/onboarding", label: "Setup", icon: UserRound },
  { href: "/pilot-guide", label: "Pilot Guide", icon: BookOpen },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/vault", label: "Vault", icon: Shield },
  { href: "/audit", label: "Audit", icon: ScrollText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [approvalCount, setApprovalCount] = useState(0);

  useEffect(() => {
    function readApprovalCount() {
      try {
        const stored = window.localStorage.getItem(approvalsStorageKey);
        const approvals = stored ? (JSON.parse(stored) as ApprovalItem[]) : [];
        setApprovalCount(
          approvals.filter((approval) => approval.status === "Needs Review")
            .length,
        );
      } catch {
        setApprovalCount(0);
      }
    }

    readApprovalCount();
    window.addEventListener("storage", readApprovalCount);
    window.addEventListener("atlas-workflow-store-updated", readApprovalCount);

    return () => {
      window.removeEventListener("storage", readApprovalCount);
      window.removeEventListener(
        "atlas-workflow-store-updated",
        readApprovalCount,
      );
    };
  }, []);

  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-atlas-line/80 bg-atlas-cloud/86 px-4 py-6 backdrop-blur-xl lg:block">
        <Link href="/today" className="flex min-h-12 items-center gap-3 rounded-lg px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-950 text-white shadow-card">
            <Command aria-hidden="true" size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-normal text-ink-950">Atlas</p>
            <p className="text-xs text-ink-500">Pilot v1.4</p>
          </div>
        </Link>

        <nav aria-label="Primary" className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                  active
                    ? "bg-white text-ink-950 shadow-card"
                    : "text-ink-600 hover:bg-white/70 hover:text-ink-950"
                }`}
              >
                <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 rounded-lg border border-atlas-line bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Guardrail
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Atlas is read-only by default. External actions wait for explicit approval.
          </p>
          <Link
            href="/approvals"
            className="mt-3 inline-flex min-h-9 items-center rounded-full border border-atlas-line bg-atlas-cloud px-3 text-xs font-semibold text-ink-700"
          >
            {approvalCount} approvals need review
          </Link>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-atlas-line/70 bg-atlas-mist/82 px-4 py-3 backdrop-blur-xl sm:px-6 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/today" className="flex min-h-11 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-950 text-white">
                <Command aria-hidden="true" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-950">Atlas</p>
                <p className="text-xs text-ink-500">Pilot v1.4</p>
              </div>
            </Link>
            <span className="rounded-full border border-atlas-line bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-600">
              {approvalCount} approvals
            </span>
          </div>
          <nav
            aria-label="Primary"
            className="mt-3 flex gap-2 overflow-x-auto pb-1"
          >
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-10 shrink-0 items-center rounded-full border px-3 text-sm font-medium ${
                    active
                      ? "border-ink-950 bg-ink-950 text-white"
                      : "border-atlas-line bg-white/70 text-ink-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
