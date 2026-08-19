export type Zone = "pri" | "iso" | "sec" | "lab" | "meter" | "mech";
export type SheetId = "pri" | "sec" | "rails" | "lab" | "meter";
export type ViewId = "auftrag" | "block" | "plan" | "pcb" | "fab" | "case" | "sim" | "sim3d" | "thermik" | "eta" | "bronze" | "bom" | "einkauf";

export type Part = {
  id: string;
  ref: string;
  name: string;
  value: string;
  maker: string;
  zone: Zone;
  sheet: SheetId;
  block: string;
  role: string;
  note?: string;
};

export const PROJECT = {
  title: "Multispannungs-Labornetzgerät",
  short: "IFT Meister Netzteil",
  code: "IFT-NT-2026",
  exam: "Meisterprüfung Informationstechniker",
  norm: "DIN EN 62368-1 / DIN EN 61000-6-3",
  vin: "230 V AC ±10 %, 50 Hz",
  topology: "Sperrwandler + DC-DC + Längsregler",
} as const;

export const RAILS = [
  { id: "p12", label: "+12 V", v: 12, i: 1, sign: 1, kind: "buck" as const },
  { id: "n12", label: "−12 V", v: 12, i: 1, sign: -1, kind: "inv" as const },
  { id: "p5", label: "+5 V", v: 5, i: 1, sign: 1, kind: "buck" as const },
  { id: "n5", label: "−5 V", v: 5, i: 1, sign: -1, kind: "inv" as const },
  { id: "lab", label: "1…30 V", v: 30, i: 3, sign: 1, kind: "linear" as const },
] as const;

export type RailId = (typeof RAILS)[number]["id"];

export const PARTS: Part[] = [
  {
    id: "x1",
    ref: "X1",
    name: "Kaltgerätebuchse mit PE",
    value: "IEC C14 / 10 A",
    maker: "Schurter 4301.1401",
    zone: "pri",
    sheet: "pri",
    block: "in",
    role: "Netzeingang, Schutzleiter an Gehäuse",
  },
  {
    id: "f1",
    ref: "F1",
    name: "Feinsicherung träge",
    value: "2,0 A T / 250 V",
    maker: "5×20 mm",
    zone: "pri",
    sheet: "pri",
    block: "in",
    role: "Primärschutz, träge wegen Elko-Ladestrom",
  },
  {
    id: "ntc1",
    ref: "NTC1",
    name: "Einschaltstrombegrenzer",
    value: "10 Ω",
    maker: "EPCOS B57237S0100M000",
    zone: "pri",
    sheet: "pri",
    block: "in",
    role: "Begrenzt den Stoßstrom von C2",
  },
  {
    id: "mov1",
    ref: "MOV1",
    name: "Varistor",
    value: "275 V AC",
    maker: "EPCOS S14K275",
    zone: "pri",
    sheet: "pri",
    block: "in",
    role: "Ableitung von Netztransienten",
  },
  {
    id: "c1",
    ref: "C1",
    name: "X2-Kondensator",
    value: "100 nF / 275 V AC",
    maker: "WIMA MKP-X2",
    zone: "pri",
    sheet: "pri",
    block: "emc",
    role: "Gegentakt-Entstörung",
  },
  {
    id: "cy1",
    ref: "CY1/CY2",
    name: "Y2-Kondensatoren",
    value: "2,2 nF / 250 V AC",
    maker: "WIMA MKP-Y2",
    zone: "pri",
    sheet: "pri",
    block: "emc",
    role: "Gleichtakt gegen PE, Sicherheitsklasse Y2",
  },
  {
    id: "l1",
    ref: "L1",
    name: "Gleichtaktdrossel",
    value: "2 × 10 mH",
    maker: "Würth WE-CMB",
    zone: "pri",
    sheet: "pri",
    block: "emc",
    role: "EMV DIN EN 61000-6-3",
  },
  {
    id: "br1",
    ref: "BR1",
    name: "Brückengleichrichter",
    value: "600 V / 4 A",
    maker: "GBU406",
    zone: "pri",
    sheet: "pri",
    block: "rect",
    role: "230 V~ → PFC-Zwischenkreis ~390 V",
  },
  {
    id: "pfc",
    ref: "IC9 / Qp / Lp",
    name: "Aktiver PFC (Mean Well)",
    value: "UCC28019A · CCM Boost",
    maker: "TI · wie FAN4800 auf RSP-320",
    zone: "pri",
    sheet: "pri",
    block: "pfc",
    role: "cos φ ≥ 0,95, 390 V-Bus, Pflicht für Bronze-PF 0,90 bei 50 %",
  },
  {
    id: "c2",
    ref: "C2",
    name: "Zwischenkreis-Elko",
    value: "120 µF / 400 V",
    maker: "Panasonic ED, 105 °C",
    zone: "pri",
    sheet: "pri",
    block: "rect",
    role: "Puffer, Hold-up, Low-ESR",
  },
  {
    id: "r1",
    ref: "R1",
    name: "Entladewiderstand",
    value: "100 kΩ / 2 W",
    maker: "Metalloxid",
    zone: "pri",
    sheet: "pri",
    block: "rect",
    role: "Entlädt C2 nach Netztrennung",
  },
  {
    id: "ic1",
    ref: "IC1",
    name: "Current-Mode PWM",
    value: "UC3843B",
    maker: "Texas Instruments",
    zone: "pri",
    sheet: "pri",
    block: "fly",
    role: "65–100 kHz, UVLO, Strombegrenzung",
  },
  {
    id: "q1",
    ref: "Q1",
    name: "Power-MOSFET",
    value: "600 V / 0,75 Ω",
    maker: "ST STP10NK60Z",
    zone: "pri",
    sheet: "pri",
    block: "fly",
    role: "Primärschalter, Kühlblech nötig",
  },
  {
    id: "rs",
    ref: "Rs",
    name: "Strommess-Shunt",
    value: "0,33 Ω / 2 W",
    maker: "Draht / Metallband",
    zone: "pri",
    sheet: "pri",
    block: "fly",
    role: "Peak-Current-Mode an Pin 3",
  },
  {
    id: "snub",
    ref: "RCD",
    name: "RCD-Snubber",
    value: "UF4007 + 100 kΩ/3 W + 2,2 nF/1 kV",
    maker: "Diskret",
    zone: "pri",
    sheet: "pri",
    block: "fly",
    role: "Begrenzt Streuinduktivitäts-Spitzen an Q1",
  },
  {
    id: "t1",
    ref: "T1",
    name: "HF-Sperrwandler-Trafo",
    value: "EFD30, TIW, 3 kVrms",
    maker: "Eigenwicklung / Musterkern",
    zone: "iso",
    sheet: "pri",
    block: "fly",
    role: "Galvanische Trennung SELV, Ns1/Ns2/Ns3 + Aux",
  },
  {
    id: "ok1",
    ref: "OK1",
    name: "Optokoppler",
    value: "5 kVrms",
    maker: "Lite-On LTV-817",
    zone: "iso",
    sheet: "pri",
    block: "fly",
    role: "Feedback über Isolationsbarriere",
  },
  {
    id: "u431",
    ref: "IC6",
    name: "Präzisionsreferenz",
    value: "2,495 V",
    maker: "TI TL431",
    zone: "sec",
    sheet: "sec",
    block: "fly",
    role: "Regelt +35-V-Bus als Führungsgröße",
  },
  {
    id: "d1",
    ref: "D1",
    name: "Schottky +15 V",
    value: "100 V / 10 A",
    maker: "MBR10100",
    zone: "sec",
    sheet: "sec",
    block: "bus",
    role: "Sekundärgleichrichtung, VF ≈ 0,6 V",
  },
  {
    id: "d2",
    ref: "D2",
    name: "Schottky −15 V",
    value: "100 V / 10 A",
    maker: "MBR10100",
    zone: "sec",
    sheet: "sec",
    block: "bus",
    role: "Negative Wicklung, gemeinsame Masse",
  },
  {
    id: "d3",
    ref: "D3",
    name: "Schottky +35 V",
    value: "100 V / 20 A",
    maker: "MBR20100CT",
    zone: "sec",
    sheet: "sec",
    block: "bus",
    role: "Labor-Zwischenkreis, Kühlung nötig",
  },
  {
    id: "c3",
    ref: "C3/C5/C7",
    name: "Sieb-Elkos",
    value: "1000…2200 µF Low-ESR",
    maker: "Panasonic FR",
    zone: "sec",
    sheet: "sec",
    block: "bus",
    role: "Restwelligkeit < 100 mVss nach LC",
  },
  {
    id: "ic2",
    ref: "IC2",
    name: "Buck +12 V",
    value: "TPS5430 / 500 kHz",
    maker: "Texas Instruments",
    zone: "sec",
    sheet: "rails",
    block: "p12",
    role: "η ≈ 92 %, L = 15 µH, Rtop = 88,7 kΩ",
  },
  {
    id: "ic4",
    ref: "IC4",
    name: "Buck +5 V",
    value: "TPS5430 / 500 kHz",
    maker: "Texas Instruments",
    zone: "sec",
    sheet: "rails",
    block: "p5",
    role: "η ≈ 90 %, Rtop = 30,9 kΩ",
  },
  {
    id: "ic3",
    ref: "IC3",
    name: "Inverting −12 V",
    value: "TPS5430 inverted",
    maker: "Texas Instruments",
    zone: "sec",
    sheet: "rails",
    block: "n12",
    role: "Buck-Boost, GND am negativen Ausgang",
  },
  {
    id: "ic5",
    ref: "IC5",
    name: "Inverting −5 V",
    value: "TPS5430 inverted",
    maker: "Texas Instruments",
    zone: "sec",
    sheet: "rails",
    block: "n5",
    role: "Wie IC3, Teiler auf −5 V",
  },
  {
    id: "q2",
    ref: "T1/T2",
    name: "Längstransistoren HB 533",
    value: "2 × BD249",
    maker: "ST / ON · Kit 11 66 61",
    zone: "lab",
    sheet: "lab",
    block: "lab",
    role: "Original-Endstufe des Conrad-Bausatzes, parallel über R3/R4",
  },
  {
    id: "re",
    ref: "R3/R4",
    name: "Emitter-Hochlast",
    value: "2 × 0,47 Ω / 5 W",
    maker: "Draht / Keramik · HB 533",
    zone: "lab",
    sheet: "lab",
    block: "lab",
    role: "Symmetrierung der beiden BD249, Originalwerte",
  },
  {
    id: "rcl",
    ref: "R7",
    name: "Strommess-Shunt HB 533",
    value: "0,15 Ω / 5 W",
    maker: "Draht · HB 533",
    zone: "lab",
    sheet: "lab",
    block: "lab",
    role: "Strombegrenzung 0…3 A an Pin 2/3 des LM723",
  },
  {
    id: "prereg",
    ref: "IC7",
    name: "Tracking-Vorregler",
    value: "TPS5430, Uout+3,5 V",
    maker: "Texas Instruments",
    zone: "lab",
    sheet: "lab",
    block: "lab",
    role: "Hält ΔU am Längsregler auf ca. 3,5 V, damit Pv ≤ 20 W",
  },
  {
    id: "ic8",
    ref: "IC1",
    name: "Spannungsregler HB 533",
    value: "LM723 / UA723",
    maker: "TI / ST · DIP-14",
    zone: "lab",
    sheet: "lab",
    block: "lab",
    role: "Regelkarte des Conrad-Bausatzes, 1,25…30 V, Stromgrenze",
  },
  {
    id: "t3",
    ref: "T3",
    name: "Treibertransistor",
    value: "BD136 PNP",
    maker: "ST · TO-126",
    zone: "lab",
    sheet: "lab",
    block: "lab",
    role: "Treiber für T1/T2, liegt flach auf der HB-533-Platine",
  },
  {
    id: "pot4",
    ref: "POT4/5/6",
    name: "Trimmer HB 533",
    value: "10 kΩ + 2 × 500 Ω",
    maker: "Conrad-Kit",
    zone: "lab",
    sheet: "lab",
    block: "lab",
    role: "POT4 grob, POT5 fein (Spannung), POT6 Strom 0…3 A",
  },
  {
    id: "c1k",
    ref: "C1",
    name: "Sieb-Elko HB 533",
    value: "4700 µF / 50 V",
    maker: "Kit",
    zone: "lab",
    sheet: "lab",
    block: "lab",
    role: "Original-Elko. Bei DC-Einspeisung über Vorregler entlastet.",
  },
  {
    id: "hs",
    ref: "K1",
    name: "Kühlkörper + Lüfter",
    value: "SK 85 + 12 V / Klixon · 0,45 K/W",
    maker: "Fischer Elektronik",
    zone: "mech",
    sheet: "lab",
    block: "lab",
    role: "Ersetzt den Kit-Kühlkörper. Anleitung fordert 0,6 K/W für Dauerkurzschluss.",
  },
  {
    id: "klx",
    ref: "Sth",
    name: "Klixon Thermoschalter",
    value: "ein 58 °C / aus 46 °C",
    maker: "Bimetall auf K1",
    zone: "mech",
    sheet: "lab",
    block: "lab",
    role: "Sitzt auf dem Kühlkörper. Schaltet den 12-V-Lüfter mit Hysterese, kein PWM.",
  },
  {
    id: "sh12",
    ref: "Rsh",
    name: "Mess-Shunts",
    value: "10 mΩ / 1 W / 1 %",
    maker: "Isabellenhütte o. ä.",
    zone: "meter",
    sheet: "meter",
    block: "meter",
    role: "In der Rückleitung, Sense an der Buchse",
  },
  {
    id: "disp",
    ref: "M1–M5",
    name: "Panelmeter",
    value: "0–100 V / 0–10 A",
    maker: "DSN-VC288",
    zone: "meter",
    sheet: "meter",
    block: "meter",
    role: "Ein Dual-Display je Kanal",
  },
];

export const BLOCKS = [
  {
    id: "in",
    title: "Netzeingang & Schutz",
    zone: "pri" as Zone,
    parts: ["x1", "f1", "ntc1", "mov1"],
    out: "230 V AC",
    detail: "Kaltgerätebuchse, PE am Gehäuse, träge 2-A-Sicherung, NTC, Varistor.",
  },
  {
    id: "emc",
    title: "EMV-Netzfilter",
    zone: "pri" as Zone,
    parts: ["l1", "c1", "cy1"],
    out: "230 V AC gefiltert",
    detail: "WE-CMB 2×10 mH, X2 und Y2. Pflicht für DIN EN 61000-6-3.",
  },
  {
    id: "rect",
    title: "Gleichrichtung + PFC",
    zone: "pri" as Zone,
    parts: ["br1", "c2", "r1", "pfc"],
    out: "≈ 390 V DC",
    detail: "GBU406, CCM-Boost wie Mean Well RSP-320 (FAN4800). Bus 390 V.",
  },
  {
    id: "fly",
    title: "Sperrwandler",
    zone: "iso" as Zone,
    parts: ["ic1", "q1", "rs", "snub", "t1", "ok1", "u431"],
    out: "HF, galvanisch getrennt",
    detail: "UC3843B + STP10NK60Z, EFD30, Optokoppler + TL431. 65–100 kHz.",
  },
  {
    id: "bus",
    title: "Sekundärbusse",
    zone: "sec" as Zone,
    parts: ["d1", "d2", "d3", "c3"],
    out: "+15 V / −15 V / +35 V",
    detail: "Schottky + LC. Drei getrennte Wicklungen, gemeinsame SELV-Masse.",
  },
  {
    id: "p12",
    title: "+12 V / 1 A",
    zone: "sec" as Zone,
    parts: ["ic2"],
    out: "+12,0 V",
    detail: "TPS5430 Buck aus +15 V. η ≈ 92 %.",
  },
  {
    id: "p5",
    title: "+5 V / 1 A",
    zone: "sec" as Zone,
    parts: ["ic4"],
    out: "+5,0 V",
    detail: "TPS5430 Buck aus +15 V. η ≈ 90 %.",
  },
  {
    id: "n12",
    title: "−12 V / 1 A",
    zone: "sec" as Zone,
    parts: ["ic3"],
    out: "−12,0 V",
    detail: "TPS5430 inverting aus +15 V. η ≈ 88 %.",
  },
  {
    id: "n5",
    title: "−5 V / 1 A",
    zone: "sec" as Zone,
    parts: ["ic5"],
    out: "−5,0 V",
    detail: "TPS5430 inverting aus +15 V. η ≈ 86 %.",
  },
  {
    id: "lab",
    title: "Universal 1…30 V / 3 A",
    zone: "lab" as Zone,
    parts: ["prereg", "ic8", "t3", "q2", "re", "rcl", "pot4", "c1k", "hs"],
    out: "1–30 V, sauber",
    detail: "H-Tronic HB 533 (LM723, 2× BD249, 20 W-Grenze) plus Tracking-Vorregler.",
  },
  {
    id: "meter",
    title: "Anzeige & Buchsen",
    zone: "meter" as Zone,
    parts: ["sh12", "disp"],
    out: "5 Kanäle V/A",
    detail: "Shunt in der Rückleitung, Sense an der Buchse, fünf DSN-VC288.",
  },
] as const;

export const SHEETS: { id: SheetId; no: string; title: string }[] = [
  { id: "pri", no: "01", title: "Primärseite & Sperrwandler" },
  { id: "sec", no: "02", title: "Sekundärbusse +15 / −15 / +35 V" },
  { id: "rails", no: "03", title: "Festspannungen TPS5430" },
  { id: "lab", no: "04", title: "Universal-Längsregler" },
  { id: "meter", no: "05", title: "Messtechnik & Buchsen" },
];

export const CONRAD = {
  name: "Universal-Netzgerät 1…30 V / 0…3 A",
  maker: "H-Tronic / Conrad",
  skuKit: "11 66 61",
  skuModule: "11 67 18",
  pcb: "152 × 94 mm",
  vinAc: "max. 30 V AC · Nenntrafo 25 V AC / 3 A",
  vout: "1,25…30 V DC",
  iout: "0…3 A, einstellbar",
  ripple: "< 2 mV",
  loadReg: "< 50 mV bei 0–100 % Last",
  pvMax: 20,
  sc: "kurzzeitig ca. 2 min",
  rthNeed: 0.6,
  fuse: "F 4 A",
  formula: "Uaus = (Uein × 1,4) − 4 V",
  ic: "LM723 / UA723",
  pass: "2 × BD249",
  driver: "BD136",
  sense: "R7 = 0,15 Ω / 5 W",
  ballast: "R3/R4 = 0,47 Ω / 5 W",
  pots: "POT4 10 kΩ, POT5 500 Ω, POT6 500 Ω",
  elko: "C1 4700 µF / 50 V",
  bridge: "B40C5000/3300",
  diode: "1N5401",
  ambient: "0…40 °C",
} as const;

export const BRONZE_230 = { p20: 0.81, p50: 0.85, p100: 0.81 };
export const BRONZE_115 = { p20: 0.82, p50: 0.85, p100: 0.82 };
/** Prüfungs-Bronze+: ≥ 80 % bei 25 / 50 / 100 % Last, 230 V. */
export const BRONZE_PLUS = { p25: 0.8, p50: 0.8, p100: 0.8, pf50: 0.9 };

export const ETA = {
  front: 0.97,
  flyback: 0.95,
  buck12: 0.96,
  buck5: 0.955,
  inv12: 0.935,
  inv5: 0.925,
  prereg: 0.94,
  linearDrop: 3.2,
  biasW: 0.32,
};

export type LoadMap = Record<RailId, number>;

export function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export function switchingPower(load: LoadMap) {
  const p12 = 12 * load.p12;
  const p5 = 5 * load.p5;
  const n12 = 12 * load.n12;
  const n5 = 5 * load.n5;
  const pout = p12 + p5 + n12 + n5;
  const psec =
    p12 / ETA.buck12 + p5 / ETA.buck5 + n12 / ETA.inv12 + n5 / ETA.inv5;
  const pdc = psec / ETA.flyback;
  const pac = pdc / ETA.front + ETA.biasW;
  const eta = pout > 0 ? pout / pac : 0;
  return { pout, psec, pdc, pac, eta, etaPct: eta * 100 };
}

export function labPower(uOut: number, iOut: number, usePrereg: boolean) {
  const uBus = 35;
  const u = clamp(uOut, 1, 30);
  const i = clamp(iOut, 0, 3);
  const pout = u * i;
  if (i === 0) {
    return { pout: 0, pLin: 0, pPre: 0, pBus: 0, pac: 0, eta: 0, uDrop: 0 };
  }
  if (usePrereg) {
    const uPre = Math.min(uBus - 0.5, u + ETA.linearDrop);
    const pLin = Math.max(0, (uPre - u) * i);
    const pPreOut = uPre * i;
    const pBus = pPreOut / ETA.prereg;
    const pac = pBus / ETA.flyback / ETA.front;
    return {
      pout,
      pLin,
      pPre: pBus - pPreOut,
      pBus,
      pac,
      eta: pout / pac,
      uDrop: uPre - u,
    };
  }
  const pLin = Math.max(0, (uBus - u) * i);
  const pBus = pout + pLin;
  const pac = pBus / ETA.flyback / ETA.front;
  return { pout, pLin, pPre: 0, pBus, pac, eta: pout / pac, uDrop: uBus - u };
}

export function systemEta(
  load: LoadMap,
  labU: number,
  labI: number,
  usePrereg: boolean,
) {
  const sw = switchingPower(load);
  const lab = labPower(labU, labI * load.lab, usePrereg);
  const pout = sw.pout + lab.pout;
  const pac = sw.pac + lab.pac;
  const eta = pout > 0 ? pout / pac : 0;
  return { pout, pac, eta, etaPct: eta * 100, sw, lab };
}

export type ThermalInput = {
  uIn: number;
  uOut: number;
  i: number;
  nQ: number;
  rthKA: number;
  rthJC: number;
  rthCK: number;
  tAmb: number;
};

export function thermal(t: ThermalInput) {
  const pv = Math.max(0, (t.uIn - t.uOut) * t.i);
  const n = Math.max(1, t.nQ);
  const pvEach = pv / n;
  const tj = t.tAmb + pvEach * (t.rthJC + t.rthCK) + pv * t.rthKA;
  const rthNeed =
    pv > 0 ? (125 - t.tAmb) / pv - (t.rthJC + t.rthCK) / n : Infinity;
  return { pv, pvEach, tj, rthNeed, ok: tj <= 125 };
}

export function partById(id: string) {
  return PARTS.find((p) => p.id === id);
}

export function partsForBlock(blockId: string) {
  return PARTS.filter((p) => p.block === blockId);
}

export const HEAT_IDS = [
  "br1",
  "q1",
  "t1",
  "d15",
  "d35",
  "buck",
  "inv",
  "ic7",
  "q23",
  "hs",
] as const;

export type HeatId = (typeof HEAT_IDS)[number];

export type HeatNode = {
  id: HeatId;
  ref: string;
  name: string;
  part: string;
  pW: number;
  tEq: number;
  tLimit: number;
  tau: number;
};

export type RailLive = {
  id: RailId;
  label: string;
  v: number;
  i: number;
  p: number;
};

export type OpInputs = {
  load: LoadMap;
  labU: number;
  labI: number;
  usePrereg: boolean;
  nQ: number;
  rthKA: number;
  tAmb: number;
};

export type Operating = {
  iAc: number;
  pf: number;
  uDc: number;
  iDc: number;
  iBus15: number;
  iBus35: number;
  rails: RailLive[];
  labV: number;
  labI: number;
  sw: ReturnType<typeof switchingPower>;
  lab: ReturnType<typeof labPower>;
  sys: ReturnType<typeof systemEta>;
  heat: HeatNode[];
};

export const FAN_ON = 58;
export const FAN_OFF = 46;
export const FAN_RTH = 0.22;
export const PF_FLYBACK = 0.98;

export function operatingPoint(inp: OpInputs): Operating {
  const sw = switchingPower(inp.load);
  const labI = inp.labI * inp.load.lab;
  const lab = labPower(inp.labU, labI, inp.usePrereg);
  const sys = systemEta(inp.load, inp.labU, inp.labI, inp.usePrereg);

  const iAc = sys.pac > 0 ? sys.pac / (230 * PF_FLYBACK) : 0;
  const uDc = 390;
  const iDc = sw.pdc / uDc;
  const iBus15 = sw.psec / 15;
  const iBus35 = lab.pBus > 0 ? lab.pBus / 35 : 0;

  const rails: RailLive[] = RAILS.map((r) => {
    if (r.id === "lab") {
      return {
        id: r.id,
        label: r.label,
        v: inp.labU,
        i: labI,
        p: lab.pout,
      };
    }
    const i = r.i * inp.load[r.id];
    return { id: r.id, label: r.label, v: r.v * r.sign, i, p: r.v * i };
  });

  const uInLin = inp.usePrereg ? inp.labU + ETA.linearDrop : 35;
  const th = thermal({
    uIn: uInLin,
    uOut: inp.labU,
    i: labI,
    nQ: inp.nQ,
    rthKA: inp.rthKA,
    rthJC: 1.1,
    rthCK: 0.2,
    tAmb: inp.tAmb,
  });

  const pBuck =
    (12 * inp.load.p12) * (1 / ETA.buck12 - 1) +
    (5 * inp.load.p5) * (1 / ETA.buck5 - 1);
  const pInv =
    (12 * inp.load.n12) * (1 / ETA.inv12 - 1) +
    (5 * inp.load.n5) * (1 / ETA.inv5 - 1);

  const teq = (pW: number, rth: number) => inp.tAmb + Math.max(0, pW) * rth;

  const heat: HeatNode[] = [
    {
      id: "br1",
      ref: "BR1",
      name: "Brückengleichrichter",
      part: "br1",
      pW: 1.8 * iDc,
      tEq: teq(1.8 * iDc, 12),
      tLimit: 150,
      tau: 18,
    },
    {
      id: "q1",
      ref: "Q1",
      name: "Sperrwandler-MOSFET",
      part: "q1",
      pW: 0.034 * sw.pdc + 0.35,
      tEq: teq(0.034 * sw.pdc + 0.35, 7),
      tLimit: 150,
      tau: 8,
    },
    {
      id: "t1",
      ref: "T1",
      name: "HF-Trafo EFD30",
      part: "t1",
      pW: 0.026 * sw.pdc + 0.25,
      tEq: teq(0.026 * sw.pdc + 0.25, 9),
      tLimit: 100,
      tau: 55,
    },
    {
      id: "d15",
      ref: "D1/D2",
      name: "Schottky ±15 V",
      part: "d1",
      pW: 0.55 * iBus15,
      tEq: teq(0.55 * iBus15, 14),
      tLimit: 125,
      tau: 12,
    },
    {
      id: "d35",
      ref: "D3",
      name: "Schottky +35 V",
      part: "d3",
      pW: 0.55 * iBus35,
      tEq: teq(0.55 * iBus35, 8),
      tLimit: 125,
      tau: 14,
    },
    {
      id: "buck",
      ref: "IC2/IC4",
      name: "Buck +12 / +5",
      part: "ic2",
      pW: pBuck,
      tEq: teq(pBuck, 18),
      tLimit: 125,
      tau: 7,
    },
    {
      id: "inv",
      ref: "IC3/IC5",
      name: "Inverter −12 / −5",
      part: "ic3",
      pW: pInv,
      tEq: teq(pInv, 18),
      tLimit: 125,
      tau: 7,
    },
    {
      id: "ic7",
      ref: "IC7",
      name: "Tracking-Vorregler",
      part: "prereg",
      pW: lab.pPre,
      tEq: teq(lab.pPre, 16),
      tLimit: 125,
      tau: 7,
    },
    {
      id: "q23",
      ref: "T1/T2",
      name: "BD249 Längsregler",
      part: "q2",
      pW: lab.pLin,
      tEq: th.tj,
      tLimit: 125,
      tau: 11,
    },
    {
      id: "hs",
      ref: "K1",
      name: "Kühlkörper",
      part: "hs",
      pW: lab.pLin,
      tEq: teq(lab.pLin, inp.rthKA),
      tLimit: 90,
      tau: 85,
    },
  ];

  return {
    iAc,
    pf: PF_FLYBACK,
    uDc,
    iDc,
    iBus15,
    iBus35,
    rails,
    labV: inp.labU,
    labI,
    sw,
    lab,
    sys,
    heat,
  };
}

export type SimSample = { t: number; q23: number; hs: number; q1: number };

export type SimState = {
  t: number;
  fan: boolean;
  temps: Record<HeatId, number>;
  history: SimSample[];
};

export function coldSim(tAmb: number): SimState {
  const temps = {} as Record<HeatId, number>;
  for (const id of HEAT_IDS) temps[id] = tAmb;
  return { t: 0, fan: false, temps, history: [{ t: 0, q23: tAmb, hs: tAmb, q1: tAmb }] };
}

export function fanFromHs(hs: number, wasOn: boolean) {
  if (hs >= FAN_ON) return true;
  if (hs <= FAN_OFF) return false;
  return wasOn;
}

export function stepSim(state: SimState, dt: number, inp: OpInputs): SimState {
  const fan = fanFromHs(state.temps.hs, state.fan);
  const rthKA = fan ? Math.min(inp.rthKA, FAN_RTH) : inp.rthKA;
  const op = operatingPoint({ ...inp, rthKA });
  const temps = { ...state.temps };
  for (const n of op.heat) {
    const prev = temps[n.id] ?? inp.tAmb;
    temps[n.id] = n.tEq + (prev - n.tEq) * Math.exp(-dt / Math.max(0.2, n.tau));
  }
  const t = state.t + dt;
  let history = state.history;
  const last = history[history.length - 1];
  if (!last || t - last.t >= 0.45) {
    history = [
      ...history,
      { t, q23: temps.q23, hs: temps.hs, q1: temps.q1 },
    ].slice(-110);
  }
  return { t, fan, temps, history };
}

export const NORMS = [
  {
    id: "62368",
    title: "DIN EN 62368-1",
    text: "Produktsicherheit. 8 mm Kriech-/Luftstrecke Primär–SELV, Fräsnut unter T1 und OK1, IP20, Schutzklasse I.",
  },
  {
    id: "61000",
    title: "DIN EN 61000-6-3 / 6-1",
    text: "EMV Wohnbereich. Netzfilter, Y2/X2, geschirmtes Metallgehäuse, Ausgangs-LC < 100 mVss.",
  },
  {
    id: "50678",
    title: "DIN EN 50678 / VDE 0701-0702",
    text: "Schutzleiter < 0,3 Ω, Isolation > 1 MΩ, Ersatzableitstrom vor Inbetriebnahme.",
  },
  {
    id: "selvs",
    title: "SELV / PELV",
    text: "Alle Laborbuchsen Schutzkleinspannung. PE nur am Gehäuse, nicht auf den Analogausgang zwingen.",
  },
];
