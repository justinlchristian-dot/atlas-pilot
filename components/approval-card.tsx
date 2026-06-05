"use client";

import { useState } from "react";
import {
  Ban,
  Check,
  Clock3,
  EyeOff,
  FilePenLine,
  ShieldAlert,
} from "lucide-react";
import type { ApprovalItem, ApprovalStatus } from "@/data/approvals";
import {
  ApprovalStatusPill,
  ConfidencePill,
  RiskPill,
} from "@/components/approval-pills";

type ApprovalCardProps = {
  item: ApprovalItem;
  onDecision: (
    itemId: string,
    status: Exclude<ApprovalStatus, "Needs Review">,
    note?: string,
  ) => void;
};

const actionButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ink-950/20";

export function ApprovalCard({ item, onDecision }: ApprovalCardProps) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(item.preview);

  function saveEdit() {
    onDecision(item.id, "Edited", note.trim() || "Edited preview saved.");
    setEditing(false);
  }

  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-atlas-line bg-atlas-cloud px-2.5 py-1 text-xs font-medium text-ink-600">
              {item.category}
            </span>
            <span className="rounded-full border border-atlas-line bg-white px-2.5 py-1 text-xs font-medium text-ink-600">
              {item.origin}
            </span>
            <ApprovalStatusPill status={item.status} />
            <ConfidencePill confidence={item.confidence} />
            <RiskPill risk={item.risk} />
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-normal text-ink-950">
            {item.title}
          </h2>
          <p className="mt-2 text-[15px] leading-7 text-ink-600">
            {item.summary}
          </p>
        </div>

        {item.draftOnly ? (
          <div className="flex max-w-sm gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-900">
            <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
            <p className="text-sm leading-6">
              Draft only. Review recommended before any legal or HOA message is sent.
            </p>
          </div>
        ) : null}
        {!item.draftOnly && item.reviewRecommended ? (
          <div className="flex max-w-sm gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
            <p className="text-sm leading-6">
              Review recommended before approving this prepared action.
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Why it matters
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            {item.whyItMatters}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">Source</p>
          <p className="mt-2 text-sm leading-6 text-ink-700">{item.source}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-atlas-line bg-white p-4">
        <p className="text-xs font-semibold uppercase text-ink-500">
          Action preview
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-700">{item.preview}</p>
      </div>

      {editing ? (
        <div className="mt-3 rounded-lg border border-atlas-tide/30 bg-atlas-tide/10 p-4">
          <label
            htmlFor={`edit-${item.id}`}
            className="text-sm font-semibold text-ink-950"
          >
            Edit preview note
          </label>
          <textarea
            id={`edit-${item.id}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-3 min-h-28 w-full rounded-lg border border-atlas-line bg-white p-3 text-sm leading-6 text-ink-800 outline-none transition focus:border-atlas-tide focus:ring-2 focus:ring-atlas-tide/20"
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={saveEdit}
              className={`${actionButtonClass} border-atlas-tide bg-atlas-tide text-white`}
            >
              Save edit
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className={`${actionButtonClass} border-atlas-line bg-white text-ink-600`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <button
          type="button"
          onClick={() => onDecision(item.id, "Approved")}
          className={`${actionButtonClass} border-emerald-200 bg-emerald-50 text-emerald-800`}
        >
          <Check aria-hidden="true" size={16} />
          Approve
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={`${actionButtonClass} border-sky-200 bg-sky-50 text-sky-800`}
        >
          <FilePenLine aria-hidden="true" size={16} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDecision(item.id, "Snoozed")}
          className={`${actionButtonClass} border-amber-200 bg-amber-50 text-amber-800`}
        >
          <Clock3 aria-hidden="true" size={16} />
          Snooze
        </button>
        <button
          type="button"
          onClick={() => onDecision(item.id, "Rejected")}
          className={`${actionButtonClass} border-rose-200 bg-rose-50 text-rose-800`}
        >
          <Ban aria-hidden="true" size={16} />
          Reject
        </button>
        <button
          type="button"
          onClick={() => onDecision(item.id, "Hidden")}
          className={`${actionButtonClass} border-slate-200 bg-slate-50 text-slate-700`}
        >
          <EyeOff aria-hidden="true" size={16} />
          Never show again
        </button>
      </div>
    </article>
  );
}
