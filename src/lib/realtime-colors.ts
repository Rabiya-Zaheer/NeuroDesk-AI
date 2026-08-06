const PALETTE = ["#6366F1", "#14B8A6", "#F59E0B", "#A855F7", "#EC4899", "#0EA5E9"];

export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length]!;
}
