import { lazy, Suspense, useEffect, useState } from "react";
import { CONRAD } from "@/lib/design";
import { PCB_PARTS, pcbById } from "@/lib/pcb";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const PcbStage = lazy(() => import("./pcb/PcbStage"));

const ALIAS: Record<string, string> = {
  q3: "q2",
  re2: "re",
  fan: "hs",
  klx: "klx",
  st1: "disp",
  st2: "ic8",
  st3: "ic8",
  fk: "ic8",
  brk: "ic8",
  d1k: "ic8",
  led1: "ic8",
  l2: "ic2",
  l4: "ic4",
  l3: "ic3",
  l5: "ic5",
  l8: "prereg",
  c8: "prereg",
};

export function PcbView() {
  const selected = useStudio((s) => s.selected);
  const select = useStudio((s) => s.select);
  const [hovered, setHovered] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const hoverPart = hovered ? pcbById(hovered) : null;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Bestückung · 3D
          </p>
          <h2 className="text-2xl font-medium tracking-tight">Fertige Leiterplatte</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="pri">Primär 230 V</Badge>
          <Badge tone="selv">SELV</Badge>
          <Badge tone="warn">HB 533 {CONRAD.skuKit}</Badge>
          <button
            type="button"
            className="h-8 rounded-md bg-raised px-3 text-xs"
            onClick={() => select("klx")}
          >
            Klixon zeigen
          </button>
        </div>
      </header>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        Hauptplatine mit Sperrwandler und Festspannungen, darauf die vorbestückte
        Conrad-Karte {CONRAD.maker} {CONRAD.pcb}. Kupferbahnen folgen den
        Leistungs- und Signalfaden. Ziehen zum Drehen — über einem Bauteil
        erscheinen Referenz und Wert.
      </p>

      <div className="relative h-[420px] overflow-hidden rounded-xl bg-bg shadow-[var(--shadow-border)] md:h-[560px]">
        {ready ? (
          <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted">Platine wird geladen…</div>}>
            <PcbStage
              mode="inspect"
              selected={selected}
              hovered={hovered}
              onHover={setHovered}
              onSelect={(id) => select(id ? (ALIAS[id] ?? id) : null)}
            />
          </Suspense>
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">Platine wird geladen…</div>
        )}
        {hoverPart && (
          <div className="pointer-events-none absolute top-3 left-3 max-w-xs rounded-lg bg-ink/90 px-3 py-2 text-paper shadow-[var(--shadow-border)]">
            <p className="font-mono text-xs tracking-wide text-paper/70">{hoverPart.ref}</p>
            <p className="text-sm font-medium">{hoverPart.name}</p>
            <p className="font-mono text-xs text-paper/80">{hoverPart.value}</p>
          </div>
        )}
        <p className="pointer-events-none absolute right-3 bottom-3 font-mono text-xs text-faint">
          {PCB_PARTS.length} Bauteile · Kupferbahnen sichtbar
        </p>
      </div>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
        <h3 className="text-lg font-medium">H-Tronic HB 533 · Conrad {CONRAD.skuKit}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Originalkarte bleibt die Analog-Regelung. Trafo, Brücke BR1 und F 4 A
          des Bausatzes werden nicht am Netz betrieben — die Karte bekommt DC
          vom Tracking-Vorregler. So gilt die Kit-Formel nicht mehr als Grenze,
          aber die <strong className="font-medium text-fg">{CONRAD.pvMax} W
          Verlustleistung</strong> aus der Anleitung schon.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Fact k="Ausgang Kit" v={`${CONRAD.vout} / ${CONRAD.iout}`} />
          <Fact k="Restwelligkeit" v={CONRAD.ripple} />
          <Fact k="Pv max. Anleitung" v={`${CONRAD.pvMax} W`} />
          <Fact k="IC" v={CONRAD.ic} />
          <Fact k="Endstufe" v={CONRAD.pass} />
          <Fact k="Treiber" v={CONRAD.driver} />
          <Fact k="Shunt R7" v={CONRAD.sense} />
          <Fact k="Ballast R3/R4" v={CONRAD.ballast} />
          <Fact k="Potis" v={CONRAD.pots} />
          <Fact k="Elko C1" v={CONRAD.elko} />
          <Fact k="Kühlung Dauerkurzschluss" v={`${CONRAD.rthNeed} K/W (Anleitung S. 10)`} />
          <Fact k="Umgebung" v={CONRAD.ambient} />
        </dl>
      </section>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-xs text-faint">{k}</dt>
      <dd className="mt-0.5 text-sm">{v}</dd>
    </div>
  );
}
