import { ShieldCheck } from "lucide-react";

export function ShoppingRulesCard({ rules }: { rules: string[] }) {
  return (
    <article className="rounded-lg border border-atlas-line/80 bg-ink-950 p-5 text-white shadow-soft sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
          <ShieldCheck aria-hidden="true" size={19} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-sm font-medium text-white/64">
            Shopping rules / budget guardrails
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            Approval comes before checkout.
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Atlas prepares lists and explains tradeoffs. It does not order, pay,
            connect to stores, or set recurring purchases.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-2 md:grid-cols-2">
        {rules.map((rule) => (
          <div
            key={rule}
            className="rounded-lg border border-white/10 bg-white/8 p-3 text-sm leading-6 text-white/84"
          >
            {rule}
          </div>
        ))}
      </div>
    </article>
  );
}
