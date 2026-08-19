import { useMemo } from "react";
import type { HeatId } from "@/lib/design";
import { KIT_POS, MAIN, PCB_PARTS, POURS, TRACES, type PcbTrace } from "@/lib/pcb";
import { thermalCopper, thermalEmissive } from "./heat";

const COPPER = "#b56a2e";
const PAD = "#c47a38";

function boardY(board: "main" | "kit") {
  return board === "kit" ? KIT_POS.y + MAIN.t + 0.12 : MAIN.t + 0.12;
}

function segs(pts: [number, number][]) {
  const out: { x: number; z: number; len: number; rot: number }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const len = Math.hypot(dx, dz);
    if (len < 0.2) continue;
    out.push({
      x: (a[0] + b[0]) / 2,
      z: (a[1] + b[1]) / 2,
      len,
      rot: Math.atan2(dx, dz),
    });
  }
  return out;
}

export function TraceLayer({
  heatMode,
  temps,
  tAmb,
}: {
  heatMode: boolean;
  temps?: Record<HeatId, number>;
  tAmb: number;
}) {
  const baked = useMemo(
    () =>
      TRACES.map((t) => ({
        ...t,
        pieces: segs(t.pts),
        y: boardY(t.board),
      })),
    [],
  );

  return (
    <group>
      {POURS.map((p) => {
        const y = boardY(p.board);
        const temp = p.heat && temps ? (temps[p.heat] ?? tAmb) : tAmb;
        const color = heatMode && p.heat ? thermalCopper(temp, tAmb) : COPPER;
        const em = heatMode && p.heat ? thermalEmissive(temp, tAmb) : 0;
        return (
          <mesh key={p.id} position={[p.x, y - 0.02, p.z]} receiveShadow>
            <boxGeometry args={[p.w, 0.1, p.d]} />
            <meshStandardMaterial
              color={color}
              metalness={0.72}
              roughness={0.32}
              emissive={heatMode && p.heat ? color : "#000"}
              emissiveIntensity={em * 0.55}
            />
          </mesh>
        );
      })}

      {baked.map((t) => {
        const temp = t.heat && temps ? (temps[t.heat] ?? tAmb) : tAmb;
        const color = heatMode && t.heat ? thermalCopper(temp, tAmb) : COPPER;
        const em = heatMode && t.heat ? thermalEmissive(temp, tAmb) : 0;
        return (
          <group key={t.id}>
            {t.pieces.map((s, i) => (
              <mesh
                key={i}
                position={[s.x, t.y, s.z]}
                rotation={[0, s.rot, 0]}
                receiveShadow
              >
                <boxGeometry args={[t.w, 0.16, s.len + t.w * 0.35]} />
                <meshStandardMaterial
                  color={color}
                  metalness={0.78}
                  roughness={0.26}
                  emissive={heatMode && t.heat ? color : "#000"}
                  emissiveIntensity={em * 0.7}
                />
              </mesh>
            ))}
            {t.pts.map((p, i) => (
              <mesh key={`v${i}`} position={[p[0], t.y, p[1]]}>
                <cylinderGeometry args={[t.w * 0.52, t.w * 0.52, 0.17, 10]} />
                <meshStandardMaterial
                  color={color}
                  metalness={0.78}
                  roughness={0.26}
                  emissive={heatMode && t.heat ? color : "#000"}
                  emissiveIntensity={em * 0.7}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {PCB_PARTS.map((p) => {
        const y = p.board === "kit" ? KIT_POS.y + MAIN.t + 0.14 : MAIN.t + 0.14;
        const temp = p.heat && temps ? (temps[p.heat] ?? tAmb) : tAmb;
        const color = heatMode && p.heat ? thermalCopper(temp, tAmb) : PAD;
        return (
          <mesh key={`pad-${p.id}`} position={[p.x, y, p.z]}>
            <cylinderGeometry args={[padR(p.kind), padR(p.kind), 0.12, 12]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

function padR(kind: string) {
  if (kind === "elkoTall" || kind === "efd30" || kind === "heatsink") return 6.5;
  if (kind === "elko" || kind === "bridge" || kind === "iec" || kind === "terminal") return 5;
  if (kind === "to218" || kind === "to220") return 4.2;
  if (kind === "choke" || kind === "inductor") return 4;
  return 2.4;
}

export function HeatHalos({
  temps,
  tAmb,
}: {
  temps?: Record<HeatId, number>;
  tAmb: number;
}) {
  if (!temps) return null;
  return (
    <group>
      {PCB_PARTS.filter((p) => p.heat).map((p) => {
        const t = temps[p.heat!] ?? tAmb;
        const x = Math.max(0, (t - tAmb) / 70);
        if (x < 0.08) return null;
        const y = p.board === "kit" ? KIT_POS.y + 1.9 : 1.9;
        const col = thermalCopper(t, tAmb);
        return (
          <mesh key={`halo-${p.id}`} position={[p.x, y, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[10 + x * 16, 20]} />
            <meshBasicMaterial color={col} transparent opacity={0.18 + x * 0.38} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

export function traceCount() {
  return TRACES.length;
}

export type { PcbTrace };
