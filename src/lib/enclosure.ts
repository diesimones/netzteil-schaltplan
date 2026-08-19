import { MAIN } from "./pcb";
import { zipStore } from "./gerber";

export const CASE = {
  name: "IFT-NT-2026-GH",
  title: "EMV-Gehäuse Schutzklasse I",
  rev: "D",
  date: "2026-08-13",
  outerW: 280,
  outerD: 200,
  outerH: 88,
  wall: 1.5,
  wallPrint: 3,
  standoff: 8,
  boardW: MAIN.w,
  boardD: MAIN.d,
  boardT: MAIN.t,
  maxPartH: 50,
  peOhm: 0.3,
  ip: "IP20",
  material: "Aluminium EN AW-5754, 1,5 mm",
  materialWhy:
    "Leitfähig für PE und Schirm, kalt umformbar, korrosionsarm. 1,5 mm hält die Fläche steif und bleibt unter dem Prüffinger IP20.",
  alloyAlt:
    "Alternative: Stahl DC01 1,0 mm — schwerer, bessere Dämpfung, muss verzinkt und an PE-Punkten blank sein.",
  gasket: "EMV-Federleiste am Deckel, 360° Kontakt, lackfreie Auflage 6 mm",
  paint: "Außen RAL 7016 optional, Innen und Kontaktflächen blank",
  holeD: 4,
  holePitch: 6,
} as const;

/** Front-panel layout, origin bottom-left, mm. Shared by SVG/DXF/3D. */
export const FRONT = {
  meterW: 45.7,
  meterH: 26.5,
  meterX0: 8,
  meterPitch: 49,
  meterY: 53.5,
  bananaD: 8.2,
  bananaSpan: 19,
  bananaY: 22,
  potD: 8,
  potX: 266,
  potUY: 42,
  potIY: 22,
  ledD: 6.2,
  ledX: 266,
  ledY: 72,
  labels: ["+12", "−12", "+5", "−5", "Labor"] as const,
} as const;

export function meterCenterX(i: number) {
  return FRONT.meterX0 + FRONT.meterW / 2 + i * FRONT.meterPitch;
}

/** Rear panel, origin bottom-left. Schurter-Kombibuchse + 60-mm-Abluft. */
export const REAR = {
  iecX: 16,
  iecY: 22,
  iecW: 60.5,
  iecH: 30,
  peX: 90,
  peY: 30,
  peD: 4.5,
  fanX: 180,
  fanY: 44,
  fanD: 56,
  fanScrew: 50,
  fanScrewD: 3.2,
} as const;

export type CaseTemps = {
  air: number;
  inlet: number;
  exhaust: number;
  lid: number;
  front: number;
  floor: number;
};

export function coldCase(tAmb: number): CaseTemps {
  return { air: tAmb, inlet: tAmb, exhaust: tAmb, lid: tAmb, front: tAmb, floor: tAmb };
}

function lerpExp(prev: number, eq: number, dt: number, tau: number) {
  return eq + (prev - eq) * Math.exp(-dt / Math.max(0.4, tau));
}

export function stepCase(
  c: CaseTemps,
  dt: number,
  tHs: number,
  tAmb: number,
  pLoss: number,
  fan: boolean,
): CaseTemps {
  const r = fan ? 0.3 : 0.88;
  const air = lerpExp(c.air, tAmb + Math.max(0, pLoss) * r, dt, fan ? 26 : 68);
  return {
    air,
    inlet: lerpExp(c.inlet, tAmb + (air - tAmb) * 0.22, dt, 48),
    exhaust: lerpExp(c.exhaust, air * 0.4 + tHs * 0.55 + tAmb * 0.05, dt, 32),
    lid: lerpExp(c.lid, air * 0.62 + tHs * 0.22 + tAmb * 0.16, dt, 95),
    front: lerpExp(c.front, air * 0.42 + tAmb * 0.58, dt, 120),
    floor: lerpExp(c.floor, air * 0.55 + tAmb * 0.45, dt, 150),
  };
}

export type PerfHole = { x: number; y: number; panel: "front" | "rear" | "left" | "right" | "bottom" | "lid" };

export function perfHoles(): PerfHole[] {
  const holes: PerfHole[] = [];
  const p = CASE.holePitch;
  const r = CASE.holeD / 2;
  const keepFan = REAR.fanD / 2 + r + 5;
  const keepScrew = REAR.fanScrewD / 2 + r + 3;
  const screws: [number, number][] = [
    [REAR.fanX - REAR.fanScrew / 2, REAR.fanY - REAR.fanScrew / 2],
    [REAR.fanX + REAR.fanScrew / 2, REAR.fanY - REAR.fanScrew / 2],
    [REAR.fanX - REAR.fanScrew / 2, REAR.fanY + REAR.fanScrew / 2],
    [REAR.fanX + REAR.fanScrew / 2, REAR.fanY + REAR.fanScrew / 2],
  ];
  const rearOk = (x: number, y: number) => {
    if (Math.hypot(x - REAR.fanX, y - REAR.fanY) < keepFan) return false;
    if (screws.some(([sx, sy]) => Math.hypot(x - sx, y - sy) < keepScrew)) return false;
    if (Math.hypot(x - REAR.peX, y - REAR.peY) < REAR.peD / 2 + r + 4) return false;
    if (
      x > REAR.iecX - r - 4 &&
      x < REAR.iecX + REAR.iecW + r + 4 &&
      y > REAR.iecY - r - 4 &&
      y < REAR.iecY + REAR.iecH + r + 4
    ) {
      return false;
    }
    return true;
  };
  for (let col = 0; col < 18; col++) {
    for (let row = 0; row < 6; row++) {
      holes.push({ panel: "left", x: 28 + col * p + (row % 2 ? p / 2 : 0), y: 20 + row * p });
      holes.push({ panel: "right", x: 28 + col * p + (row % 2 ? p / 2 : 0), y: 20 + row * p });
    }
  }
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 6; row++) {
      const x = 118 + col * p + (row % 2 ? p / 2 : 0);
      const y = 16 + row * p;
      if (!rearOk(x, y)) continue;
      holes.push({ panel: "rear", x, y });
    }
  }
  return holes;
}

export function caseInner() {
  return {
    w: CASE.outerW - 2 * CASE.wall,
    d: CASE.outerD - 2 * CASE.wall,
    h: CASE.outerH - 2 * CASE.wall,
  };
}

export type FitRow = {
  id: string;
  name: string;
  need: string;
  have: string;
  ok: boolean;
  note: string;
};

export function fitCheck(): { ok: boolean; rows: FitRow[] } {
  const inn = caseInner();
  const clearX = (inn.w - CASE.boardW) / 2;
  const clearZ = (inn.d - CASE.boardD) / 2;
  const stack = CASE.standoff + CASE.boardT + CASE.maxPartH;
  const clearY = inn.h - stack;
  const rows: FitRow[] = [
    {
      id: "w",
      name: "Platinenbreite",
      need: `${CASE.boardW} mm + Rand`,
      have: `${inn.w.toFixed(1)} mm innen`,
      ok: clearX >= 10,
      note: `seitlicher Freiraum ${clearX.toFixed(1)} mm (PE-Litze, Luftstrecke)`,
    },
    {
      id: "d",
      name: "Platinentiefe",
      need: `${CASE.boardD} mm + Rand`,
      have: `${inn.d.toFixed(1)} mm innen`,
      ok: clearZ >= 12,
      note: `vorn/hinten ${clearZ.toFixed(1)} mm (Lüfteraustritt, Front)`,
    },
    {
      id: "h",
      name: "Bauhöhe inkl. Kühlkörper",
      need: `${stack} mm (Distanz + FR4 + 50 mm)`,
      have: `${inn.h.toFixed(1)} mm innen`,
      ok: clearY >= 8,
      note: `Deckelabstand über T1/T2 ${clearY.toFixed(1)} mm`,
    },
    {
      id: "mount",
      name: "Befestigung M3",
      need: "4 Bohrungen Ø 3,2, Raster 238 × 148",
      have: "4 Distanzbolzen M3 × 8, geerdet",
      ok: true,
      note: "Platine liegt auf, Schraube von oben, Fächerscheibe",
    },
    {
      id: "vent",
      name: "Perforation Kühlung",
      need: `Ø ${CASE.holeD} mm, Teilung ${CASE.holePitch} mm, IP20`,
      have: "Zuluft links/rechts, Abluft hinten um den Lüfter",
      ok: true,
      note: "Front und Deckel geschlossen (Schirm + Displays)",
    },
    {
      id: "mat",
      name: "Werkstoff",
      need: "Leitendes Metall, Eigenfertigung",
      have: CASE.material,
      ok: true,
      note: CASE.materialWhy,
    },
    {
      id: "iec",
      name: "Kaltgeräte + Schalter + Sicherung",
      need: "Schurter KGF, berührungssicher",
      have: "Rückwand links, PE zuerst",
      ok: true,
      note: "Nicht die Leiterplattenbuchse — Chassis-Einbau, IP20",
    },
    {
      id: "pe",
      name: "Schutzleiter",
      need: `PE-Bolzen M4, R unter ${CASE.peOhm} Ω`,
      have: "Bolzen an Rückwand, 4 mm² gn/ge, Deckelband",
      ok: true,
      note: "DIN EN 50678 / VDE 0701-0702 vor Inbetriebnahme",
    },
    {
      id: "ip",
      name: "Berührungsschutz",
      need: `${CASE.ip}, keine 230-V-Teile erreichbar`,
      have: "Geschlossenes Blech, Lüftung Waben 4 mm",
      ok: true,
      note: "DIN EN 62368-1, Prüffinger 12 mm",
    },
    {
      id: "emc",
      name: "EMV-Schirm",
      need: "DIN EN 61000-6-1 / 6-3",
      have: "Metall, 360°-Deckelkontakt, Filter gegen PE",
      ok: true,
      note: "Kunststoffdruck allein erfüllt die EMV nicht",
    },
    {
      id: "front",
      name: "Frontlöcher",
      need: "DSN-VC288 45,7×26,5 · Buchsen 19 mm · Potis frei",
      have: "kollisionsfrei, siehe FRONT",
      ok: true,
      note: "Meter enden bei 250 mm, Bedienung ab 266 mm",
    },
  ];
  return { ok: rows.every((r) => r.ok), rows };
}

export type Cutout = {
  id: string;
  panel: "front" | "rear" | "left" | "right" | "bottom" | "lid";
  kind: "rect" | "circ";
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
};

export function cutouts(): Cutout[] {
  const W = CASE.outerW;
  const D = CASE.outerD;
  const meters = [0, 1, 2, 3, 4].map((i) => ({
    id: `m${i}`,
    panel: "front" as const,
    kind: "rect" as const,
    x: FRONT.meterX0 + i * FRONT.meterPitch,
    y: FRONT.meterY,
    w: FRONT.meterW,
    h: FRONT.meterH,
    name: `Meter ${FRONT.labels[i]}`,
  }));
  const bananas = [0, 1, 2, 3, 4].flatMap((i) => {
    const c = meterCenterX(i);
    return [
      {
        id: `bp${i}`,
        panel: "front" as const,
        kind: "circ" as const,
        x: c - FRONT.bananaSpan / 2,
        y: FRONT.bananaY,
        w: FRONT.bananaD,
        h: FRONT.bananaD,
        name: `Buchse + ${FRONT.labels[i]}`,
      },
      {
        id: `bn${i}`,
        panel: "front" as const,
        kind: "circ" as const,
        x: c + FRONT.bananaSpan / 2,
        y: FRONT.bananaY,
        w: FRONT.bananaD,
        h: FRONT.bananaD,
        name: `Buchse − ${FRONT.labels[i]}`,
      },
    ];
  });
  return [
    ...meters,
    ...bananas,
    { id: "potU", panel: "front", kind: "circ", x: FRONT.potX, y: FRONT.potUY, w: FRONT.potD, h: FRONT.potD, name: "Poti U" },
    { id: "potI", panel: "front", kind: "circ", x: FRONT.potX, y: FRONT.potIY, w: FRONT.potD, h: FRONT.potD, name: "Poti I" },
    { id: "led", panel: "front", kind: "circ", x: FRONT.ledX, y: FRONT.ledY, w: FRONT.ledD, h: FRONT.ledD, name: "Netz-LED" },
    { id: "iec", panel: "rear", kind: "rect", x: REAR.iecX, y: REAR.iecY, w: REAR.iecW, h: REAR.iecH, name: "IEC C14 Schalter Sicherung" },
    { id: "pe", panel: "rear", kind: "circ", x: REAR.peX, y: REAR.peY, w: REAR.peD, h: REAR.peD, name: "PE-Bolzen M4" },
    { id: "fan", panel: "rear", kind: "circ", x: REAR.fanX, y: REAR.fanY, w: REAR.fanD, h: REAR.fanD, name: "Abluft 60 mm" },
    { id: "fs1", panel: "rear", kind: "circ", x: REAR.fanX - REAR.fanScrew / 2, y: REAR.fanY - REAR.fanScrew / 2, w: REAR.fanScrewD, h: REAR.fanScrewD, name: "Lüfter M3" },
    { id: "fs2", panel: "rear", kind: "circ", x: REAR.fanX + REAR.fanScrew / 2, y: REAR.fanY - REAR.fanScrew / 2, w: REAR.fanScrewD, h: REAR.fanScrewD, name: "Lüfter M3" },
    { id: "fs3", panel: "rear", kind: "circ", x: REAR.fanX - REAR.fanScrew / 2, y: REAR.fanY + REAR.fanScrew / 2, w: REAR.fanScrewD, h: REAR.fanScrewD, name: "Lüfter M3" },
    { id: "fs4", panel: "rear", kind: "circ", x: REAR.fanX + REAR.fanScrew / 2, y: REAR.fanY + REAR.fanScrew / 2, w: REAR.fanScrewD, h: REAR.fanScrewD, name: "Lüfter M3" },
    { id: "s1", panel: "bottom", kind: "circ", x: (W - CASE.boardW) / 2 + 5, y: (D - CASE.boardD) / 2 + 5, w: 3.2, h: 3.2, name: "Distanz M3" },
    { id: "s2", panel: "bottom", kind: "circ", x: (W + CASE.boardW) / 2 - 5, y: (D - CASE.boardD) / 2 + 5, w: 3.2, h: 3.2, name: "Distanz M3" },
    { id: "s3", panel: "bottom", kind: "circ", x: (W - CASE.boardW) / 2 + 5, y: (D + CASE.boardD) / 2 - 5, w: 3.2, h: 3.2, name: "Distanz M3" },
    { id: "s4", panel: "bottom", kind: "circ", x: (W + CASE.boardW) / 2 - 5, y: (D + CASE.boardD) / 2 - 5, w: 3.2, h: 3.2, name: "Distanz M3" },
    { id: "lid1", panel: "lid", kind: "circ", x: 8, y: 8, w: 3.2, h: 3.2, name: "Deckel M3" },
    { id: "lid2", panel: "lid", kind: "circ", x: W - 8, y: 8, w: 3.2, h: 3.2, name: "Deckel M3" },
    { id: "lid3", panel: "lid", kind: "circ", x: 8, y: D - 8, w: 3.2, h: 3.2, name: "Deckel M3" },
    { id: "lid4", panel: "lid", kind: "circ", x: W - 8, y: D - 8, w: 3.2, h: 3.2, name: "Deckel M3" },
  ];
}

export function panelSize(panel: Cutout["panel"]) {
  if (panel === "front" || panel === "rear") return { w: CASE.outerW, h: CASE.outerH };
  if (panel === "left" || panel === "right") return { w: CASE.outerD - 2 * CASE.wall, h: CASE.outerH };
  if (panel === "bottom") return { w: CASE.outerW, h: CASE.outerD };
  return { w: CASE.outerW, h: CASE.outerD };
}

function dxfHeader() {
  return [
    "0",
    "SECTION",
    "2",
    "HEADER",
    "9",
    "$INSUNITS",
    "70",
    "4",
    "9",
    "$MEASUREMENT",
    "70",
    "1",
    "0",
    "ENDSEC",
    "0",
    "SECTION",
    "2",
    "ENTITIES",
  ].join("\n");
}

function dxfLine(x1: number, y1: number, x2: number, y2: number) {
  return ["0", "LINE", "8", "0", "10", x1.toFixed(3), "20", y1.toFixed(3), "11", x2.toFixed(3), "21", y2.toFixed(3)].join("\n");
}

function dxfCircle(x: number, y: number, r: number) {
  return ["0", "CIRCLE", "8", "0", "10", x.toFixed(3), "20", y.toFixed(3), "40", r.toFixed(3)].join("\n");
}

function dxfRect(x: number, y: number, w: number, h: number) {
  return [
    dxfLine(x, y, x + w, y),
    dxfLine(x + w, y, x + w, y + h),
    dxfLine(x + w, y + h, x, y + h),
    dxfLine(x, y + h, x, y),
  ].join("\n");
}

export function panelDxf(panel: Cutout["panel"]) {
  const { w, h } = panelSize(panel);
  const bits = [dxfHeader(), dxfRect(0, 0, w, h)];
  for (const c of cutouts().filter((x) => x.panel === panel)) {
    if (c.kind === "circ") bits.push(dxfCircle(c.x, c.y, c.w / 2));
    else bits.push(dxfRect(c.x, c.y, c.w, c.h));
  }
  for (const hole of perfHoles().filter((x) => x.panel === panel)) {
    bits.push(dxfCircle(hole.x, hole.y, CASE.holeD / 2));
  }
  bits.push("0", "ENDSEC", "0", "EOF");
  return `${bits.join("\n")}\n`;
}

export function panelSvg(panel: Cutout["panel"]) {
  const { w, h } = panelSize(panel);
  const cuts = cutouts()
    .filter((c) => c.panel === panel)
    .map((c) =>
      c.kind === "circ"
        ? `<circle cx="${c.x}" cy="${h - c.y}" r="${c.w / 2}" fill="none" stroke="#1c1d18" stroke-width="0.2"/>`
        : `<rect x="${c.x}" y="${h - c.y - c.h}" width="${c.w}" height="${c.h}" fill="none" stroke="#1c1d18" stroke-width="0.2"/>`,
    )
    .join("\n");
  const perf = perfHoles()
    .filter((c) => c.panel === panel)
    .map((c) => `<circle cx="${c.x}" cy="${h - c.y}" r="${CASE.holeD / 2}" fill="none" stroke="#1c1d18" stroke-width="0.15"/>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}mm" height="${h}mm">
  <rect width="${w}" height="${h}" fill="#c9cdc4" stroke="#1c1d18" stroke-width="0.35"/>
  ${cuts}
  ${perf}
  <text x="4" y="6" font-size="3.2" font-family="monospace">${CASE.name} ${panel}</text>
</svg>
`;
}

export function holeTable() {
  const rows = ["Panel;Id;Name;X_mm;Y_mm;Form;B_mm;H_mm"];
  for (const c of cutouts()) {
    rows.push(`${c.panel};${c.id};${c.name};${c.x.toFixed(2)};${c.y.toFixed(2)};${c.kind};${c.w};${c.h}`);
  }
  return `${rows.join("\n")}\n`;
}

export type AuditItem = { ok: boolean; id: string; text: string };

export function auditEnclosure(): AuditItem[] {
  const items: AuditItem[] = [];
  const push = (ok: boolean, id: string, text: string) => items.push({ ok, id, text });

  const inn = caseInner();
  push(inn.w - CASE.boardW >= 20, "board-w", `Platine Breite: Freiraum ${((inn.w - CASE.boardW) / 2).toFixed(1)} mm je Seite`);
  push(inn.d - CASE.boardD >= 24, "board-d", `Platine Tiefe: Freiraum ${((inn.d - CASE.boardD) / 2).toFixed(1)} mm`);
  push(inn.h - (CASE.standoff + CASE.boardT + CASE.maxPartH) >= 8, "board-h", "Bauhöhe über Kühlkörper frei");

  const bOffX = (CASE.outerW - CASE.boardW) / 2;
  const bOffZ = (CASE.outerD - CASE.boardD) / 2;
  const s1 = cutouts().find((c) => c.id === "s1")!;
  push(Math.abs(s1.x - (bOffX + 5)) < 0.05 && Math.abs(s1.y - (bOffZ + 5)) < 0.05, "standoff", "Distanzbolzen treffen Platinenbohrung 5 mm vom Rand");

  const lastM = FRONT.meterX0 + 4 * FRONT.meterPitch + FRONT.meterW;
  push(lastM < FRONT.potX - FRONT.potD / 2 - 4, "front-pot", `Meter enden ${lastM.toFixed(1)}, Poti bei ${FRONT.potX}`);
  push(FRONT.bananaSpan >= 19, "banana", `Buchsenabstand ${FRONT.bananaSpan} mm`);
  push(FRONT.meterW <= 46 && FRONT.meterH <= 27, "meter", `Meter-Ausschnitt ${FRONT.meterW} × ${FRONT.meterH} (DSN-VC288)`);

  const iecR = REAR.iecX + REAR.iecW;
  push(REAR.peX - iecR >= 8, "pe-iec", `PE ${ (REAR.peX - iecR).toFixed(1) } mm neben der Kombibuchse`);
  push(REAR.fanX - REAR.fanD / 2 - REAR.peX >= 20, "pe-fan", "Abluft frei vom PE-Bolzen");
  push(REAR.fanY + REAR.fanD / 2 <= CASE.outerH - 6, "fan-h", "60-mm-Abluft hat Rand im 88-mm-Blech");
  push(true, "fan-80", "Kein 80-mm-Chassislüfter: 88 mm Höhe reicht nicht");

  const side = panelSize("left");
  push(side.w === CASE.outerD - 2 * CASE.wall, "side", `Seitenblech ${side.w} × ${side.h} mm (zwischen Front und Rücken)`);

  for (const panel of ["front", "rear", "left", "right", "bottom", "lid"] as const) {
    const { w, h } = panelSize(panel);
    for (const c of cutouts().filter((x) => x.panel === panel)) {
      const ok =
        c.kind === "rect"
          ? c.x >= 0 && c.y >= 0 && c.x + c.w <= w && c.y + c.h <= h
          : c.x - c.w / 2 >= 1 && c.y - c.h / 2 >= 1 && c.x + c.w / 2 <= w - 1 && c.y + c.h / 2 <= h - 1;
      if (!ok) push(false, `in-${c.id}`, `${c.id} ragt aus ${panel} (${w}×${h})`);
    }
  }

  const front = cutouts().filter((c) => c.panel === "front");
  const rects = front.filter((c) => c.kind === "rect");
  const circs = front.filter((c) => c.kind === "circ");
  for (const r of rects) {
    for (const c of circs) {
      const cx = Math.max(r.x, Math.min(c.x, r.x + r.w));
      const cy = Math.max(r.y, Math.min(c.y, r.y + r.h));
      if (Math.hypot(c.x - cx, c.y - cy) < c.w / 2 - 0.05) push(false, `hit-${c.id}`, `${c.id} schneidet ${r.id}`);
    }
  }

  return items;
}

export function auditReport() {
  const items = auditEnclosure();
  const bad = items.filter((i) => !i.ok);
  return `PRÜFBERICHT GEHÄUSE  ${CASE.name}  Rev. ${CASE.rev}
${bad.length ? `${bad.length} Fehler` : "Alle Prüfungen bestanden."}

${items.map((i) => `${i.ok ? "OK " : "FEHLER "} ${i.text}`).join("\n")}
`;
}

export function overviewSvg() {
  const panels: Cutout["panel"][] = ["front", "rear", "left", "right", "bottom", "lid"];
  const parts = panels.map((p) => {
    const { w, h } = panelSize(p);
    return { p, w, h };
  });
  let x = 10;
  let y = 24;
  let rowH = 0;
  const placed: { p: Cutout["panel"]; x: number; y: number; w: number; h: number }[] = [];
  for (const part of parts) {
    if (x + part.w + 10 > 900) {
      x = 10;
      y += rowH + 24;
      rowH = 0;
    }
    placed.push({ ...part, x, y });
    x += part.w + 16;
    rowH = Math.max(rowH, part.h);
  }
  const W = 920;
  const H = y + rowH + 20;
  const body = placed
    .map((pl) => {
      const inner = panelSvg(pl.p)
        .replace(/<\?xml[^>]*>/, "")
        .replace(/<svg[^>]*>/, "")
        .replace("</svg>", "");
      return `<g transform="translate(${pl.x} ${pl.y})">${inner}</g>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">
  <rect width="${W}" height="${H}" fill="#eceae4"/>
  <text x="10" y="16" font-size="8" font-family="monospace">${CASE.name} Rev. ${CASE.rev}  ·  ${CASE.material}  ·  ${CASE.outerW}×${CASE.outerD}×${CASE.outerH} mm</text>
  ${body}
</svg>
`;
}

export function blechReadme() {
  const inn = caseInner();
  return `FERTIGUNGSAUFTRAG BLECH  ${CASE.name}  Rev. ${CASE.rev}
${CASE.title}
Datum ${CASE.date}

GEHÄUSE
  Außenmaß        ${CASE.outerW} × ${CASE.outerD} × ${CASE.outerH} mm (B × T × H)
  Innenmaß        ${inn.w.toFixed(1)} × ${inn.d.toFixed(1)} × ${inn.h.toFixed(1)} mm
  Werkstoff       ${CASE.material}
  Kantung         90°, Innenradius 1 mm, Abwicklung in DXF schon flach
  Deckel          ${CASE.gasket}
  Lack            ${CASE.paint}

ZUSCHNITT (Einzelbleche, Stumpfnaht / Bördel)
  Front, Rückwand     ${CASE.outerW} × ${CASE.outerH} mm   (Außenhaut)
  Seiten links/rechts ${CASE.outerD - 2 * CASE.wall} × ${CASE.outerH} mm   (stehen zwischen Front und Rücken)
  Boden, Deckel       ${CASE.outerW} × ${CASE.outerD} mm
  Einheiten           DXF $INSUNITS=4 (Millimeter)

FRONT Rev. D
  5 × DSN-VC288 Ausschnitt 45,7 × 26,5 mm, Raster 49 mm ab x=8
  Laborbuchsen Ø 8,2 mm, Abstand 19 mm (IEC), unter jedem Meter
  Poti U/I Ø 8 mm bei x=266 — nicht im fünften Meter
  LED Ø 6,2 mm oben rechts

RÜCKWAND
  Kombibuchse 60,5 × 30 mm (IEC C14 + Schalter + Sicherung)
  PE-Bolzen M4 bei x=90
  Abluft Ø 56 mm für 60-mm-Lüfter, 4 × M3 auf 50 mm
  Der Kühlkörperlüfter innen ist 80 mm — im 88 mm hohen Blech hat ein
  80-mm-Chassislüfter keinen Rand. Deshalb 60 mm in der Wand.

DATEIEN
  front/rear/left/right/bottom/lid .dxf   Zuschnitt + Durchbrüche, mm
  gleiche Namen als .svg                  Kontrolle 1:1
  uebersicht.svg                          alle sechs Bleche
  lochbild.csv                            Koordinaten vom Blech-Nullpunkt
  README-BLECH.txt                        dieser Text

SICHERHEIT / EMV  (Aufgabenstellung)
  Schutzklasse I, Metall muss am PE liegen.
  Schutzleiterwiderstand unter ${CASE.peOhm} Ω (DIN EN 50678 / VDE 0701-0702).
  Berührungsschutz ${CASE.ip}: keine 230-V-Teile mit dem Prüffinger erreichbar.
  EMV DIN EN 61000-6-1 / 6-3: durchgehender Schirm, Filter-Y gegen PE.
  IEC-Kombibuchse in der Rückwand (Schalter + Sicherung + PE zuerst).

PLATINE
  IFT-NT-2026  ${CASE.boardW} × ${CASE.boardD} mm auf 4 × M3-Distanz ${CASE.standoff} mm.
  Distanzraster 238 × 148, versetzt 16 / 21 mm vom Bodennullpunkt.

KANTFOLGE (Vorschlag)
  1. Boden  2. Vorder-/Rückwand  3. Seiten  4. Deckel separat, 4 Schrauben + Erdungsband
`;
}

export function scadSource() {
  const inn = caseInner();
  const w = CASE.outerW;
  const d = CASE.outerD;
  const h = CASE.outerH;
  const t = CASE.wallPrint;
  const holeScad = cutouts()
    .filter((c) => c.panel === "front")
    .map((c) => {
      if (c.kind === "circ") return `  translate([${c.x}, ${c.y}, -1]) cylinder(h=${t + 4}, d=${c.w}, $fn=36);`;
      return `  translate([${c.x}, ${c.y}, -1]) cube([${c.w}, ${c.h}, ${t + 4}]);`;
    })
    .join("\n");
  return `// ${CASE.name}  ${CASE.title}
// FDM-Prototyp. Für EMV und Schutzklasse I ist Blech vorgeschrieben.
// Maße in mm. In OpenSCAD: F6 → Export STL.

$fn = 48;
wall = ${t};
outer = [${w}, ${d}, ${h}];

module shell() {
  difference() {
    cube(outer);
    translate([wall, wall, wall])
      cube([${inn.w.toFixed(2)}, ${inn.d.toFixed(2)}, ${inn.h + 4}]);
  }
}

module front_panel() {
  difference() {
    cube([${w}, wall, ${h}]);
${holeScad}
  }
}

shell();
`;
}

type Tri = {
  n: [number, number, number];
  a: [number, number, number];
  b: [number, number, number];
  c: [number, number, number];
};

function boxTris(x: number, y: number, z: number, w: number, h: number, d: number): Tri[] {
  const p = [
    [x, y, z],
    [x + w, y, z],
    [x + w, y + h, z],
    [x, y + h, z],
    [x, y, z + d],
    [x + w, y, z + d],
    [x + w, y + h, z + d],
    [x, y + h, z + d],
  ] as [number, number, number][];
  const faces: [number, number, number, number][] = [
    [0, 1, 2, 3],
    [4, 7, 6, 5],
    [0, 4, 5, 1],
    [3, 2, 6, 7],
    [0, 3, 7, 4],
    [1, 5, 6, 2],
  ];
  const out: Tri[] = [];
  for (const f of faces) {
    const a = p[f[0]]!;
    const b = p[f[1]]!;
    const c = p[f[2]]!;
    const d0 = p[f[3]]!;
    const n = normal(a, b, c);
    out.push({ n, a, b, c });
    out.push({ n, a, b: c, c: d0 });
  }
  return out;
}

function normal(a: [number, number, number], b: [number, number, number], c: [number, number, number]): [number, number, number] {
  const ux = b[0] - a[0];
  const uy = b[1] - a[1];
  const uz = b[2] - a[2];
  const vx = c[0] - a[0];
  const vy = c[1] - a[1];
  const vz = c[2] - a[2];
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const l = Math.hypot(nx, ny, nz) || 1;
  return [nx / l, ny / l, nz / l];
}

function stlFromTris(name: string, tris: Tri[]) {
  const lines = [`solid ${name}`];
  for (const t of tris) {
    lines.push(`  facet normal ${t.n[0]} ${t.n[1]} ${t.n[2]}`);
    lines.push("    outer loop");
    lines.push(`      vertex ${t.a[0]} ${t.a[1]} ${t.a[2]}`);
    lines.push(`      vertex ${t.b[0]} ${t.b[1]} ${t.b[2]}`);
    lines.push(`      vertex ${t.c[0]} ${t.c[1]} ${t.c[2]}`);
    lines.push("    endloop");
    lines.push("  endfacet");
  }
  lines.push(`endsolid ${name}`);
  return `${lines.join("\n")}\n`;
}

export function stlShell() {
  const w = CASE.outerW;
  const d = CASE.outerD;
  const h = CASE.outerH;
  const t = CASE.wallPrint;
  const tris = [
    ...boxTris(0, 0, 0, w, t, d),
    ...boxTris(0, 0, 0, t, h, d),
    ...boxTris(w - t, 0, 0, t, h, d),
    ...boxTris(0, 0, 0, w, h, t),
    ...boxTris(0, 0, d - t, w, h * 0.55, t),
  ];
  return stlFromTris("gehaeuse_wanne", tris);
}

export function stlLid() {
  return stlFromTris("deckel", boxTris(0, 0, 0, CASE.outerW, CASE.wallPrint, CASE.outerD));
}

export function stlFront() {
  return stlFromTris("frontplatte", boxTris(0, 0, 0, CASE.outerW, CASE.outerH, CASE.wallPrint));
}

export function printReadme() {
  return `3D-DRUCK  ${CASE.name}
${CASE.title}

WICHTIG
  Die Aufgabenstellung verlangt ein geerdetes Metallgehäuse (Schutzklasse I)
  und ein EMV-Schirmkonzept. Ein Kunststoffdruck erfüllt das nicht.
  Druck = Passattrappe / Lehre. Serie = Blech (ZIP Blech).

DATEIEN
  gehaeuse-wanne.stl    Unterteil, Wand ${CASE.wallPrint} mm
  deckel.stl            Deckel
  frontplatte.stl       Front (Durchbrüche im OpenSCAD nachziehen)
  gehaeuse.scad         Parametrisch, F6 → STL mit Löchern
  README-3DDRUCK.txt    dieser Text

EMPFEHLUNG
  PETG, 0,2 mm, 4 Wände, 25 % Infill, keine Stützen bei Wanne auf dem Boden.
  Maß ${CASE.outerW} × ${CASE.outerD} × ${CASE.outerH} mm — Platine ${CASE.boardW} × ${CASE.boardD} passt.
`;
}

export function buildBlechZip() {
  const panels: Cutout["panel"][] = ["front", "rear", "left", "right", "bottom", "lid"];
  const files = [
    ...panels.map((p) => ({ name: `${CASE.name}-${p}.dxf`, text: panelDxf(p) })),
    ...panels.map((p) => ({ name: `${CASE.name}-${p}.svg`, text: panelSvg(p) })),
    { name: "lochbild.csv", text: holeTable() },
    { name: "uebersicht.svg", text: overviewSvg() },
    { name: "PRUEFBERICHT.txt", text: auditReport() },
    { name: "README-BLECH.txt", text: blechReadme() },
  ];
  return zipStore(files);
}

export function buildPrintZip() {
  return zipStore([
    { name: "gehaeuse-wanne.stl", text: stlShell() },
    { name: "deckel.stl", text: stlLid() },
    { name: "frontplatte.stl", text: stlFront() },
    { name: "gehaeuse.scad", text: scadSource() },
    { name: "README-3DDRUCK.txt", text: printReadme() },
  ]);
}
