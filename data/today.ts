import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  CloudSun,
  Home,
  Inbox,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Status = "Good" | "Watch" | "Needs Attention" | "Quiet";

export type BriefCard = {
  title: string;
  status: Status;
  description: string;
  detail?: string;
  icon: LucideIcon;
};

export const topFive = [
  "Review priority emails",
  "Check household maintenance",
  "Approve air filter reorder",
  "Send 3 work follow-ups",
  "Schedule project content",
];

export const approvals = [
  "Air filter reorder",
  "Work follow-up draft",
  "Grocery list approval",
];

export const todayCards: BriefCard[] = [
  {
    title: "Daily Brief",
    status: "Good",
    description:
      "A calm day with one meeting, a clean morning block, and a few practical home and work items worth moving.",
    detail: "Read-only pilot mode. External actions require approval.",
    icon: ShieldCheck,
  },
  {
    title: "Weather Impact",
    status: "Watch",
    description:
      "Mock pilot weather may affect routines if they apply to your setup, such as errands, plants, pets, or home comfort checks.",
    icon: CloudSun,
  },
  {
    title: "Calendar Summary",
    status: "Good",
    description:
      "Mock pilot calendar shows an example schedule shape only. No real calendar account is connected.",
    icon: CalendarDays,
  },
  {
    title: "Needs Approval",
    status: "Needs Attention",
    description:
      "Three proposed actions are staged for review before Atlas does anything outside the app.",
    detail: "Air filter reorder, work follow-up draft, grocery list approval.",
    icon: Bell,
  },
  {
    title: "Money Watch",
    status: "Watch",
    description:
      "Groceries and household supplier spending are pacing high. One refund is still pending.",
    icon: CircleDollarSign,
  },
  {
    title: "Household Tasks",
    status: "Watch",
    description: "Household check due. Air filters due in 9 days.",
    icon: Home,
  },
  {
    title: "Waiting On",
    status: "Needs Attention",
    description:
      "HOA response waiting 9 days. Supplier pricing waiting 5 days.",
    icon: Inbox,
  },
  {
    title: "Work",
    status: "Good",
    description: "3 work follow-ups worth doing today.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Projects",
    status: "Quiet",
    description: "No content scheduled after Thursday.",
    icon: Wrench,
  },
];

export const placeholderPages = {
  command: {
    title: "Command",
    description:
      "A future command center for drafting requests, reviewing intent, and converting approved plans into action.",
    icon: ClipboardList,
  },
  approvals: {
    title: "Approvals",
    description:
      "A future review queue for messages, purchases, reminders, and any external action before it happens.",
    icon: CheckCircle2,
  },
  calendar: {
    title: "Calendar",
    description:
      "A future read-only calendar lens for schedule shape, conflicts, focus blocks, and family context. Not connected to real calendar accounts.",
    icon: CalendarDays,
    placeholderNote:
      "No real calendar data is connected. This module is planned for later and will stay read-only until explicit permissions exist.",
  },
  vault: {
    title: "Vault",
    description:
      "A future private reference space for trusted context, preferences, routines, and important household details. Not connected to real documents.",
    icon: ShieldCheck,
    placeholderNote:
      "No real document data is connected. This module is planned for later and must use secure storage before real files or sensitive records are added.",
  },
  audit: {
    title: "Audit",
    description:
      "A future activity log showing what Atlas read, summarized, suggested, and asked permission to do.",
    icon: Inbox,
  },
  settings: {
    title: "Settings",
    description:
      "A future control panel for assistant boundaries, notification preferences, and integration permissions.",
    icon: Wrench,
  },
};
