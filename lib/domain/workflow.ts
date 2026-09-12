import { assertGenerationPermitted } from "./permission";
import type { PermissionState, AutomationMode } from "./types";
export type WorkflowDecision = { execute: boolean; humanReview: boolean; reason: string };
export function generationDecision(permission: PermissionState, mode: AutomationMode, paused = false): WorkflowDecision {
  assertGenerationPermitted(permission, paused);
  if (mode === "DRY_RUN") return { execute: false, humanReview: false, reason: "Dry run: no generation charges" };
  if (mode === "REVIEW") return { execute: false, humanReview: true, reason: "Generation awaits approval" };
  return { execute: true, humanReview: false, reason: "Authorized automatic generation" };
}
export function qcDecision(confidence: number, threshold: number): "READY" | "HUMAN_REVIEW" { return confidence >= threshold ? "READY" : "HUMAN_REVIEW"; }
