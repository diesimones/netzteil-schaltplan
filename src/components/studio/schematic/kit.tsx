import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useStudio } from "@/lib/store";

export const F = {
  sans: "IBM Plex Sans, Segoe UI, sans-serif",
  mono: "IBM Plex Mono, ui-monospace, monospace",
};

export function Paper({
  no,
  title,
  children,
  viewBox = "0 0 1480 980",
}: {
  no: string;
  title: string;
  children: ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className="paper-sheet h-auto w-full min-w-3xl bg-paper text-ink"
      role="img"
      aria-label={`Schaltplan Blatt ${no}: ${title}`}
    >
      <rect x="8" y="8" width="1464" height="964" fill="none" stroke="#1c1d18" strokeWidth="1.6" />
      <rect x="14" y="14" width="1452" height="952" fill="none" stroke="#1c1d18" strokeWidth="0.6" />
      {children}
      <g>
        <rect x="14" y="900" width="1452" height="66" fill="#efe8d6" stroke="#1c1d18" strokeWidth="1" />
        <line x1="220" y1="900" x2="220" y2="966" stroke="#1c1d18" />
        <line x1="980" y1="900" x2="980" y2="966" stroke="#1c1d18" />
        <line x1="1180" y1="900" x2="1180" y2="966" stroke="#1c1d18" />
        <text x="28" y="924" fontFamily={F.mono} fontSize="11" fill="#4a4c44">
          IFT-NT-2026
        </text>
        <text x="28" y="948" fontFamily={F.sans} fontSize="13" fontWeight="600">
          Meisterprüfung Informationstechnik
        </text>
        <text x="236" y="924" fontFamily={F.sans} fontSize="16" fontWeight="600">
          {title}
        </text>
        <text x="236" y="948" fontFamily={F.mono} fontSize="11" fill="#4a4c44">
          Hybrid-Sperrwandler · TPS5430 · Längsregler · DIN EN 62368-1
        </text>
        <text x="996" y="924" fontFamily={F.mono} fontSize="11" fill="#4a4c44">
          Blatt
        </text>
        <text x="996" y="950" fontFamily={F.sans} fontSize="20" fontWeight="600">
          {no} / 05
        </text>
        <text x="1196" y="924" fontFamily={F.mono} fontSize="11" fill="#4a4c44">
          A3 quer · nicht maßstäblich
        </text>
        <text x="1196" y="948" fontFamily={F.mono} fontSize="11">
          Bauteil klicken
        </text>
      </g>
    </svg>
  );
}

export function Hit({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const selected = useStudio((s) => s.selected);
  const select = useStudio((s) => s.select);
  const on = selected === id;
  return (
    <g
      className={cn("cursor-pointer", on && "sch-sel")}
      onClick={(e) => {
        e.stopPropagation();
        select(id);
      }}
      stroke={on ? "#2a4a62" : "#1c1d18"}
      fill="none"
    >
      {children}
    </g>
  );
}

export function Wire({ d, pri }: { d: string; pri?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={pri ? "#7a2f2f" : "#1c1d18"}
      strokeWidth={pri ? 1.7 : 1.25}
    />
  );
}

export function Dot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="2.6" fill="#1c1d18" />;
}

export function Gnd({ x, y }: { x: number; y: number }) {
  return (
    <g stroke="#1c1d18" strokeWidth="1.3" fill="none">
      <line x1={x} y1={y} x2={x} y2={y + 8} />
      <line x1={x - 12} y1={y + 8} x2={x + 12} y2={y + 8} />
      <line x1={x - 8} y1={y + 13} x2={x + 8} y2={y + 13} />
      <line x1={x - 4} y1={y + 18} x2={x + 4} y2={y + 18} />
    </g>
  );
}

export function Tag({
  x,
  y,
  t,
  anchor = "start",
  small,
}: {
  x: number | string;
  y: number | string;
  t: string;
  anchor?: "start" | "middle" | "end";
  small?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={F.mono}
      fontSize={small ? 10 : 12}
      fill="#4a4c44"
    >
      {t}
    </text>
  );
}

export function Ref({
  x,
  y,
  t,
  anchor = "middle",
}: {
  x: number | string;
  y: number | string;
  t: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={F.sans} fontSize="12" fontWeight="600" fill="#1c1d18">
      {t}
    </text>
  );
}

export function ResH({ x, y, id, ref, val }: { x: number; y: number; id: string; ref: string; val: string }) {
  return (
    <Hit id={id}>
      <rect x={x} y={y - 8} width="36" height="16" />
      <Ref x={x + 18} y={y - 12} t={ref} />
      <Tag x={x + 18} y={y + 24} t={val} anchor="middle" small />
    </Hit>
  );
}

export function ResV({ x, y, id, ref, val }: { x: number; y: number; id: string; ref: string; val: string }) {
  return (
    <Hit id={id}>
      <rect x={x - 8} y={y} width="16" height="36" />
      <Ref x={x + 18} y={y + 14} t={ref} anchor="start" />
      <Tag x={x + 18} y={y + 28} t={val} small />
    </Hit>
  );
}

export function CapH({
  x,
  y,
  id,
  ref,
  val,
  polar,
}: {
  x: number;
  y: number;
  id: string;
  ref: string;
  val: string;
  polar?: boolean;
}) {
  return (
    <Hit id={id}>
      <line x1={x} y1={y - 14} x2={x} y2={y + 14} />
      <line x1={x + 8} y1={y - 14} x2={x + 8} y2={y + 14} />
      {polar && <text x={x - 8} y={y - 16} fontFamily={F.mono} fontSize="11">+</text>}
      <Ref x={x + 4} y={y - 20} t={ref} />
      <Tag x={x + 4} y={y + 28} t={val} anchor="middle" small />
    </Hit>
  );
}

export function CapV({
  x,
  y,
  id,
  ref,
  val,
  polar,
}: {
  x: number;
  y: number;
  id: string;
  ref: string;
  val: string;
  polar?: boolean;
}) {
  return (
    <Hit id={id}>
      <line x1={x - 14} y1={y} x2={x + 14} y2={y} />
      <line x1={x - 14} y1={y + 8} x2={x + 14} y2={y + 8} />
      {polar && <text x={x + 16} y={y + 6} fontFamily={F.mono} fontSize="11">+</text>}
      <Ref x={x + 20} y={y + 4} t={ref} anchor="start" />
      <Tag x={x + 20} y={y + 18} t={val} small />
    </Hit>
  );
}

export function DiodeH({ x, y, id, ref, val }: { x: number; y: number; id: string; ref: string; val: string }) {
  return (
    <Hit id={id}>
      <polygon points={`${x},${y - 9} ${x},${y + 9} ${x + 16},${y}`} fill="#1c1d18" stroke="#1c1d18" />
      <line x1={x + 16} y1={y - 10} x2={x + 16} y2={y + 10} />
      <Ref x={x + 8} y={y - 14} t={ref} />
      <Tag x={x + 8} y={y + 24} t={val} anchor="middle" small />
    </Hit>
  );
}

export function FuseH({ x, y, id, ref, val }: { x: number; y: number; id: string; ref: string; val: string }) {
  return (
    <Hit id={id}>
      <rect x={x} y={y - 8} width="40" height="16" rx="8" />
      <line x1={x + 6} y1={y} x2={x + 34} y2={y} />
      <Ref x={x + 20} y={y - 14} t={ref} />
      <Tag x={x + 20} y={y + 24} t={val} anchor="middle" small />
    </Hit>
  );
}

export function Nmos({ x, y, id, ref, val }: { x: number; y: number; id: string; ref: string; val: string }) {
  return (
    <Hit id={id}>
      <line x1={x} y1={y} x2={x + 14} y2={y} />
      <line x1={x + 14} y1={y - 16} x2={x + 14} y2={y + 16} />
      <line x1={x + 20} y1={y - 18} x2={x + 20} y2={y + 18} />
      <line x1={x + 20} y1={y - 12} x2={x + 34} y2={y - 12} />
      <line x1={x + 20} y1={y + 12} x2={x + 34} y2={y + 12} />
      <line x1={x + 34} y1={y - 12} x2={x + 34} y2={y - 36} />
      <line x1={x + 34} y1={y + 12} x2={x + 34} y2={y + 28} />
      <polygon points={`${x + 26},${y} ${x + 18},${y - 4} ${x + 18},${y + 4}`} fill="#1c1d18" />
      <Ref x={x + 44} y={y - 8} t={ref} anchor="start" />
      <Tag x={x + 44} y={y + 8} t={val} small />
    </Hit>
  );
}

export function Npn({ x, y, id, ref, val }: { x: number; y: number; id: string; ref: string; val: string }) {
  return (
    <Hit id={id}>
      <circle cx={x + 18} cy={y} r="16" />
      <line x1={x} y1={y} x2={x + 10} y2={y} />
      <line x1={x + 10} y1={y - 12} x2={x + 10} y2={y + 12} />
      <line x1={x + 10} y1={y - 8} x2={x + 28} y2={y - 16} />
      <line x1={x + 10} y1={y + 8} x2={x + 28} y2={y + 16} />
      <polygon points={`${x + 22},${y + 12} ${x + 16},${y + 16} ${x + 24},${y + 18}`} fill="#1c1d18" />
      <line x1={x + 28} y1={y - 16} x2={x + 28} y2={y - 28} />
      <line x1={x + 28} y1={y + 16} x2={x + 28} y2={y + 28} />
      <Ref x={x + 40} y={y - 4} t={ref} anchor="start" />
      <Tag x={x + 40} y={y + 12} t={val} small />
    </Hit>
  );
}

export function IndH({ x, y, id, ref, val }: { x: number; y: number; id: string; ref: string; val: string }) {
  const humps = [0, 10, 20, 30].map((o) => `a 5 5 0 0 1 10 0`).join(" ");
  return (
    <Hit id={id}>
      <path d={`M ${x} ${y} ${humps}`} />
      <Ref x={x + 20} y={y - 12} t={ref} />
      <Tag x={x + 20} y={y + 18} t={val} anchor="middle" small />
    </Hit>
  );
}

export function IcBox({
  x,
  y,
  w,
  h,
  id,
  name,
  pinsL,
  pinsR,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  name: string;
  pinsL: string[];
  pinsR: string[];
}) {
  return (
    <Hit id={id}>
      <rect x={x} y={y} width={w} height={h} />
      <text
        x={x + w / 2}
        y={y + 16}
        textAnchor="middle"
        fontFamily={F.sans}
        fontSize="12"
        fontWeight="600"
        fill="#1c1d18"
      >
        {name}
      </text>
      {pinsL.map((p, i) => (
        <g key={`l${p}`}>
          <line x1={x - 16} y1={y + 32 + i * 18} x2={x} y2={y + 32 + i * 18} />
          <text x={x + 6} y={y + 36 + i * 18} fontFamily={F.mono} fontSize="10" fill="#4a4c44">
            {p}
          </text>
        </g>
      ))}
      {pinsR.map((p, i) => (
        <g key={`r${p}`}>
          <line x1={x + w} y1={y + 32 + i * 18} x2={x + w + 16} y2={y + 32 + i * 18} />
          <text
            x={x + w - 6}
            y={y + 36 + i * 18}
            textAnchor="end"
            fontFamily={F.mono}
            fontSize="10"
            fill="#4a4c44"
          >
            {p}
          </text>
        </g>
      ))}
    </Hit>
  );
}

export function Jack({ x, y, label, id }: { x: number; y: number; label: string; id: string }) {
  return (
    <Hit id={id}>
      <circle cx={x} cy={y} r="10" />
      <circle cx={x} cy={y} r="4" fill="#1c1d18" />
      <Tag x={x} y={y + 26} t={label} anchor="middle" small />
    </Hit>
  );
}
