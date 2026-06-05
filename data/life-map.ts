import type { Confidence } from "./approvals";
import type { EntityKnowledgeState, LifeArea } from "./atlas-core";
import type { Status } from "./today";

export type KnowledgeState = EntityKnowledgeState;

export type LifeMapEntity = {
  name: string;
  state: KnowledgeState;
};

export type LifeMapCategory = {
  id: string;
  name: LifeArea;
  status: Status;
  summary: string;
  recommendedNextStep: string;
  confidence: Confidence;
  entities: LifeMapEntity[];
};

export type HomeOperationStatus = Status | "Hidden";
export type HomeOperationAction = "Marked Done" | "Snoozed" | "Approval Prepared" | "Hidden";

export type HomeOperation = {
  id: string;
  name: string;
  status: HomeOperationStatus;
  frequency: string;
  lastCompleted: string;
  nextDue: string;
  whyItMatters: string;
  supplies: string;
  confidence: Confidence;
};

export {
  demoHomeOperations as homeOperations,
  demoLifeMapCategories as lifeMapCategories,
} from "./demo-profile";
