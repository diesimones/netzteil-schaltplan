import { CONRAD, NORMS, PROJECT } from "@/lib/design";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SPECS = [
  { k: "Eingang", v: "230 V AC ±10 %, 50 Hz, Schutzklasse I" },
  { k: "Festspannungen", v: "+12 V, −12 V, +5 V, −5 V, je 1 A" },
  { k: "Universal", v: "H-Tronic HB 533 · 1,25…30 V / 0…3 A, Pv ≤ 20 W" },
  { k: "Wirkungsgrad", v: "Bronze+ ≥ 80 % bei 25/50/100 %, PF ≥ 0,90" },
  { k: "Restwelligkeit", v: "< 100 mVss Schaltausgänge, < 20 mVss Analog" },
  { k: "Anzeigen", v: "Volt- und Amperemeter an allen 5 Kanälen" },
  { k: "Topologie", v: "CCM-PFC + QR-Sperrwandler + TPS5430 + Längsregler" },
  { k: "Prüfung", v: "1-h-Volllast, Kurzschluss, VDE 0701-0702" },
];

export function AuftragView() {
  const setView = useStudio((s) => s.setView);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Situationsaufgabe</Badge>
          <Badge tone="ok">80 PLUS Bronze</Badge>
          <Badge tone="pri">SELV nach 62368-1</Badge>
        </div>
        <h2 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
          Hybrid-Labornetzteil für die Meisterprüfung
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
          Eigenentwickeltes Multispannungs-Schaltnetzteil mit vier Festspannungen
          und integriertem Universalmodul 1…30 V / 3 A. Die Festschienen laufen
          über einen Sperrwandler und TPS5430-Wandler, damit der
          Bronze-Wirkungsgrad hält. Der Conrad-Bausatz {CONRAD.skuKit} (H-Tronic
          HB 533, {CONRAD.ic}, {CONRAD.pass}) bleibt die Analogstufe — laut
          Anleitung max. {CONRAD.pvMax} W Verlust. Deshalb Tracking-Vorregler,
          nicht weil die zwei BD249 fehlen.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => setView("block")}>Blockschaltbild</Button>
          <Button variant="outline" onClick={() => setView("pcb")}>
            Platine drehen
          </Button>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {SPECS.map((s) => (
          <article
            key={s.k}
            className="rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]"
          >
            <p className="font-mono text-xs tracking-wide text-faint uppercase">
              {s.k}
            </p>
            <p className="mt-1 text-sm leading-snug">{s.v}</p>
          </article>
        ))}
      </div>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
        <h3 className="text-lg font-medium">Normen, die die Zeichnung tragen</h3>
        <ul className="mt-4 space-y-4">
          {NORMS.map((n) => (
            <li key={n.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
              <p className="font-mono text-xs text-muted">{n.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{n.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-xs text-faint">{PROJECT.norm}</p>
      </section>
    </div>
  );
}
