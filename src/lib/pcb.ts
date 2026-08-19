import type { HeatId, Zone } from "./design";

export type Footprint =
  | "iec"
  | "fuse"
  | "choke"
  | "bridge"
  | "elko"
  | "elkoTall"
  | "res"
  | "resPwr"
  | "ceramic"
  | "to220"
  | "to218"
  | "to126"
  | "efd30"
  | "dip8"
  | "dip14"
  | "soic"
  | "inductor"
  | "pot"
  | "terminal"
  | "led"
  | "opto"
  | "heatsink"
  | "fan"
  | "header"
  | "klixon";

export type PcbPart = {
  id: string;
  ref: string;
  name: string;
  value: string;
  x: number;
  z: number;
  y: number;
  rot: number;
  kind: Footprint;
  heat?: HeatId;
  zone: Zone;
  board: "main" | "kit";
};

export const MAIN = { w: 248, d: 158, t: 1.6 };
export const KIT = { w: 152, d: 94, t: 1.6 };
export const KIT_POS = { x: 62, y: 10, z: 14 };

const kx = KIT_POS.x;
const kz = KIT_POS.z;
const ky = KIT_POS.y + 0.9;

export const PCB_PARTS: PcbPart[] = [
  // —— Main primary ——
  { id: "x1", ref: "X1", name: "Kaltgerätebuchse", value: "IEC C14 / 10 A", x: -104, z: 52, y: 0, rot: 0, kind: "iec", zone: "pri", board: "main" },
  { id: "f1", ref: "F1", name: "Feinsicherung", value: "2,0 A T / 250 V", x: -104, z: 22, y: 0, rot: 90, kind: "fuse", zone: "pri", board: "main" },
  { id: "ntc1", ref: "NTC1", name: "Einschaltbegrenzer", value: "10 Ω", x: -104, z: 2, y: 0, rot: 0, kind: "res", zone: "pri", board: "main" },
  { id: "mov1", ref: "MOV1", name: "Varistor", value: "S14K275", x: -82, z: 2, y: 0, rot: 0, kind: "ceramic", zone: "pri", board: "main" },
  { id: "l1", ref: "L1", name: "Gleichtaktdrossel", value: "2 × 10 mH", x: -92, z: -28, y: 0, rot: 0, kind: "choke", zone: "pri", board: "main" },
  { id: "c1", ref: "C1", name: "X2", value: "100 nF / 275 V", x: -68, z: -28, y: 0, rot: 0, kind: "ceramic", zone: "pri", board: "main" },
  { id: "cy1", ref: "CY1/2", name: "Y2", value: "2,2 nF", x: -68, z: -48, y: 0, rot: 0, kind: "ceramic", zone: "pri", board: "main" },
  { id: "br1", ref: "BR1", name: "Brücke primär", value: "GBU406", x: -62, z: 48, y: 0, rot: 0, kind: "bridge", heat: "br1", zone: "pri", board: "main" },
  { id: "c2", ref: "C2", name: "Zwischenkreis", value: "120 µF / 400 V", x: -36, z: 48, y: 0, rot: 0, kind: "elkoTall", heat: "br1", zone: "pri", board: "main" },
  { id: "r1", ref: "R1", name: "Entladewiderstand", value: "100 kΩ / 2 W", x: -36, z: 22, y: 0, rot: 0, kind: "resPwr", zone: "pri", board: "main" },
  { id: "ic1", ref: "IC1", name: "PWM", value: "UC3843B", x: -62, z: -52, y: 0, rot: 0, kind: "dip8", zone: "pri", board: "main" },
  { id: "q1", ref: "Q1", name: "MOSFET", value: "STP10NK60Z", x: -34, z: -50, y: 0, rot: 90, kind: "to220", heat: "q1", zone: "pri", board: "main" },
  { id: "rs", ref: "Rs", name: "Shunt PWM", value: "0,33 Ω / 2 W", x: -34, z: -28, y: 0, rot: 0, kind: "resPwr", zone: "pri", board: "main" },
  { id: "t1", ref: "T1", name: "Sperrwandler", value: "EFD30 / 3 kVrms", x: -8, z: 4, y: 0, rot: 0, kind: "efd30", heat: "t1", zone: "iso", board: "main" },
  { id: "ok1", ref: "OK1", name: "Optokoppler", value: "LTV-817", x: -8, z: -42, y: 0, rot: 0, kind: "opto", zone: "iso", board: "main" },

  // —— Main secondary ——
  { id: "d1", ref: "D1", name: "Schottky +15 V", value: "MBR10100", x: 22, z: -48, y: 0, rot: 90, kind: "to220", heat: "d15", zone: "sec", board: "main" },
  { id: "d2", ref: "D2", name: "Schottky −15 V", value: "MBR10100", x: 22, z: -26, y: 0, rot: 90, kind: "to220", heat: "d15", zone: "sec", board: "main" },
  { id: "d3", ref: "D3", name: "Schottky +35 V", value: "MBR20100CT", x: 22, z: 0, y: 0, rot: 90, kind: "to220", heat: "d35", zone: "sec", board: "main" },
  { id: "c3", ref: "C3", name: "Sieb +15 V", value: "1000 µF", x: 42, z: -48, y: 0, rot: 0, kind: "elko", zone: "sec", board: "main" },
  { id: "c5", ref: "C5", name: "Sieb −15 V", value: "1000 µF", x: 42, z: -26, y: 0, rot: 0, kind: "elko", zone: "sec", board: "main" },
  { id: "c7", ref: "C7", name: "Sieb +35 V", value: "2200 µF", x: 42, z: 2, y: 0, rot: 0, kind: "elko", heat: "d35", zone: "sec", board: "main" },

  { id: "ic2", ref: "IC2", name: "Buck +12 V", value: "TPS5430", x: 72, z: -52, y: 0, rot: 0, kind: "soic", heat: "buck", zone: "sec", board: "main" },
  { id: "l2", ref: "L2", name: "Drossel +12 V", value: "15 µH", x: 92, z: -52, y: 0, rot: 0, kind: "inductor", zone: "sec", board: "main" },
  { id: "ic4", ref: "IC4", name: "Buck +5 V", value: "TPS5430", x: 72, z: -30, y: 0, rot: 0, kind: "soic", heat: "buck", zone: "sec", board: "main" },
  { id: "l4", ref: "L4", name: "Drossel +5 V", value: "15 µH", x: 92, z: -30, y: 0, rot: 0, kind: "inductor", zone: "sec", board: "main" },
  { id: "ic3", ref: "IC3", name: "Inverter −12 V", value: "TPS5430", x: 72, z: -8, y: 0, rot: 0, kind: "soic", heat: "inv", zone: "sec", board: "main" },
  { id: "l3", ref: "L3", name: "Drossel −12 V", value: "15 µH", x: 92, z: -8, y: 0, rot: 0, kind: "inductor", zone: "sec", board: "main" },
  { id: "ic5", ref: "IC5", name: "Inverter −5 V", value: "TPS5430", x: 72, z: 14, y: 0, rot: 0, kind: "soic", heat: "inv", zone: "sec", board: "main" },
  { id: "l5", ref: "L5", name: "Drossel −5 V", value: "15 µH", x: 92, z: 14, y: 0, rot: 0, kind: "inductor", zone: "sec", board: "main" },

  { id: "prereg", ref: "IC7", name: "Tracking-Vorregler", value: "TPS5430", x: 28, z: 32, y: 0, rot: 0, kind: "soic", heat: "ic7", zone: "lab", board: "main" },
  { id: "l8", ref: "L8", name: "Drossel Vorregler", value: "15 µH", x: 48, z: 32, y: 0, rot: 0, kind: "inductor", zone: "lab", board: "main" },
  { id: "c8", ref: "C8", name: "Elko Vorregler", value: "470 µF / 50 V", x: 28, z: 52, y: 0, rot: 0, kind: "elko", zone: "lab", board: "main" },

  { id: "disp", ref: "M1–M5", name: "Meter-Stecker", value: "DSN-VC288", x: 100, z: 62, y: 0, rot: 0, kind: "header", zone: "meter", board: "main" },

  // —— HB 533 kit (Bestückungsplan) ——
  { id: "st3", ref: "ST3", name: "Ausgang −U+", value: "Klemme RM 10", x: kx - 52, z: kz + 36, y: ky, rot: 0, kind: "terminal", zone: "lab", board: "kit" },
  { id: "st1", ref: "ST1", name: "Amperemeter", value: "Klemme RM 7,5", x: kx + 4, z: kz + 38, y: ky, rot: 0, kind: "terminal", zone: "lab", board: "kit" },
  { id: "st2", ref: "ST2", name: "Eingang ~", value: "Klemme RM 10", x: kx + 52, z: kz + 36, y: ky, rot: 0, kind: "terminal", zone: "lab", board: "kit" },
  { id: "fk", ref: "F1", name: "Sicherung Kit", value: "F 4 A", x: kx + 54, z: kz + 14, y: ky, rot: 90, kind: "fuse", zone: "lab", board: "kit" },
  { id: "c1k", ref: "C1", name: "Sieb-Elko Kit", value: "4700 µF / 50 V", x: kx + 22, z: kz + 6, y: ky, rot: 0, kind: "elkoTall", zone: "lab", board: "kit" },
  { id: "ic8", ref: "IC1", name: "LM723", value: "LM723 / UA723", x: kx - 6, z: kz + 2, y: ky, rot: 0, kind: "dip14", zone: "lab", board: "kit" },
  { id: "pot4", ref: "POT4", name: "Spannung grob", value: "10 kΩ", x: kx + 8, z: kz + 28, y: ky, rot: 0, kind: "pot", zone: "lab", board: "kit" },
  { id: "pot5", ref: "POT5", name: "Spannung fein", value: "500 Ω", x: kx - 12, z: kz + 28, y: ky, rot: 0, kind: "pot", zone: "lab", board: "kit" },
  { id: "pot6", ref: "POT6", name: "Stromgrenze", value: "500 Ω", x: kx - 32, z: kz + 28, y: ky, rot: 0, kind: "pot", zone: "lab", board: "kit" },
  { id: "led1", ref: "LED1", name: "Betriebs-LED", value: "rot 5 mm LC", x: kx + 40, z: kz - 4, y: ky, rot: 0, kind: "led", zone: "lab", board: "kit" },
  { id: "brk", ref: "BR1", name: "Brücke Kit", value: "B40C5000", x: kx + 48, z: kz - 22, y: ky, rot: 0, kind: "bridge", zone: "lab", board: "kit" },
  { id: "d1k", ref: "D1", name: "Schutzdiode", value: "1N5401", x: kx - 48, z: kz + 14, y: ky, rot: 90, kind: "res", zone: "lab", board: "kit" },
  { id: "t3", ref: "T3", name: "Treiber", value: "BD136 PNP", x: kx - 18, z: kz - 12, y: ky, rot: 0, kind: "to126", zone: "lab", board: "kit" },
  { id: "re", ref: "R3", name: "Emitter T1", value: "0,47 Ω / 5 W", x: kx - 44, z: kz - 16, y: ky, rot: 90, kind: "resPwr", zone: "lab", board: "kit" },
  { id: "re2", ref: "R4", name: "Emitter T2", value: "0,47 Ω / 5 W", x: kx - 22, z: kz - 28, y: ky, rot: 90, kind: "resPwr", zone: "lab", board: "kit" },
  { id: "rcl", ref: "R7", name: "Strom-Shunt", value: "0,15 Ω / 5 W", x: kx + 12, z: kz - 18, y: ky, rot: 90, kind: "resPwr", zone: "lab", board: "kit" },
  { id: "q2", ref: "T1", name: "Längstransistor", value: "BD249", x: kx - 48, z: kz - 42, y: ky, rot: 180, kind: "to218", heat: "q23", zone: "lab", board: "kit" },
  { id: "q3", ref: "T2", name: "Längstransistor", value: "BD249", x: kx - 22, z: kz - 42, y: ky, rot: 180, kind: "to218", heat: "q23", zone: "lab", board: "kit" },
  { id: "hs", ref: "K1", name: "Kühlkörper", value: "SK 85 + Lüfter", x: kx - 34, z: kz - 58, y: ky, rot: 0, kind: "heatsink", heat: "hs", zone: "mech", board: "kit" },
  { id: "klx", ref: "Sth", name: "Klixon Thermoschalter", value: "ein 58 °C / aus 46 °C", x: kx - 6, z: kz - 58, y: ky + 29, rot: 0, kind: "klixon", heat: "hs", zone: "mech", board: "kit" },
  { id: "fan", ref: "M", name: "Lüfter", value: "12 V / 80 mm", x: kx - 34, z: kz - 78, y: ky, rot: 0, kind: "fan", heat: "hs", zone: "mech", board: "kit" },
];

export function pcbById(id: string) {
  return PCB_PARTS.find((p) => p.id === id);
}

export type PcbTrace = {
  id: string;
  board: "main" | "kit";
  heat?: HeatId;
  w: number;
  pts: [number, number][];
};

export type PcbPour = {
  id: string;
  board: "main" | "kit";
  heat?: HeatId;
  x: number;
  z: number;
  w: number;
  d: number;
};

function tr(
  id: string,
  board: "main" | "kit",
  heat: HeatId | undefined,
  w: number,
  ...xy: number[]
): PcbTrace {
  const pts: [number, number][] = [];
  for (let i = 0; i + 1 < xy.length; i += 2) pts.push([xy[i]!, xy[i + 1]!]);
  return { id, board, heat, w, pts };
}

/** Manhattan power and signal traces — world XZ, follow the Bestückung. */
export const TRACES: PcbTrace[] = [
  // Primary AC / rectifier
  tr("m-ac1", "main", undefined, 2.4, -104, 52, -104, 22, -104, 2, -92, 2, -92, -28),
  tr("m-ac2", "main", undefined, 2.2, -98, 52, -82, 52, -82, 2, -82, -28, -68, -28),
  tr("m-n", "main", undefined, 1.6, -104, 58, -68, 58, -68, 48),
  tr("m-br-c2", "main", "br1", 4.2, -62, 48, -36, 48),
  tr("m-c2-q1", "main", "q1", 3.6, -36, 48, -20, 48, -20, -50, -34, -50),
  tr("m-c2-r1", "main", undefined, 1.4, -36, 48, -36, 22),
  tr("m-q1-t1", "main", "q1", 3.2, -34, -50, -20, -50, -20, 4, -16, 4),
  tr("m-rs", "main", "q1", 2.4, -34, -50, -34, -28, -48, -28, -48, -62),
  tr("m-ic1-q", "main", undefined, 1.1, -62, -52, -48, -52, -48, -50, -34, -50),
  tr("m-ic1-ok", "main", undefined, 1.0, -62, -52, -62, -42, -8, -42),
  tr("m-ok-t1", "main", undefined, 1.0, -8, -42, -8, -20),

  // Secondary rectifiers
  tr("m-t1-d1", "main", "d15", 3.0, -2, -20, 22, -20, 22, -48),
  tr("m-t1-d2", "main", "d15", 3.0, -2, -8, 22, -8, 22, -26),
  tr("m-t1-d3", "main", "d35", 3.6, -2, 8, 22, 8, 22, 0),
  tr("m-d1-c3", "main", "d15", 3.2, 22, -48, 42, -48),
  tr("m-d2-c5", "main", "d15", 3.2, 22, -26, 42, -26),
  tr("m-d3-c7", "main", "d35", 4.0, 22, 0, 42, 2),

  // Rails
  tr("m-c3-ic2", "main", "buck", 2.6, 42, -48, 72, -48, 72, -52),
  tr("m-ic2-l2", "main", "buck", 2.4, 72, -52, 92, -52),
  tr("m-c5-ic3", "main", "inv", 2.4, 42, -26, 56, -26, 56, -8, 72, -8),
  tr("m-ic3-l3", "main", "inv", 2.2, 72, -8, 92, -8),
  tr("m-c3-ic4", "main", "buck", 2.4, 42, -48, 42, -30, 72, -30),
  tr("m-ic4-l4", "main", "buck", 2.2, 72, -30, 92, -30),
  tr("m-c5-ic5", "main", "inv", 2.2, 56, -8, 56, 14, 72, 14),
  tr("m-ic5-l5", "main", "inv", 2.2, 72, 14, 92, 14),

  // Rail outputs to meter header
  tr("m-l2-m", "main", "buck", 2.0, 92, -52, 108, -52, 108, 62, 100, 62),
  tr("m-l4-m", "main", "buck", 1.8, 92, -30, 112, -30, 112, 62),
  tr("m-l3-m", "main", "inv", 1.8, 92, -8, 116, -8, 116, 62),
  tr("m-l5-m", "main", "inv", 1.8, 92, 14, 120, 14, 120, 62),

  // Tracking prereg → kit
  tr("m-c7-ic7", "main", "ic7", 3.4, 42, 2, 42, 32, 28, 32),
  tr("m-ic7-l8", "main", "ic7", 3.0, 28, 32, 48, 32),
  tr("m-l8-c8", "main", "ic7", 2.6, 48, 32, 48, 52, 28, 52),
  tr("m-l8-kit", "main", "ic7", 3.2, 48, 32, 62, 32, 62, 40, kx + 52, kz + 36),

  // GND spine
  tr("m-gnd1", "main", undefined, 3.8, -110, 70, 118, 70),
  tr("m-gnd2", "main", undefined, 2.4, 18, 70, 18, -60),

  // —— HB 533 (Anleitung Bestückungsplan) ——
  tr("k-st2-f", "kit", undefined, 2.8, kx + 52, kz + 36, kx + 54, kz + 14),
  tr("k-f-br", "kit", undefined, 2.6, kx + 54, kz + 14, kx + 48, kz - 22),
  tr("k-br-c1", "kit", undefined, 4.0, kx + 48, kz - 22, kx + 22, kz - 22, kx + 22, kz + 6),
  tr("k-c1-bus", "kit", "q23", 4.4, kx + 22, kz + 6, kx + 22, kz - 42, kx - 22, kz - 42),
  tr("k-bus-t1", "kit", "q23", 4.0, kx - 22, kz - 42, kx - 48, kz - 42),
  tr("k-t1-r3", "kit", "q23", 3.4, kx - 48, kz - 42, kx - 48, kz - 16, kx - 44, kz - 16),
  tr("k-t2-r4", "kit", "q23", 3.4, kx - 22, kz - 42, kx - 22, kz - 28),
  tr("k-r3-out", "kit", "q23", 3.6, kx - 44, kz - 16, kx - 52, kz - 16, kx - 52, kz + 36),
  tr("k-r4-out", "kit", "q23", 3.2, kx - 22, kz - 28, kx - 52, kz - 28, kx - 52, kz + 14),
  tr("k-r7", "kit", "q23", 3.0, kx - 22, kz - 42, kx + 12, kz - 42, kx + 12, kz - 18),
  tr("k-r7-st1", "kit", undefined, 2.4, kx + 12, kz - 18, kx + 4, kz - 18, kx + 4, kz + 38),
  tr("k-t3-t1", "kit", undefined, 1.6, kx - 18, kz - 12, kx - 18, kz - 42),
  tr("k-ic-t3", "kit", undefined, 1.2, kx - 6, kz + 2, kx - 18, kz + 2, kx - 18, kz - 12),
  tr("k-ic-p4", "kit", undefined, 1.0, kx - 6, kz + 2, kx - 6, kz + 28, kx + 8, kz + 28),
  tr("k-p4-p5", "kit", undefined, 1.0, kx + 8, kz + 28, kx - 12, kz + 28, kx - 32, kz + 28),
  tr("k-ic-led", "kit", undefined, 0.9, kx - 6, kz + 2, kx + 40, kz + 2, kx + 40, kz - 4),
  tr("k-d1", "kit", undefined, 1.6, kx - 48, kz + 14, kx - 52, kz + 14),
  tr("k-gnd", "kit", undefined, 3.2, kx - 70, kz + 42, kx + 70, kz + 42),
];

export const POURS: PcbPour[] = [
  { id: "p-hv", board: "main", heat: "br1", x: -48, z: 36, w: 42, d: 28 },
  { id: "p-gnd-pri", board: "main", x: -88, z: 68, w: 70, d: 10 },
  { id: "p-gnd-sec", board: "main", x: 70, z: 68, w: 90, d: 10 },
  { id: "p-p15", board: "main", heat: "d15", x: 32, z: -48, w: 22, d: 14 },
  { id: "p-p35", board: "main", heat: "d35", x: 34, z: 6, w: 24, d: 16 },
  { id: "p-kit-pwr", board: "kit", heat: "q23", x: kx - 34, z: kz - 36, w: 56, d: 22 },
  { id: "p-kit-c1", board: "kit", heat: "q23", x: kx + 22, z: kz - 8, w: 28, d: 26 },
];
