import { MAIN, PCB_PARTS, POURS, TRACES, type Footprint, type PcbPart } from "./pcb";

export const FAB = {
  name: "IFT-NT-2026",
  title: "Hybrid-Labornetzteil Hauptplatine",
  rev: "A",
  date: "2026-08-12",
  w: MAIN.w,
  h: MAIN.d,
  thick: 1.6,
  cuUm: 35,
  layers: 2,
  finish: "HASL bleifrei",
  mask: "grün, glänzend",
  silk: "weiß",
  stack: "FR4 1,6 mm · 35 µm Cu beidseitig",
  minTrace: 0.9,
  minSpace: 0.35,
  slotW: 3.2,
  slotClear: 8,
  isolation: "≥ 8 mm Kriechstrecke / Frässchlitz 3,2 mm",
  standard: "IPC-6012 Klasse 2 · Gerber RS-274X · Excellon",
} as const;

export type FabLayer = "bot" | "top" | "mask" | "silk" | "drill" | "dim";

export type FabPad = {
  x: number;
  y: number;
  d: number;
  drill: number;
  shape: "circ" | "rect";
  w?: number;
  h?: number;
  rot?: number;
  layer: "top" | "bot" | "both";
  ref: string;
};

export type FabHole = { x: number; y: number; d: number; plated: boolean };

export function toBoard(x: number, z: number) {
  return { x: x + FAB.w / 2, y: z + FAB.h / 2 };
}

function rot2(x: number, y: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: x * c - y * s, y: x * s + y * c };
}

export function padsOf(p: PcbPart): FabPad[] {
  const o = toBoard(p.x, p.z);
  const add = (
    lx: number,
    ly: number,
    d: number,
    drill: number,
    extra: Partial<FabPad> = {},
  ): FabPad => {
    const r = rot2(lx, ly, p.rot);
    return {
      x: o.x + r.x,
      y: o.y + r.y,
      d,
      drill,
      shape: "circ",
      layer: extra.layer ?? "both",
      ref: p.ref,
      ...extra,
    };
  };

  switch (p.kind) {
    case "iec":
      return [add(-5, 8, 3.2, 1.6), add(0, 8, 3.2, 1.6), add(5, 8, 3.2, 1.6)];
    case "fuse":
      return [add(-6, 0, 2.4, 1.1), add(6, 0, 2.4, 1.1)];
    case "choke":
      return [add(-5, 0, 2.6, 1.2), add(5, 0, 2.6, 1.2)];
    case "bridge":
      return [add(-3.8, -3.8, 2.4, 1.1), add(3.8, -3.8, 2.4, 1.1), add(-3.8, 3.8, 2.4, 1.1), add(3.8, 3.8, 2.4, 1.1)];
    case "elko":
      return [add(-2.5, 0, 2.4, 1.0), add(2.5, 0, 2.4, 1.0)];
    case "elkoTall":
      return [add(-3.5, 0, 2.8, 1.2), add(3.5, 0, 2.8, 1.2)];
    case "res":
      return [add(-3.2, 0, 1.8, 0.8), add(3.2, 0, 1.8, 0.8)];
    case "resPwr":
      return [add(-4.5, 0, 2.2, 1.0), add(4.5, 0, 2.2, 1.0)];
    case "ceramic":
      return [add(-2.0, 0, 1.7, 0.8), add(2.0, 0, 1.7, 0.8)];
    case "to220":
      return [add(-2.54, 0, 2.0, 1.0), add(0, 0, 2.0, 1.0), add(2.54, 0, 2.0, 1.0)];
    case "to218":
      return [add(-5.45, 0, 2.4, 1.3), add(0, 0, 2.4, 1.3), add(5.45, 0, 2.4, 1.3)];
    case "to126":
      return [add(-2.3, 0, 1.9, 0.9), add(0, 0, 1.9, 0.9), add(2.3, 0, 1.9, 0.9)];
    case "efd30":
      return [
        add(-7.5, -10, 2.2, 1.0),
        add(-7.5, 10, 2.2, 1.0),
        add(7.5, -10, 2.2, 1.0),
        add(7.5, 10, 2.2, 1.0),
        add(-5, 0, 2.0, 0.9),
        add(5, 0, 2.0, 0.9),
      ];
    case "dip8":
      return Array.from({ length: 8 }, (_, i) => {
        const row = i < 4 ? -1 : 1;
        const col = i < 4 ? i : 7 - i;
        return add((col - 1.5) * 2.54, row * 3.81, 1.7, 0.8);
      });
    case "dip14":
      return Array.from({ length: 14 }, (_, i) => {
        const row = i < 7 ? -1 : 1;
        const col = i < 7 ? i : 13 - i;
        return add((col - 3) * 2.54, row * 3.81, 1.7, 0.8);
      });
    case "soic":
      return Array.from({ length: 8 }, (_, i) => {
        const row = i < 4 ? -1 : 1;
        const col = i < 4 ? i : 7 - i;
        return add((col - 1.5) * 1.27, row * 2.7, 1.1, 0, { layer: "top", shape: "rect", w: 0.7, h: 1.5 });
      });
    case "inductor":
      return [add(-2.5, 0, 2.2, 0.9), add(2.5, 0, 2.2, 0.9)];
    case "pot":
      return [add(-2.5, 2.5, 1.8, 0.8), add(0, -2.5, 1.8, 0.8), add(2.5, 2.5, 1.8, 0.8)];
    case "terminal":
      return [add(-4, 0, 2.6, 1.3), add(4, 0, 2.6, 1.3)];
    case "led":
      return [add(-1.27, 0, 1.6, 0.8), add(1.27, 0, 1.6, 0.8)];
    case "opto":
      return [add(-2.54, -1.27, 1.6, 0.7), add(2.54, -1.27, 1.6, 0.7), add(-2.54, 1.27, 1.6, 0.7), add(2.54, 1.27, 1.6, 0.7)];
    case "heatsink":
      return [add(-28, 0, 4.2, 3.2, { plated: false } as Partial<FabPad>), add(28, 0, 4.2, 3.2)];
    case "fan":
      return [add(-14, -14, 3.6, 3.2), add(14, -14, 3.6, 3.2), add(-14, 14, 3.6, 3.2), add(14, 14, 3.6, 3.2)];
    case "header":
      return Array.from({ length: 5 }, (_, i) => add((i - 2) * 8, 0, 2.0, 1.0));
    case "klixon":
      return [add(-4, 5, 1.8, 0.9), add(4, 5, 1.8, 0.9)];
    default:
      return [add(0, 0, 1.8, 0.8)];
  }
}

export function allPads(): FabPad[] {
  return PCB_PARTS.flatMap(padsOf);
}

export function mountingHoles(): FabHole[] {
  const m = 5;
  return [
    { x: m, y: m, d: 3.2, plated: false },
    { x: FAB.w - m, y: m, d: 3.2, plated: false },
    { x: m, y: FAB.h - m, d: 3.2, plated: false },
    { x: FAB.w - m, y: FAB.h - m, d: 3.2, plated: false },
  ];
}

export function slotRect() {
  const c = toBoard(-14, 0);
  return { x: c.x - FAB.slotW / 2, y: (FAB.h - FAB.h * 0.82) / 2, w: FAB.slotW, h: FAB.h * 0.82 };
}

export function tracesOnBoard() {
  return TRACES.map((t) => ({
    ...t,
    pts: t.pts.map(([x, z]) => {
      const p = toBoard(x, z);
      return [p.x, p.y] as [number, number];
    }),
  }));
}

export function poursOnBoard() {
  return POURS.map((p) => {
    const c = toBoard(p.x, p.z);
    return { ...p, x: c.x, y: c.y };
  });
}

function g(mm: number) {
  return Math.round(mm * 1e6);
}

function gerberHeader(fn: string, comment: string) {
  return [
    `G04 ${FAB.name} ${fn} ${comment}*`,
    "%FSLAX46Y46*%",
    "%MOMM*%",
    "%LPD*%",
  ].join("\n");
}

function collectApertures() {
  const circ = new Map<string, number>();
  const rect = new Map<string, number>();
  let n = 10;
  const c = (d: number) => {
    const k = d.toFixed(3);
    let id = circ.get(k);
    if (!id) {
      id = n++;
      circ.set(k, id);
    }
    return id;
  };
  const r = (w: number, h: number) => {
    const k = `${w.toFixed(3)}x${h.toFixed(3)}`;
    let id = rect.get(k);
    if (!id) {
      id = n++;
      rect.set(k, id);
    }
    return id;
  };
  return { circ, rect, c, r };
}

export function gerberTopCopper() {
  const { circ, rect, c, r } = collectApertures();
  const body: string[] = [];
  const pads = allPads();
  for (const t of tracesOnBoard()) {
    const d = c(t.w);
    body.push(`D${d}*`);
    t.pts.forEach((p, i) => {
      body.push(`X${g(p[0])}Y${g(p[1])}${i === 0 ? "D02" : "D01"}*`);
    });
  }
  for (const p of poursOnBoard()) {
    const d = c(0.4);
    body.push(`D${d}*`);
    const x0 = p.x - p.w / 2;
    const y0 = p.y - p.d / 2;
    const x1 = p.x + p.w / 2;
    const y1 = p.y + p.d / 2;
    body.push("G36*");
    body.push(`X${g(x0)}Y${g(y0)}D02*`);
    body.push(`X${g(x1)}Y${g(y0)}D01*`);
    body.push(`X${g(x1)}Y${g(y1)}D01*`);
    body.push(`X${g(x0)}Y${g(y1)}D01*`);
    body.push(`X${g(x0)}Y${g(y0)}D01*`);
    body.push("G37*");
  }
  for (const p of pads) {
    if (p.layer === "bot") continue;
    if (p.shape === "rect" && p.w && p.h) {
      body.push(`D${r(p.w, p.h)}*`);
    } else {
      body.push(`D${c(p.d)}*`);
    }
    body.push(`X${g(p.x)}Y${g(p.y)}D03*`);
  }
  return finishGerber("F_Cu.gtl", "Top copper", circ, rect, body);
}

export function gerberBotCopper() {
  const { circ, rect, c } = collectApertures();
  const body: string[] = [];
  const slot = slotRect();
  const d = c(0.5);
  body.push(`D${d}*`);
  const pours = [
    { x0: 2, y0: 2, x1: slot.x - 1.2, y1: FAB.h - 2 },
    { x0: slot.x + slot.w + 1.2, y0: 2, x1: FAB.w - 2, y1: FAB.h - 2 },
  ];
  for (const p of pours) {
    body.push("G36*");
    body.push(`X${g(p.x0)}Y${g(p.y0)}D02*`);
    body.push(`X${g(p.x1)}Y${g(p.y0)}D01*`);
    body.push(`X${g(p.x1)}Y${g(p.y1)}D01*`);
    body.push(`X${g(p.x0)}Y${g(p.y1)}D01*`);
    body.push(`X${g(p.x0)}Y${g(p.y0)}D01*`);
    body.push("G37*");
  }
  for (const p of allPads()) {
    if (p.layer === "top") continue;
    body.push(`D${c(Math.max(p.d, 1.6))}*`);
    body.push(`X${g(p.x)}Y${g(p.y)}D03*`);
  }
  for (const h of mountingHoles()) {
    body.push(`D${c(h.d + 1.2)}*`);
    body.push(`X${g(h.x)}Y${g(h.y)}D03*`);
  }
  return finishGerber("B_Cu.gbl", "Bottom copper GND", circ, rect, body);
}

export function gerberMask(side: "top" | "bot") {
  const { circ, rect, c, r } = collectApertures();
  const body: string[] = [];
  for (const p of allPads()) {
    if (side === "top" && p.layer === "bot") continue;
    if (side === "bot" && p.layer === "top") continue;
    const open = p.d + 0.16;
    if (p.shape === "rect" && p.w && p.h) {
      body.push(`D${r(p.w + 0.16, p.h + 0.16)}*`);
    } else {
      body.push(`D${c(open)}*`);
    }
    body.push(`X${g(p.x)}Y${g(p.y)}D03*`);
  }
  const name = side === "top" ? "F_Mask.gts" : "B_Mask.gbs";
  return finishGerber(name, `${side} soldermask openings`, circ, rect, body);
}

export function gerberSilk() {
  const { circ, rect, c } = collectApertures();
  const body: string[] = [];
  const d = c(0.18);
  body.push(`D${d}*`);
  for (const p of PCB_PARTS) {
    const o = toBoard(p.x, p.z);
    strokeText(body, p.ref, o.x + 1.2, o.y + 3.2, 1.1);
  }
  strokeText(body, `${FAB.name}  REV ${FAB.rev}`, 8, FAB.h - 6, 1.6);
  strokeText(body, "PRI 230 V", 10, 10, 1.4);
  strokeText(body, "SELV", FAB.w * 0.55, 10, 1.4);
  const slot = slotRect();
  body.push(`X${g(slot.x)}Y${g(slot.y)}D02*`);
  body.push(`X${g(slot.x)}Y${g(slot.y + slot.h)}D01*`);
  body.push(`X${g(slot.x + slot.w)}Y${g(slot.y)}D02*`);
  body.push(`X${g(slot.x + slot.w)}Y${g(slot.y + slot.h)}D01*`);
  return finishGerber("F_Silk.gto", "Top silkscreen", circ, rect, body);
}

function strokeText(body: string[], text: string, x: number, y: number, s: number) {
  const glyphs: Record<string, [number, number][][]> = {
    I: [[[0, 0], [0, 1]]],
    F: [[[0, 0], [0, 1], [0.7, 1]], [[0, 0.5], [0.55, 0.5]]],
    T: [[[0, 1], [0.8, 1]], [[0.4, 1], [0.4, 0]]],
    N: [[[0, 0], [0, 1], [0.7, 0], [0.7, 1]]],
    "-": [[[0.1, 0.45], [0.6, 0.45]]],
    "2": [[[0, 1], [0.7, 1], [0.7, 0.5], [0, 0.5], [0, 0], [0.7, 0]]],
    "0": [[[0, 0], [0, 1], [0.65, 1], [0.65, 0], [0, 0]]],
    "6": [[[0.65, 1], [0, 1], [0, 0], [0.65, 0], [0.65, 0.5], [0, 0.5]]],
    " ": [],
    P: [[[0, 0], [0, 1], [0.6, 1], [0.6, 0.5], [0, 0.5]]],
    R: [[[0, 0], [0, 1], [0.6, 1], [0.6, 0.5], [0, 0.5], [0.65, 0]]],
    S: [[[0.65, 1], [0, 1], [0, 0.5], [0.65, 0.5], [0.65, 0], [0, 0]]],
    E: [[[0.65, 1], [0, 1], [0, 0], [0.65, 0]], [[0, 0.5], [0.5, 0.5]]],
    L: [[[0, 1], [0, 0], [0.65, 0]]],
    V: [[[0, 1], [0.35, 0], [0.7, 1]]],
    A: [[[0, 0], [0.35, 1], [0.7, 0]], [[0.15, 0.4], [0.55, 0.4]]],
    "1": [[[0.35, 0], [0.35, 1]]],
    "3": [[[0, 1], [0.65, 1], [0.65, 0], [0, 0]], [[0.2, 0.5], [0.65, 0.5]]],
    "8": [[[0, 0], [0, 1], [0.6, 1], [0.6, 0], [0, 0]], [[0, 0.5], [0.6, 0.5]]],
  };
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const gph = glyphs[ch] ?? glyphs["-"] ?? [];
    for (const stroke of gph) {
      stroke.forEach((pt, i) => {
        body.push(`X${g(cx + pt[0] * s)}Y${g(y + pt[1] * s)}${i === 0 ? "D02" : "D01"}*`);
      });
    }
    cx += s * 0.95;
  }
}

export function gerberOutline() {
  const { circ, rect, c } = collectApertures();
  const body: string[] = [];
  body.push(`D${c(0.12)}*`);
  const w = FAB.w;
  const h = FAB.h;
  body.push(`X${g(0)}Y${g(0)}D02*`);
  body.push(`X${g(w)}Y${g(0)}D01*`);
  body.push(`X${g(w)}Y${g(h)}D01*`);
  body.push(`X${g(0)}Y${g(h)}D01*`);
  body.push(`X${g(0)}Y${g(0)}D01*`);
  const s = slotRect();
  body.push(`X${g(s.x)}Y${g(s.y)}D02*`);
  body.push(`X${g(s.x + s.w)}Y${g(s.y)}D01*`);
  body.push(`X${g(s.x + s.w)}Y${g(s.y + s.h)}D01*`);
  body.push(`X${g(s.x)}Y${g(s.y + s.h)}D01*`);
  body.push(`X${g(s.x)}Y${g(s.y)}D01*`);
  return finishGerber("Edge_Cuts.gm1", "Board outline + isolation slot", circ, rect, body);
}

function finishGerber(
  fn: string,
  comment: string,
  circ: Map<string, number>,
  rect: Map<string, number>,
  body: string[],
) {
  const ap: string[] = [];
  for (const [d, id] of [...circ.entries()].sort((a, b) => a[1] - b[1])) {
    ap.push(`%ADD${id}C,${d}*%`);
  }
  for (const [k, id] of [...rect.entries()].sort((a, b) => a[1] - b[1])) {
    const [w, h] = k.split("x");
    ap.push(`%ADD${id}R,${w}X${h}*%`);
  }
  return `${gerberHeader(fn, comment)}\n${ap.join("\n")}\nG01*\n${body.join("\n")}\nM02*\n`;
}

export function excellon(plated: boolean) {
  const tools = new Map<string, { d: number; holes: { x: number; y: number }[] }>();
  const add = (x: number, y: number, d: number) => {
    const k = d.toFixed(3);
    let t = tools.get(k);
    if (!t) {
      t = { d, holes: [] };
      tools.set(k, t);
    }
    t.holes.push({ x, y });
  };
  if (plated) {
    for (const p of allPads()) {
      if (p.drill > 0.15) add(p.x, p.y, p.drill);
    }
  } else {
    for (const h of mountingHoles()) add(h.x, h.y, h.d);
    const s = slotRect();
    add(s.x + s.w / 2, s.y + 1.6, 3.2);
    add(s.x + s.w / 2, s.y + s.h - 1.6, 3.2);
  }
  const lines = [
    "M48",
    "; FILE_FORMAT=3:3",
    `; ${FAB.name} ${plated ? "PTH" : "NPTH"}`,
    "METRIC,TZ",
  ];
  let i = 1;
  const ids: { id: string; t: { d: number; holes: { x: number; y: number }[] } }[] = [];
  for (const t of tools.values()) {
    const id = `T${String(i).padStart(2, "0")}`;
    lines.push(`${id}C${t.d.toFixed(3)}`);
    ids.push({ id, t });
    i++;
  }
  lines.push("%", "G05");
  const coord = (v: number) => {
    const n = Math.round(v * 1000);
    return String(n).padStart(6, "0");
  };
  for (const { id, t } of ids) {
    lines.push(id);
    for (const h of t.holes) {
      lines.push(`X${coord(h.x)}Y${coord(h.y)}`);
    }
  }
  lines.push("M30");
  return `${lines.join("\n")}\n`;
}

export function fabReadme() {
  return `FERTIGUNGSAUFTRAG  ${FAB.name}  Rev. ${FAB.rev}
${FAB.title}
Datum ${FAB.date}

PLATINE
  Abmessung     ${FAB.w.toFixed(1)} × ${FAB.h.toFixed(1)} mm
  Lage          ${FAB.layers} Kupferlagen
  Material      ${FAB.stack}
  Oberfläche    ${FAB.finish}
  Lötstopplack  ${FAB.mask}
  Bestückdruck  ${FAB.silk}
  Min. Bahn     ${FAB.minTrace} mm
  Min. Abstand  ${FAB.minSpace} mm
  Isolation     ${FAB.isolation}

DATEIEN (Gerber RS-274X, metrisch 4.6)
  ${FAB.name}-F_Cu.gtl         Kupfer oben
  ${FAB.name}-B_Cu.gbl         Kupfer unten (Masseflächen, getrennt an der Isolation)
  ${FAB.name}-F_Mask.gts       Lötstopp oben
  ${FAB.name}-B_Mask.gbs       Lötstopp unten
  ${FAB.name}-F_Silk.gto       Bestückdruck oben
  ${FAB.name}-Edge_Cuts.gm1    Kontur + Isolationsschlitz
  ${FAB.name}-PTH.drl          Durchkontaktierte Bohrungen (Excellon)
  ${FAB.name}-NPTH.drl         Mechanik / Schlitz (nicht durchkontaktiert)

HINWEISE FÜR DIE ÄTZEREI / LEITERPLATTENWERK
  • Primärseite (links) führt 230 V. Isolationsfräsung 3,2 mm nicht schließen.
  • Kriechstrecke Primär–SELV mindestens 8 mm (Luft- und Kriechstrecke).
  • Keine Kupferbrücke über den Schlitz.
  • Klasse: ${FAB.standard}
  • Stückzahl-Empfehlung Muster: 3–5, Serie nach Prüfung.
  • HB-533-Baugruppe ist auf dieser Karte mitgeführt (optimierte Integration).
    Conrad-Originalkarte 11 66 61 entfällt, wenn diese Platine bestückt wird.

PRÜFUNG VOR DEM ÄTZEN
  1. Gerber in einem Viewer öffnen (gerbv, KiCad, Online-Gerber-Viewer).
  2. Kontur ${FAB.w} × ${FAB.h} mm prüfen.
  3. Isolationsschlitz durchgängig.
  4. Bohrbild gegen Bestückungsplan.

Ansprechpartner: Meisterstück Informationstechnik  ·  ${FAB.name}
`;
}

export function fabCsv() {
  const rows = ["Ref;Name;Wert;X_mm;Y_mm;Rot;Lage"];
  for (const p of PCB_PARTS) {
    const o = toBoard(p.x, p.z);
    rows.push(
      `${p.ref};${p.name};${p.value};${o.x.toFixed(2)};${o.y.toFixed(2)};${p.rot};oben`,
    );
  }
  return `${rows.join("\n")}\n`;
}

export function buildFabFiles(): { name: string; text: string }[] {
  const p = FAB.name;
  return [
    { name: `${p}-F_Cu.gtl`, text: gerberTopCopper() },
    { name: `${p}-B_Cu.gbl`, text: gerberBotCopper() },
    { name: `${p}-F_Mask.gts`, text: gerberMask("top") },
    { name: `${p}-B_Mask.gbs`, text: gerberMask("bot") },
    { name: `${p}-F_Silk.gto`, text: gerberSilk() },
    { name: `${p}-Edge_Cuts.gm1`, text: gerberOutline() },
    { name: `${p}-PTH.drl`, text: excellon(true) },
    { name: `${p}-NPTH.drl`, text: excellon(false) },
    { name: `${p}-Bestueckung.csv`, text: fabCsv() },
    { name: "README-FERTIGUNG.txt", text: fabReadme() },
  ];
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u16(n: number) {
  const b = new Uint8Array(2);
  b[0] = n & 255;
  b[1] = (n >>> 8) & 255;
  return b;
}
function u32(n: number) {
  const b = new Uint8Array(4);
  b[0] = n & 255;
  b[1] = (n >>> 8) & 255;
  b[2] = (n >>> 16) & 255;
  b[3] = (n >>> 24) & 255;
  return b;
}

export function zipStore(files: { name: string; text: string }[]): Blob {
  const enc = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.text);
    const crc = crc32(data);
    const local = concat(
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      name,
      data,
    );
    locals.push(local);
    const central = concat(
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    );
    centrals.push(central);
    offset += local.length;
  }
  const centralSize = centrals.reduce((s, x) => s + x.length, 0);
  const eocd = concat(
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralSize),
    u32(offset),
    u16(0),
  );
  const all = concat(...locals, ...centrals, eocd);
  return new Blob([all.buffer as ArrayBuffer], { type: "application/zip" });
}

function concat(...parts: Uint8Array[]) {
  const n = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(n);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadText(text: string, name: string, mime = "text/plain") {
  downloadBlob(new Blob([text], { type: `${mime};charset=utf-8` }), name);
}

export type UnusedFoot = Footprint;
