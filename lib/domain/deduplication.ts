import { createHash } from "node:crypto";
export function contentChecksum(bytes: Uint8Array): string { return createHash("sha256").update(bytes).digest("hex"); }
export function deduplicateByChecksum<T extends { checksum: string }>(images: T[]): T[] {
  const seen = new Set<string>();
  return images.filter((image) => !seen.has(image.checksum) && Boolean(seen.add(image.checksum)));
}
