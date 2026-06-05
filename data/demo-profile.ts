import type { UserProfile } from "./atlas-core";
import type { ApprovalItem, AuditEvent } from "./approvals";
import type { GroceryItem, GroceryPlan, RefundItem, ReorderItem, StorePreference } from "./shopping";
import type { HomeOperation, LifeMapCategory } from "./life-map";

const defaultCreatedAt = "2026-06-04T07:40:00.000Z";

export const demoUserProfile: UserProfile = {
  id: "demo-justin",
  displayName: "Alex",
  householdName: "Demo Household",
  locale: "en-US",
  timezone: "America/Phoenix",
  primaryGoals: [
    "Reduce scattered life admin",
    "Keep household routines visible",
    "Review prepared actions before anything happens",
  ],
  approvalMode: "approval-first",
  preferredBriefTime: "07:30",
};

export const demoApprovalItems: ApprovalItem[] = [
  {
    id: "air-filter-reorder",
    title: "Air filter reorder",
    category: "Household",
    summary: "Air filters are due in 9 days.",
    whyItMatters:
      "Replacement keeps HVAC airflow healthy during heavy summer usage.",
    source: "Demo household maintenance schedule + saved filter size",
    confidence: "High",
    risk: "Low",
    preview: "Prepare household supplier reorder for 20x30x1 filters, quantity 2.",
    status: "Needs Review",
    createdAt: defaultCreatedAt,
    updatedAt: defaultCreatedAt,
    origin: "Mock",
    draftOnly: false,
    reviewRecommended: false,
  },
  {
    id: "work-follow-up-draft",
    title: "Work follow-up draft",
    category: "Work",
    summary: "Three work follow-ups are worth doing today.",
    whyItMatters:
      "These contacts have gone quiet after recent conversations.",
    source: "Work relationship tracker",
    confidence: "Medium",
    risk: "Medium",
    preview: "Draft a short check-in message for review.",
    status: "Needs Review",
    createdAt: defaultCreatedAt,
    updatedAt: defaultCreatedAt,
    origin: "Mock",
    draftOnly: false,
    reviewRecommended: true,
  },
  {
    id: "grocery-list-approval",
    title: "Grocery list approval",
    category: "Shopping",
    summary: "Grocery list prepared for 5 dinners.",
    whyItMatters:
      "Helps avoid last-minute eating out and keeps the week organized.",
    source: "Demo meal plan + saved dinner list",
    confidence: "Medium",
    risk: "Low",
    preview: "Prepare grocery list with estimated total under $250.",
    status: "Needs Review",
    createdAt: defaultCreatedAt,
    updatedAt: defaultCreatedAt,
    origin: "Shopping",
    draftOnly: false,
    reviewRecommended: false,
  },
  {
    id: "legal-risk-follow-up-draft",
    title: "Legal / risk follow-up draft",
    category: "Legal / Risk",
    summary: "A sensitive household issue has been waiting 9 days.",
    whyItMatters:
      "This is an active issue and may need a documented follow-up.",
    source: "Waiting-on tracker",
    confidence: "Medium",
    risk: "High",
    preview:
      "Draft a firm but professional follow-up note. Mark as draft only and recommend review before sending.",
    status: "Needs Review",
    createdAt: defaultCreatedAt,
    updatedAt: defaultCreatedAt,
    origin: "Mock",
    draftOnly: true,
    reviewRecommended: true,
  },
  {
    id: "project-content-reminder",
    title: "Project content reminder",
    category: "Projects",
    summary: "No project content is scheduled after Thursday.",
    whyItMatters: "Consistency matters for project momentum.",
    source: "Project content calendar",
    confidence: "High",
    risk: "Low",
    preview:
      "Prepare reminder to schedule one piece of project content from unused material.",
    status: "Needs Review",
    createdAt: defaultCreatedAt,
    updatedAt: defaultCreatedAt,
    origin: "Mock",
    draftOnly: false,
    reviewRecommended: false,
  },
];

export const demoAuditEvents: AuditEvent[] = [
  {
    id: "audit-morning-brief",
    dateTime: "2026-06-04T07:42:00.000Z",
    eventType: "Recommendation prepared",
    relatedItem: "Air filter reorder",
    userDecision: "Needs Review",
    dataUsed: "Demo household maintenance schedule + saved filter size",
    assumptions: "Filters are still the saved 20x30x1 size.",
    riskLevel: "Low",
    result: "Queued for user review. No order was placed.",
    origin: "Mock",
  },
  {
    id: "audit-legal-risk-review",
    dateTime: "2026-06-04T07:48:00.000Z",
    eventType: "High-risk draft prepared",
    relatedItem: "Legal / risk follow-up draft",
    userDecision: "Needs Review",
    dataUsed: "Waiting-on tracker",
    assumptions: "The tracked issue has not received a response since the last logged contact.",
    riskLevel: "High",
    result:
      "Draft-only recommendation created. Review recommended before any message is sent.",
    origin: "Mock",
  },
];

export const demoLifeMapCategories: LifeMapCategory[] = [
  {
    id: "household",
    name: "Household",
    status: "Watch",
    summary:
      "Household routines are mostly mapped, with maintenance details that still need confirmation.",
    recommendedNextStep: "Confirm HVAC units and air filter replacement details.",
    confidence: "Medium",
    entities: [
      { name: "Pool", state: "Known" },
      { name: "Air filters", state: "Needs Review" },
      { name: "HVAC units", state: "Unknown" },
      { name: "Ficus hedge", state: "Known" },
      { name: "Palms", state: "Known" },
      { name: "Water softener", state: "Estimated" },
      { name: "Housekeeper schedule", state: "Known" },
    ],
  },
  {
    id: "family",
    name: "Family",
    status: "Watch",
    summary:
      "Recurring family planning is started, but appointment and gift context needs review.",
    recommendedNextStep: "Add appointment patterns and gift preference notes.",
    confidence: "Medium",
    entities: [
      { name: "Meal planning", state: "Known" },
      { name: "Birthdays/gift preferences", state: "Needs Review" },
      { name: "Family appointments", state: "Unknown" },
    ],
  },
  {
    id: "money",
    name: "Money",
    status: "Watch",
    summary:
      "Spending watch areas are detected from mock context, with refund tracking still incomplete.",
    recommendedNextStep: "Review refund tracking and subscription list.",
    confidence: "Medium",
    entities: [
      { name: "Groceries", state: "Known" },
      { name: "Household supplier spending", state: "Known" },
      { name: "Refund tracking", state: "Needs Review" },
      { name: "Subscriptions", state: "Detected" },
    ],
  },
  {
    id: "work",
    name: "Work",
    status: "Good",
    summary:
      "Work follow-up context is clear enough for draft recommendations.",
    recommendedNextStep: "Review credential / deadline reminders and calendar them manually.",
    confidence: "Medium",
    entities: [
      { name: "Work follow-ups", state: "Known" },
      { name: "Credential / deadline reminders", state: "Needs Review" },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    status: "Watch",
    summary:
      "Project planning is visible, with supplier and publishing tasks still forming.",
    recommendedNextStep: "Confirm next content slot and supplier follow-up priority.",
    confidence: "Medium",
    entities: [
      { name: "Content calendar", state: "Known" },
      { name: "Supplier follow-ups", state: "Detected" },
      { name: "Project commerce tasks", state: "Needs Review" },
    ],
  },
  {
    id: "vehicles",
    name: "Vehicles",
    status: "Needs Attention",
    summary:
      "Vehicle context exists, but maintenance and parts inventory need structure.",
    recommendedNextStep: "Add maintenance schedule and tools/parts inventory.",
    confidence: "Low",
    entities: [
      { name: "Primary vehicle", state: "Known" },
      { name: "Maintenance schedule", state: "Unknown" },
      { name: "Tools/parts list", state: "Needs Review" },
    ],
  },
  {
    id: "documents",
    name: "Documents",
    status: "Needs Attention",
    summary:
      "Some document areas are detected, but records and warranties are not organized yet.",
    recommendedNextStep: "Organize home records and identify warranties/manuals.",
    confidence: "Low",
    entities: [
      { name: "Insurance docs", state: "Detected" },
      { name: "Home records", state: "Needs Review" },
      { name: "Warranties/manuals", state: "Unknown" },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    status: "Good",
    summary:
      "Common shopping flows are known enough for draft list and reorder suggestions.",
    recommendedNextStep: "Confirm provider preferences before any purchase workflow.",
    confidence: "Medium",
    entities: [
      { name: "Preferred grocery provider", state: "Known" },
      { name: "Air filter reorder", state: "Needs Review" },
      { name: "Grocery list", state: "Known" },
    ],
  },
  {
    id: "legal-risk",
    name: "Legal / Risk",
    status: "Needs Attention",
    summary:
      "Sensitive items are separated for organization and review only.",
    recommendedNextStep: "Keep sensitive documents and follow-ups draft-only and review-led.",
    confidence: "Low",
    entities: [
      { name: "Sensitive household issue", state: "Known" },
      { name: "Sensitive documents / review items", state: "Sensitive" },
    ],
  },
];

export const demoHomeOperations: HomeOperation[] = [
  {
    id: "pool-check",
    name: "Pool check",
    status: "Needs Attention",
    frequency: "Weekly",
    lastCompleted: "Unknown",
    nextDue: "Today",
    whyItMatters: "Extreme heat can increase chemical demand.",
    supplies: "Pool test strips, chlorine",
    confidence: "Medium",
  },
  {
    id: "air-filters",
    name: "Air filters",
    status: "Watch",
    frequency: "Every 90 days",
    lastCompleted: "Estimated 81 days ago",
    nextDue: "In 9 days",
    whyItMatters: "Heavy summer HVAC usage makes airflow important.",
    supplies: "20x30x1 filters, quantity 2",
    confidence: "Medium",
  },
  {
    id: "watering-plants",
    name: "Watering / plants",
    status: "Watch",
    frequency: "Weather-aware",
    lastCompleted: "Unknown",
    nextDue: "This week",
    whyItMatters:
      "Ficus hedge and palms may need more water during extreme heat.",
    supplies: "Irrigation schedule",
    confidence: "Medium",
  },
  {
    id: "water-softener",
    name: "Water softener",
    status: "Quiet",
    frequency: "Monthly",
    lastCompleted: "Unknown",
    nextDue: "Next Saturday",
    whyItMatters: "Salt level should be checked monthly.",
    supplies: "Softener salt",
    confidence: "Low",
  },
  {
    id: "housekeeper-prep",
    name: "Housekeeper prep",
    status: "Good",
    frequency: "Every 2 weeks",
    lastCompleted: "User confirmed",
    nextDue: "Friday",
    whyItMatters: "Prep keeps the clean efficient.",
    supplies: "None",
    confidence: "High",
  },
  {
    id: "hvac-seasonal-prep",
    name: "HVAC seasonal prep",
    status: "Watch",
    frequency: "Seasonal",
    lastCompleted: "Unknown",
    nextDue: "Before peak summer",
    whyItMatters: "Extreme heat increases HVAC load.",
    supplies: "Vendor/service record",
    confidence: "Medium",
  },
  {
    id: "dryer-smoke-safety",
    name: "Dryer vent / smoke detector safety",
    status: "Quiet",
    frequency: "Quarterly",
    lastCompleted: "Unknown",
    nextDue: "Next month",
    whyItMatters: "Safety maintenance reduces household risk.",
    supplies: "Batteries if needed",
    confidence: "Low",
  },
  {
    id: "supplies-inventory",
    name: "Supplies inventory",
    status: "Needs Attention",
    frequency: "Monthly",
    lastCompleted: "Unknown",
    nextDue: "This week",
    whyItMatters: "Prevents last-minute purchases.",
    supplies: "Air filters, pool strips, softener salt, batteries",
    confidence: "Medium",
  },
];

export const demoWeeklyGroceryPlan: GroceryPlan = {
  meals: [
    "Ground beef tacos",
    "White cream enchiladas",
    "Chicken fried rice",
    "Crockpot marry me chicken",
    "Steak bites",
    "Leftover night",
    "Easy night",
  ],
  goal: "5 dinners under $250",
  estimatedTotal: 226,
  status: "Needs Review",
  confidence: "Medium",
  whyItMatters:
    "Helps avoid last-minute eating out and keeps the week organized.",
};

export const demoGroceryItems: GroceryItem[] = [
  { id: "lettuce", name: "Lettuce", category: "Produce", estimatedPrice: 3.49, quantity: "1 head", status: "Included" },
  { id: "onions", name: "Onions", category: "Produce", estimatedPrice: 2.98, quantity: "1 bag", status: "Included" },
  { id: "cilantro", name: "Cilantro", category: "Produce", estimatedPrice: 0.98, quantity: "1 bunch", status: "Included" },
  { id: "limes", name: "Limes", category: "Produce", estimatedPrice: 2.5, quantity: "5", status: "Included" },
  { id: "bell-peppers", name: "Bell peppers", category: "Produce", estimatedPrice: 4.48, quantity: "4", status: "Included" },
  { id: "ground-beef", name: "Ground beef", category: "Protein", estimatedPrice: 15.96, quantity: "2 lb", status: "Included" },
  { id: "chicken-breast", name: "Chicken breast", category: "Protein", estimatedPrice: 18.42, quantity: "4 lb", status: "Included" },
  { id: "steak-bites", name: "Steak bites", category: "Protein", estimatedPrice: 21.88, quantity: "2 lb", status: "Included" },
  { id: "deli-ham", name: "Deli ham", category: "Protein", estimatedPrice: 6.98, quantity: "1 pack", status: "Optional" },
  { id: "shredded-cheese", name: "Shredded cheese", category: "Dairy", estimatedPrice: 8.96, quantity: "2 bags", status: "Included" },
  { id: "cream-cheese", name: "Cream cheese", category: "Dairy", estimatedPrice: 3.24, quantity: "1 block", status: "Included" },
  { id: "heavy-cream", name: "Heavy cream", category: "Dairy", estimatedPrice: 4.78, quantity: "1 pint", status: "Included" },
  { id: "sour-cream", name: "Sour cream", category: "Dairy", estimatedPrice: 2.24, quantity: "1 tub", status: "Included" },
  { id: "tortillas", name: "Tortillas", category: "Pantry", estimatedPrice: 4.96, quantity: "2 packs", status: "Included" },
  { id: "rice", name: "Rice", category: "Pantry", estimatedPrice: 6.48, quantity: "1 bag", status: "Included" },
  { id: "enchilada-sauce", name: "Enchilada sauce", category: "Pantry", estimatedPrice: 3.76, quantity: "2 cans", status: "Included" },
  { id: "taco-seasoning", name: "Taco seasoning", category: "Pantry", estimatedPrice: 1.48, quantity: "2 packets", status: "Included" },
  { id: "pasta", name: "Pasta", category: "Pantry", estimatedPrice: 2.24, quantity: "2 boxes", status: "Optional" },
  { id: "chicken-broth", name: "Chicken broth", category: "Pantry", estimatedPrice: 2.98, quantity: "1 carton", status: "Included" },
  { id: "paper-towels", name: "Paper towels", category: "Household", estimatedPrice: 18.98, quantity: "1 pack", status: "Included" },
  { id: "trash-bags", name: "Trash bags", category: "Household", estimatedPrice: 11.98, quantity: "1 box", status: "Included" },
];

export const demoReorderItems: ReorderItem[] = [
  {
    id: "air-filters",
    title: "Air filters",
    description: "20x30x1, quantity 2",
    estimatedTotal: 39.98,
    store: "Preferred household supplier",
    status: "Ready for approval",
    why: "Due in 9 days",
    risk: "Low",
  },
  {
    id: "pool-test-strips",
    title: "Pool test strips",
    description: "Replacement test strips for pool checks",
    estimatedTotal: 16.99,
    store: "Preferred household supplier / backup provider",
    status: "Watch",
    why: "Summer heat may increase pool check frequency",
    risk: "Low",
  },
  {
    id: "water-softener-salt",
    title: "Water softener salt",
    description: "Monthly softener salt refill",
    estimatedTotal: 28,
    store: "Preferred hardware provider / preferred bulk store",
    status: "Add to errand list",
    why: "Monthly check coming up",
    risk: "Low",
  },
  {
    id: "batteries",
    title: "Batteries",
    description: "Backup batteries for home safety checks",
    estimatedTotal: 14.99,
    store: "Preferred household supplier",
    status: "Optional",
    why: "Smoke detector check next month",
    risk: "Medium",
  },
];

export const demoRefundItems: RefundItem[] = [
  {
    id: "household-supplier-return",
    title: "Household supplier return",
    detail: "Controller parts, return window closes in 5 days",
    status: "Needs Review",
    source: "Mock return tracker",
  },
  {
    id: "grocery-provider-refund",
    title: "Grocery provider refund",
    detail: "Grocery substitution refund pending 7 days",
    status: "Needs Review",
    source: "Mock refund tracker",
  },
  {
    id: "hardware-provider-receipt",
    title: "Hardware provider receipt",
    detail: "Air filter backup purchase, warranty/receipt saved",
    status: "Prepared",
    source: "Mock receipt vault",
  },
];

export const demoStorePreferences: StorePreference[] = [
  { store: "Preferred grocery provider", preference: "Demo preference: grocery delivery or pickup provider" },
  { store: "Preferred household supplier", preference: "Demo preference: household supply provider" },
  { store: "Preferred hardware provider", preference: "Demo preference: hardware pickup provider" },
  { store: "Preferred bulk store", preference: "Demo preference: bulk household provider" },
];

export const demoShoppingRules = [
  "Grocery target: under $250/week",
  "Require approval before any order",
  "No substitutions over $5 without approval",
  "Prefer same brand or cheaper substitutions",
  "No recurring purchase setup without explicit approval",
  "Do not add household extras unless shown separately",
  "Show estimated total before approval",
];
