import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import type { LucideIcon } from "lucide-react";

type PagePlaceholderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function PagePlaceholder({
  title,
  description,
  icon: Icon,
}: PagePlaceholderProps) {
  return (
    <AppShell>
      <section className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-atlas-line/80 bg-white/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-tide">
                <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-normal text-ink-950">
                {title}
              </h1>
              <p className="mt-3 text-base leading-7 text-ink-600">{description}</p>
            </div>
            <StatusPill status="Quiet" />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
