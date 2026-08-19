import { Color } from "three";

const STOPS: [number, string][] = [
  [0, "#b56a2e"],
  [0.16, "#d4a24a"],
  [0.34, "#e07028"],
  [0.55, "#c43c2c"],
  [0.78, "#e8d4c4"],
  [1, "#f4efe8"],
];

export function thermalNorm(t: number, amb: number, limit = 125) {
  return Math.max(0, Math.min(1, (t - amb) / Math.max(22, limit - amb)));
}

export function thermalCopper(t: number, amb: number, limit = 125) {
  const x = thermalNorm(t, amb, limit);
  let a = STOPS[0]!;
  let b = STOPS[STOPS.length - 1]!;
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (x >= STOPS[i]![0] && x <= STOPS[i + 1]![0]) {
      a = STOPS[i]!;
      b = STOPS[i + 1]!;
      break;
    }
  }
  const span = Math.max(1e-6, b[0] - a[0]);
  const u = (x - a[0]) / span;
  const ca = new Color(a[1]);
  const cb = new Color(b[1]);
  return `#${ca.lerp(cb, u).getHexString()}`;
}

export function thermalEmissive(t: number, amb: number) {
  const x = thermalNorm(t, amb);
  return x < 0.12 ? 0 : 0.12 + x * 0.85;
}

export function thermalHex(t: number, amb: number, limit: number, base: string) {
  const x = thermalNorm(t, amb, limit);
  if (x < 0.08) return base;
  const c = new Color(base);
  const hot = new Color(thermalCopper(t, amb, limit));
  return `#${c.lerp(hot, 0.35 + x * 0.65).getHexString()}`;
}
