import {
  BRONZE_230,
  BRONZE_PLUS,
  ETA,
  systemEta,
  type LoadMap,
} from "./design";

export const BRONZE_ASOF = "17.08.2026";

export type EtaChain = {
  id: string;
  name: string;
  front: number;
  flyback: number;
  buck12: number;
  buck5: number;
  inv12: number;
  inv5: number;
  biasW: number;
  pf50: number;
};

/** Alter Stand: Sperrwandler vom 325-V-Elko, kein PFC, hoher Ruhestrom. */
export const CHAIN_OLD: EtaChain = {
  id: "old",
  name: "Vorher · Flyback 325 V",
  front: 0.99,
  flyback: 0.93,
  buck12: 0.94,
  buck5: 0.93,
  inv12: 0.91,
  inv5: 0.89,
  biasW: 0.7,
  pf50: 0.6,
};

/** Nach Mean Well RSP-320: CCM-PFC, QR-Flyback, Burst, synchrone Bucks. */
export const CHAIN_MW: EtaChain = {
  id: "mw",
  name: "Mean Well-Pfad",
  front: ETA.front,
  flyback: ETA.flyback,
  buck12: ETA.buck12,
  buck5: ETA.buck5,
  inv12: ETA.inv12,
  inv5: ETA.inv5,
  biasW: ETA.biasW,
  pf50: 0.98,
};

export function switchingAt(loadFrac: number, chain: EtaChain) {
  const p = loadFrac;
  const p12 = 12 * p;
  const p5 = 5 * p;
  const n12 = 12 * p;
  const n5 = 5 * p;
  const pout = p12 + p5 + n12 + n5;
  const psec =
    p12 / chain.buck12 + p5 / chain.buck5 + n12 / chain.inv12 + n5 / chain.inv5;
  const pdc = psec / chain.flyback;
  const pac = pdc / chain.front + chain.biasW;
  const eta = pout > 0 ? pout / pac : 0;
  return { pout, pac, eta, etaPct: eta * 100 };
}

export const LOAD_POINTS = [0.25, 0.5, 1] as const;

export function bronzeRows(chain: EtaChain) {
  return LOAD_POINTS.map((p) => {
    const sw = switchingAt(p, chain);
    const limit =
      p === 0.5 ? BRONZE_230.p50 : p === 1 ? BRONZE_230.p100 : BRONZE_PLUS.p25;
    const official =
      p === 0.5 ? BRONZE_230.p50 : p === 1 ? BRONZE_230.p100 : BRONZE_230.p20;
    return {
      p,
      name: `${Math.round(p * 100)} %`,
      etaPct: sw.etaPct,
      pout: sw.pout,
      pac: sw.pac,
      limitPct: limit * 100,
      officialPct: official * 100,
      plusOk: sw.eta >= BRONZE_PLUS.p25,
      bronzeOk: sw.eta + 1e-9 >= official,
      pf: p >= 0.5 ? chain.pf50 : Math.max(0.9, chain.pf50 - 0.06),
    };
  });
}

export function bronzePass(chain: EtaChain) {
  const rows = bronzeRows(chain);
  return rows.every((r) => r.plusOk) && chain.pf50 >= BRONZE_PLUS.pf50;
}

export function systemAt(
  p: number,
  labU: number,
  labI: number,
  usePrereg: boolean,
) {
  const L: LoadMap = { p12: p, n12: p, p5: p, n5: p, lab: p };
  return systemEta(L, labU, labI, usePrereg);
}

export const MW_TAKE = [
  {
    from: "FAN4800A (DIP-16 auf der RSP-320)",
    ours: "UCC28019A CCM-Boost + UC3843 QR",
    why: "cos φ ≥ 0,95. Bronze verlangt 0,90 bei 50 %. Der alte Flyback hatte 0,6.",
  },
  {
    from: "Zwei Ringkern-CMC (LF1/LF2) plus PFC-Drossel",
    ours: "WE-CMB + Boost-Drossel 400 µH / 1,5 A",
    why: "Weniger Kupferverlust als eine billige Stapeldrossel, EMV hält.",
  },
  {
    from: "100 µF / 400 V hinter dem PFC",
    ours: "C2 bleibt 120 µF / 400 V am 390-V-Bus",
    why: "Mean Well fährt den Elko bei 390 V, nicht bei 325 V ungeregelt.",
  },
  {
    from: "SR280C + STTH8S06, QR-PWM",
    ours: "MBR10100 / MBR20100, quasi-resonanter Sperrwandler",
    why: "Schaltverluste runter. Burst unter 30 % Last rettet die 25-%.",
  },
  {
    from: "Inrush-Relais neben der Klemmleiste",
    ours: "NTC + Relais, das den NTC nach 200 ms überbrückt",
    why: "Der NTC bleibt sonst warm und frisst 0,4–0,8 W dauernd.",
  },
  {
    from: "Frässchlitz unter dem Trafo (Unterseite)",
    ours: "bereits im Gerber, 3,2 mm / 8 mm Kriech",
    why: "Keine Änderung, nur bestätigt: Mean Well macht dasselbe.",
  },
] as const;
