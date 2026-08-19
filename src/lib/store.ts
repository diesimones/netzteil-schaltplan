import { create } from "zustand";
import type { LoadMap, RailId, SheetId, ViewId } from "./design";

export type Store = {
  view: ViewId;
  sheet: SheetId;
  selected: string | null;
  labU: number;
  labI: number;
  usePrereg: boolean;
  nQ: number;
  rthKA: number;
  tAmb: number;
  load: LoadMap;
  setView: (v: ViewId) => void;
  setSheet: (s: SheetId) => void;
  select: (id: string | null) => void;
  setLab: (u: number, i: number) => void;
  setLoad: (id: RailId, v: number) => void;
  setAllLoad: (v: number) => void;
  setPrereg: (on: boolean) => void;
  setNq: (n: number) => void;
  setRth: (r: number) => void;
  setTamb: (t: number) => void;
};

const full: LoadMap = { p12: 1, n12: 1, p5: 1, n5: 1, lab: 1 };

export const useStudio = create<Store>((set) => ({
  view: "auftrag",
  sheet: "pri",
  selected: null,
  labU: 12,
  labI: 2,
  usePrereg: true,
  nQ: 2,
  rthKA: 0.45,
  tAmb: 45,
  load: full,
  setView: (view) => set({ view }),
  setSheet: (sheet) => set({ sheet }),
  select: (selected) => set({ selected }),
  setLab: (labU, labI) => set({ labU, labI }),
  setLoad: (id, v) =>
    set((s) => ({ load: { ...s.load, [id]: Math.min(1, Math.max(0, v)) } })),
  setAllLoad: (v) =>
    set({
      load: { p12: v, n12: v, p5: v, n5: v, lab: v },
    }),
  setPrereg: (usePrereg) => set({ usePrereg }),
  setNq: (nQ) => set({ nQ }),
  setRth: (rthKA) => set({ rthKA }),
  setTamb: (tAmb) => set({ tAmb }),
}));
