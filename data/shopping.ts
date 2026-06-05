import type { Confidence, RiskLevel } from "./approvals";

export type ShoppingStatus =
  | "Needs Review"
  | "Prepared"
  | "Approved"
  | "Lowered"
  | "Saved"
  | "Hidden"
  | "Snoozed"
  | "Reminder Added"
  | "Resolved"
  | "Approval Prepared";

export type GroceryItemStatus =
  | "Included"
  | "Optional"
  | "Needs Substitution"
  | "Removed"
  | "Substitution Approved";

export type GroceryItem = {
  id: string;
  name: string;
  category: "Produce" | "Protein" | "Dairy" | "Pantry" | "Household";
  estimatedPrice: number;
  quantity: string;
  status: GroceryItemStatus;
};

export type GroceryPlan = {
  meals: string[];
  goal: string;
  estimatedTotal: number;
  status: ShoppingStatus;
  confidence: Confidence;
  whyItMatters: string;
};

export type ReorderItem = {
  id: string;
  title: string;
  description: string;
  estimatedTotal: number;
  store: string;
  status: string;
  why: string;
  risk: RiskLevel;
};

export type RefundItem = {
  id: string;
  title: string;
  detail: string;
  status: ShoppingStatus;
  source: string;
};

export type StorePreference = {
  store: string;
  preference: string;
};

export type ShoppingAction =
  | "Approve list"
  | "Lower total"
  | "Swap meals"
  | "Save for later"
  | "Never show this again"
  | "Approve prep"
  | "Add to errand list"
  | "Change store"
  | "Snooze"
  | "Mark resolved"
  | "Add reminder"
  | "Create approval item";

export {
  demoGroceryItems as groceryItems,
  demoRefundItems as refundItems,
  demoReorderItems as reorderItems,
  demoShoppingRules as shoppingRules,
  demoStorePreferences as storePreferences,
  demoWeeklyGroceryPlan as weeklyGroceryPlan,
} from "./demo-profile";
