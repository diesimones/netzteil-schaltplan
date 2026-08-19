import type { ReactNode } from "react";
import { labPower, thermal } from "@/lib/design";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export function ThermalView() {
  const labU = useStudio((s) => s.labU);
  const labI = useStudio((s) => s.labI);
  const setLab = useStudio((s) => s.setLab);
  const usePrereg = useStudio((s) => s.usePrereg);
  const setPrereg = useStudio((s) => s.setPrereg);
  const nQ = useStudio((s) => s.nQ);
  const setNq = useStudio((s) => s.setNq);
  const rthKA = useStudio((s) => s.rthKA);
  const setRth = useStudio((s) => s.setRth);
  const tAmb = useStudio((s) => s.tAmb);
  const setTamb = useStudio((s) => s.setTamb);

  const uIn = usePrereg ? labU + 3.5 : 35;
  const t = thermal({
    uIn,
    uOut: labU,
    i: labI,
    nQ,
    rthKA,
    rthJC: 1.1,
    rthCK: 0.2,
    tAmb,
  });
  const naive = labPower(labU, labI, false);
  const withPre = labPower(labU, labI, true);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          Pflichtaufgabe Kühlkörper
        </p>
        <h2 className="text-2xl font-medium tracking-tight">Thermische Auslegung</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Der Längsregler ist der Fallstrick der Prüfung. Die Conrad-Anleitung
          begrenzt den HB 533 auf 20 W. Bei 1 V / 3 A und 35-V-Bus entstehen
          102 W — das Fünffache. Die zwei BD249 sind schon parallel; es fehlt
          der Vorregler, nicht ein zweiter Transistor.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <Card
          title="Ohne Vorregler"
          value={`${naive.pLin.toFixed(1)} W`}
          hint={`ΔU = ${(35 - labU).toFixed(1)} V`}
          hot={naive.pLin > 40}
        />
        <Card
          title="Mit Vorregler"
          value={`${withPre.pLin.toFixed(1)} W`}
          hint={`ΔU ≈ ${withPre.uDrop.toFixed(1)} V`}
          hot={false}
        />
        <Card
          title="Sperrschicht Tj"
          value={`${t.tj.toFixed(0)} °C`}
          hint="Grenze 125 °C"
          hot={!t.ok}
        />
        <Card
          title="Je Transistor"
          value={`${t.pvEach.toFixed(1)} W`}
          hint={`${nQ} × BD249`}
          hot={t.pvEach > 25}
        />
      </div>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-medium">Arbeitspunkt</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setLab(1, 3);
                setPrereg(false);
              }}
              className="min-h-11 rounded-md bg-raised px-3 text-sm"
            >
              Worst Case 1 V / 3 A
            </button>
            <button
              type="button"
              onClick={() => setPrereg(!usePrereg)}
              className="min-h-11 rounded-md bg-raised px-3 text-sm"
            >
              Vorregler: {usePrereg ? "ein" : "aus"}
            </button>
          </div>
        </div>

        <Field label="Ausgangsspannung" value={`${labU.toFixed(1)} V`}>
          <Slider
            min={1}
            max={30}
            step={0.5}
            value={[labU]}
            onValueChange={([v]) => setLab(v ?? 1, labI)}
          />
        </Field>
        <Field label="Laststrom" value={`${labI.toFixed(2)} A`}>
          <Slider
            min={0}
            max={3}
            step={0.05}
            value={[labI]}
            onValueChange={([v]) => setLab(labU, v ?? 0)}
          />
        </Field>
        <Field label="Transistoren parallel" value={`${nQ}`}>
          <Slider
            min={1}
            max={4}
            step={1}
            value={[nQ]}
            onValueChange={([v]) => setNq(v ?? 1)}
          />
        </Field>
        <Field label="Rth Kühlkörper–Luft" value={`${rthKA.toFixed(2)} K/W`}>
          <Slider
            min={0.08}
            max={2}
            step={0.01}
            value={[rthKA]}
            onValueChange={([v]) => setRth(v ?? 0.45)}
          />
        </Field>
        <Field label="Gehäusetemperatur" value={`${tAmb.toFixed(0)} °C`}>
          <Slider
            min={25}
            max={60}
            step={1}
            value={[tAmb]}
            onValueChange={([v]) => setTamb(v ?? 45)}
          />
        </Field>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
        <h3 className="text-lg font-medium">Formel für die Dokumentation</h3>
        <p className="mt-3 font-mono text-sm leading-relaxed">
          Tj = Tu + Pv,je · (Rth,J-C + Rth,C-K) + Pv,ges · Rth,K-A
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {t.ok ? (
            <Badge tone="ok">Tj unter 125 °C — 1-Stunden-Test tragbar</Badge>
          ) : (
            <Badge tone="hot">Tj über 125 °C — Auslegung unzulässig</Badge>
          )}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Anleitung HB 533: Pv max. 20 W, Dauerkurzschluss nur mit 0,6 K/W.</li>
          <li>Worst Case der Prüfung: 1 V / 3 A, nicht 30 V → 102 W ohne Vorregler.</li>
          <li>Das Kit hat bereits zwei BD249 plus R3/R4 0,47 Ω. Parallelschalten ist erledigt.</li>
          <li>
            Vorregler auf Uout+3,5 V senkt Pv auf 10,5 W — unter der 20-W-Grenze.
          </li>
          <li>
            Weitere Wärme: Q1 ≈ 4 W, Schottkys ≈ 2 W, TPS5430 ≈ 1,3 W je Kanal.
          </li>
        </ul>
      </section>
    </div>
  );
}

function Card({
  title,
  value,
  hint,
  hot,
}: {
  title: string;
  value: string;
  hint: string;
  hot: boolean;
}) {
  return (
    <article className="rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="font-mono text-xs text-faint">{title}</p>
      <p className={`mt-1 font-mono text-2xl tabular-nums ${hot ? "text-hot" : "text-fg"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </article>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <label className="mt-5 block">
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-muted">{value}</span>
      </div>
      {children}
    </label>
  );
}
