import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BlockView() {
  const selected = useStudio((s) => s.selected);
  const select = useStudio((s) => s.select);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Blatt 00 · Topologie
          </p>
          <h2 className="text-lg font-medium">Blockschaltbild</h2>
        </div>
        <p className="text-sm text-muted">Feld antippen — Bauteile rechts</p>
      </div>
      <div className="overflow-x-auto rounded-xl bg-paper p-2 text-ink shadow-[var(--shadow-border)] md:p-4">
        <svg
          viewBox="0 0 1100 720"
          className="h-auto w-full min-w-xl"
          role="img"
          aria-label="Blockschaltbild des Multispannungs-Netzteils"
        >
          <defs>
            <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#7a2f2f" strokeWidth="1" opacity="0.35" />
            </pattern>
          </defs>

          <text x="24" y="28" fill="#4a4c44" fontFamily="IBM Plex Mono, monospace" fontSize="11">
            IFT-NT-2026 · 230 V / 50 Hz · PFC + QR-Flyback + Buck + Längsregler
          </text>

          <Zone x={16} y={44} w={1068} h={158} label="PRIMÄRSEITE  ·  230 V AC  ·  Schutzklasse I" stroke="#7a2f2f" fill="#f6e8e4" />
          <Zone x={16} y={248} w={1068} h={228} label="SEKUNDÄRSEITE  ·  SELV nach DIN EN 62368-1" stroke="#2a4a62" fill="#e4edf3" />
          <Zone x={16} y={508} w={1068} h={196} label="FRONT  ·  Anzeigen und Laborbuchsen" stroke="#3d6b4f" fill="#e5efe8" />

          <rect x="16" y="212" width="1068" height="24" fill="url(#hatch)" />
          <text x="550" y="228" textAnchor="middle" fill="#7a2f2f" fontFamily="IBM Plex Sans, sans-serif" fontSize="12" fontWeight="500">
            Galvanische Trennung — HF-Trafo T1 EFD30 / 3 kVrms — Kriechstrecke ≥ 8 mm
          </text>

          <Block
            id="in"
            x={36}
            y={72}
            w={200}
            h={108}
            title="Netzeingang"
            lines={["X1 Schurter C14 + PE", "F1 2 A T  ·  NTC1 10 Ω", "MOV1 S14K275"]}
            selected={selected}
            onSelect={select}
          />
          <Arrow x1={236} y1={126} x2={268} y2={126} />
          <Block
            id="emc"
            x={268}
            y={72}
            w={210}
            h={108}
            title="EMV-Filter"
            lines={["L1 WE-CMB 2×10 mH", "C1 100 nF X2", "CY1/2 2,2 nF Y2"]}
            selected={selected}
            onSelect={select}
          />
          <Arrow x1={478} y1={126} x2={510} y2={126} />
          <Block
            id="rect"
            x={510}
            y={72}
            w={220}
            h={108}
            title="PFC + Zwischenkreis"
            lines={["BR1 GBU406  ·  CCM-Boost", "IC9 UCC28019A  ·  390 V", "C2 120 µF / 400 V"]}
            selected={selected}
            onSelect={select}
          />
          <Arrow x1={730} y1={126} x2={762} y2={126} />
          <Block
            id="fly"
            x={762}
            y={72}
            w={300}
            h={108}
            title="QR-Sperrwandler"
            lines={["IC1 UC3843B  ·  Q1 STP10NK60Z", "Burst unter 30 %  ·  Rs 0,33 Ω", "OK1 LTV-817 + IC6 TL431"]}
            selected={selected}
            onSelect={select}
          />

          <path d="M912 180 v32" stroke="#1c1d18" strokeWidth="1.4" fill="none" />

          <Block
            id="bus"
            x={36}
            y={278}
            w={280}
            h={172}
            title="Sekundärbusse"
            lines={["D1/D2 MBR10100", "D3 MBR20100CT", "LC Low-ESR", "+15 V  ·  −15 V  ·  +35 V"]}
            selected={selected}
            onSelect={select}
          />

          <Arrow x1={316} y1={316} x2={360} y2={316} label="+15 V" />
          <Arrow x1={316} y1={368} x2={360} y2={368} label="+15 V" />
          <Arrow x1={316} y1={424} x2={360} y2={424} label="+35 V" />

          <Block
            id="p12"
            x={360}
            y={278}
            w={200}
            h={74}
            title="+12 V / 1 A"
            lines={["IC2 TPS5430 Buck", "L 15 µH  ·  η ≈ 94 %"]}
            selected={selected}
            onSelect={select}
          />
          <Block
            id="p5"
            x={580}
            y={278}
            w={200}
            h={74}
            title="+5 V / 1 A"
            lines={["IC4 TPS5430 Buck", "Rtop 30,9 kΩ  ·  η ≈ 93 %"]}
            selected={selected}
            onSelect={select}
          />
          <Block
            id="n12"
            x={360}
            y={368}
            w={200}
            h={74}
            title="−12 V / 1 A"
            lines={["IC3 TPS5430 invert.", "aus +15 V  ·  η ≈ 91 %"]}
            selected={selected}
            onSelect={select}
          />
          <Block
            id="n5"
            x={580}
            y={368}
            w={200}
            h={74}
            title="−5 V / 1 A"
            lines={["IC5 TPS5430 invert.", "η ≈ 89 %"]}
            selected={selected}
            onSelect={select}
          />
          <Block
            id="lab"
            x={800}
            y={278}
            w={262}
            h={164}
            title="Universal 1…30 V / 3 A"
            lines={["IC7 Tracking-Vorregler", "HB 533  ·  LM723 + 2× BD249", "R3/R4 0,47 Ω  ·  Pv ≤ 20 W", "K1 SK 85 + Lüfter"]}
            selected={selected}
            onSelect={select}
          />

          <path d="M460 352 v156" stroke="#1c1d18" strokeWidth="1.4" fill="none" />
          <path d="M680 352 v156" stroke="#1c1d18" strokeWidth="1.4" fill="none" />
          <path d="M460 442 v66" stroke="#1c1d18" strokeWidth="1.4" fill="none" />
          <path d="M680 442 v66" stroke="#1c1d18" strokeWidth="1.4" fill="none" />
          <path d="M931 442 v66" stroke="#1c1d18" strokeWidth="1.4" fill="none" />

          <Block
            id="meter"
            x={36}
            y={532}
            w={1028}
            h={152}
            title="Messtechnik  ·  5 × DSN-VC288  ·  Shunts 10 mΩ in der Rückleitung"
            lines={[
              "M1 +12 V    M2 −12 V    M3 +5 V    M4 −5 V    M5 1…30 V",
              "Sense direkt an den Buchsen — Eigenverbrauch verfälscht die Anzeige nicht",
              "Buchsen: rot / schwarz Labor, gemeinsame SELV-Masse, PE nur am Gehäuse",
            ]}
            selected={selected}
            onSelect={select}
          />
        </svg>
      </div>
    </div>
  );
}

function Zone({
  x,
  y,
  w,
  h,
  label,
  stroke,
  fill,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  stroke: string;
  fill: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <text x={x + 14} y={y + 22} fill={stroke} fontFamily="IBM Plex Mono, monospace" fontSize="11">
        {label}
      </text>
    </g>
  );
}

function Block({
  id,
  x,
  y,
  w,
  h,
  title,
  lines,
  selected,
  onSelect,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const on = selected === id;
  return (
    <g
      className={cn("cursor-pointer", on && "sch-sel")}
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(id);
      }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        fill={on ? "#fffdf6" : "#fbf7ee"}
        stroke={on ? "#2a4a62" : "#1c1d18"}
        strokeWidth={on ? 2.2 : 1.3}
      />
      <text x={x + 12} y={y + 22} fill="#1c1d18" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fontWeight="600">
        {title}
      </text>
      {lines.map((ln, i) => (
        <text
          key={ln}
          x={x + 12}
          y={y + 42 + i * 16}
          fill="#4a4c44"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="11"
        >
          {ln}
        </text>
      ))}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1c1d18" strokeWidth="1.4" />
      <polygon points={`${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}`} fill="#1c1d18" />
      {label && (
        <text x={(x1 + x2) / 2} y={y1 - 6} textAnchor="middle" fill="#4a4c44" fontFamily="IBM Plex Mono, monospace" fontSize="10">
          {label}
        </text>
      )}
    </g>
  );
}
