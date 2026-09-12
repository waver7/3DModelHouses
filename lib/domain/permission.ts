import { createHash, randomBytes } from "node:crypto";
import type { PermissionState } from "./types";
export function createAuthorizationToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: createHash("sha256").update(token).digest("hex") };
}
export function assertGenerationPermitted(permission: PermissionState, paused = false): void {
  if (paused) throw new Error("Generation is paused");
  if (permission !== "GRANTED") throw new Error("Explicit permission is required before generation");
}
