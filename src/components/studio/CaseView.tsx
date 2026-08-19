import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Download, Pause, Play, RotateCcw } from "lucide-react";
import {
  FAN_RTH,
  RAILS,
  coldSim,
  operatingPoint,
  stepSim,
  type HeatId,
  type OpInputs,
  type RailId,
  type SimState,
} from "@/lib/design";
import {
  CASE,
  auditEnclosure,
  buildBlechZip,
  buildPrintZip,
  caseInner,
  coldCase,
  fitCheck,
  stepCase,
  type CaseTemps,
} from "@/lib/enclosure";
import { downloadBlob } from "@/lib/gerber";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const CaseStage = lazy(() => import("./enclosure/CaseStage"));

export function CaseView() {
  const load = useStudio((s) => s.load);
  const setLoad = useStudio((s) => s.setLoad);
  const labU = useStudio((s) => s.labU);
  const labI = useStudio((s) => s.labI);
  const setLab = useStudio((s) => s.setLab);
  const usePrereg = useStudio((s) => s.usePrereg);
  const nQ = useStudio((s) => s.nQ);
  const rthKA = useStudio((s) => s.rthKA);
  const tAmb = useStudio((s) => s.tAmb);

  const inp: OpInputs = { load, labU, labI, usePrereg, nQ, rthKA, tAmb };
  const inpRef = useRef(inp);
  inpRef.current = inp;

  const [ready, setReady] = useState(false);
  const [lidOpen, setLidOpen] = useState(true);
  const [explode, setExplode] = useState(false);
  const [heatMode, setHeatMode] = useState(true);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<1 | 10 | 60>(10);
  const [sim, setSim] = useState<SimState>(() => coldSim(tAmb));
  const [caseT, setCaseT] = useState<CaseTemps>(() => coldCase(tAmb));
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000) * speed;
      last = now;
      if (dt > 0) {
        setSim((s) => {
          const next = stepSim(s, dt, inpRef.current);
          const fanR = next.fan ? Math.min(inpRef.current.rthKA, FAN_RTH) : inpRef.current.rthKA;
          const opNow = operatingPoint({ ...inpRef.current, rthKA: fanR });
          const pLoss = Math.max(0, opNow.sys.pac - opNow.sys.pout);
          setCaseT((c) =>
            stepCase(c, dt, next.temps.hs ?? inpRef.current.tAmb, inpRef.current.tAmb, pLoss, next.fan),
          );
          return next;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, speed]);

  const fanRth = sim.fan ? Math.min(rthKA, FAN_RTH) : rthKA;
  const op = operatingPoint({ ...inp, rthKA: fanRth });
  const fit = fitCheck();
  const inn = caseInner();
  const audit = auditEnclosure();
  const auditOk = audit.every((a) => a.ok);

  function applyLoad(frac: number) {
    RAILS.forEach((r) => setLoad(r.id as RailId, frac));
    if (frac >= 0.99) setLab(12, 3);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Gehäuse · EMV · Schutzklasse I
          </p>
          <h2 className="text-2xl font-medium tracking-tight">Gehäuse</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={fit.ok ? "ok" : "hot"}>{fit.ok ? "Platine passt" : "Passung fehlt"}</Badge>
          <Badge tone={auditOk ? "ok" : "hot"}>{auditOk ? "Dateien Rev. D" : "Dateien prüfen"}</Badge>
          <Badge tone="pri">{CASE.ip}</Badge>
          <Badge tone="ok">PE unter {CASE.peOhm} Ω</Badge>
          <Badge tone={sim.fan ? "warn" : "neutral"}>Lüfter {sim.fan ? "ein" : "aus"}</Badge>
        </div>
      </header>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        Aufgabenstellung Punkt 5: EMV-gerechtes Gehäuse, Kühlung, Anzeigen an
        jeder Spannung, Material und Montage dokumentiert. Schutzklasse I, IP20,
        PE unter {CASE.peOhm} Ω. Platine {CASE.boardW} × {CASE.boardD} mm in{" "}
        {CASE.outerW} × {CASE.outerD} × {CASE.outerH} mm.
      </p>

      <section className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setRunning((v) => !v)} className="min-h-11">
          {running ? <Pause /> : <Play />}
          {running ? "Halten" : "Wärme"}
        </Button>
        <Button
          variant="outline"
          className="min-h-11"
          onClick={() => {
            setSim(coldSim(tAmb));
            setCaseT(coldCase(tAmb));
            setRunning(false);
          }}
        >
          <RotateCcw />
          Kalt
        </Button>
        <div className="flex overflow-hidden rounded-md shadow-[var(--shadow-border)]">
          {([1, 10, 60] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn("min-h-11 px-3 font-mono text-sm", speed === s ? "bg-accent text-accent-fg" : "bg-raised text-muted")}
            >
              {s}×
            </button>
          ))}
        </div>
        <button type="button" className="min-h-11 rounded-md bg-raised px-3 text-sm" onClick={() => setLidOpen((v) => !v)}>
          Deckel {lidOpen ? "offen" : "zu"}
        </button>
        <button type="button" className="min-h-11 rounded-md bg-raised px-3 text-sm" onClick={() => setExplode((v) => !v)}>
          {explode ? "Zusammen" : "Explosiv"}
        </button>
        <button type="button" className="min-h-11 rounded-md bg-raised px-3 text-sm" onClick={() => setHeatMode((v) => !v)}>
          Wärme {heatMode ? "an" : "aus"}
        </button>
        {([0.25, 0.5, 1] as const).map((f) => (
          <button
            key={f}
            type="button"
            className="min-h-11 rounded-md bg-raised px-3 text-sm"
            onClick={() => applyLoad(f)}
          >
            {Math.round(f * 100)} % Last
          </button>
        ))}
        <button
          type="button"
          className="min-h-11 rounded-md bg-raised px-3 text-sm"
          onClick={() => {
            applyLoad(1);
            setLab(1, 3);
          }}
        >
          Worst Case 1 V / 3 A
        </button>
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="relative h-[400px] overflow-hidden rounded-xl bg-bg shadow-[var(--shadow-border)] lg:col-span-3 md:h-[540px]">
          {ready ? (
            <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted">Gehäuse…</div>}>
              <CaseStage
                lidOpen={lidOpen}
                explode={explode}
                heatMode={heatMode}
                temps={sim.temps}
                caseT={caseT}
                tAmb={tAmb}
                fanOn={sim.fan}
                hovered={hovered}
                onHover={setHovered}
                onSelect={() => undefined}
              />
            </Suspense>
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted">Gehäuse…</div>
          )}
          <div className="pointer-events-none absolute top-3 left-3 rounded-md bg-ink/85 px-3 py-2 font-mono text-xs text-paper">
            Luft {caseT.air.toFixed(0)} °C · Abluft {caseT.exhaust.toFixed(0)} °C · K1 {(sim.temps.hs ?? tAmb).toFixed(0)} °C
          </div>
          <div className="pointer-events-none absolute right-3 bottom-3 w-40 rounded-md bg-ink/85 px-2.5 py-2">
            <p className="mb-1.5 font-mono text-[10px] tracking-wide text-paper/60 uppercase">Gehäuse-Wärme</p>
            <div
              className="h-2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg,#b56a2e 0%,#d4a24a 20%,#e07028 40%,#c43c2c 65%,#f4efe8 100%)",
              }}
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-paper/70">
              <span>kalt</span>
              <span>heiß</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <h3 className="text-sm font-medium">Last im Gehäuse</h3>
            <div className="mt-3 space-y-3">
              {RAILS.map((r) => (
                <label key={r.id} className="block">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{r.label}</span>
                    <span className="font-mono text-xs text-muted">
                      {r.id === "lab" ? `${(labI * load.lab).toFixed(2)} A` : `${(r.i * load[r.id]).toFixed(2)} A`}
                    </span>
                  </div>
                  <Slider min={0} max={1} step={0.05} value={[load[r.id]]} onValueChange={([v]) => setLoad(r.id as RailId, v ?? 0)} />
                </label>
              ))}
              <label className="block">
                <div className="mb-1 flex justify-between text-sm">
                  <span>Labor U</span>
                  <span className="font-mono text-xs text-muted">{labU.toFixed(1)} V</span>
                </div>
                <Slider min={1} max={30} step={0.5} value={[labU]} onValueChange={([v]) => setLab(v ?? 12, labI)} />
              </label>
            </div>
          </section>

          <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <h3 className="text-sm font-medium">Gehäusezonen</h3>
            <ul className="mt-3 space-y-1.5 font-mono text-xs">
              {(
                [
                  ["Luft innen", caseT.air],
                  ["Zuluftwand", caseT.inlet],
                  ["Abluft / Lüfter", caseT.exhaust],
                  ["Deckel", caseT.lid],
                  ["Front", caseT.front],
                  ["Boden", caseT.floor],
                ] as const
              ).map(([n, t]) => (
                <li key={n} className="flex justify-between gap-2">
                  <span className="text-muted">{n}</span>
                  <span className="tabular-nums">{t.toFixed(0)} °C</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Verlust {Math.max(0, op.sys.pac - op.sys.pout).toFixed(1)} W im Kasten.
              Lüfter {sim.fan ? "zieht durch die Seitenlöcher nach hinten" : "steht — Luft staut sich"}.
            </p>
          </section>
        </div>
      </div>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-lg font-medium">Passung Platine → Gehäuse</h3>
        <p className="mt-1 text-sm text-muted">
          Außen {CASE.outerW} × {CASE.outerD} × {CASE.outerH} mm, Blech {CASE.wall} mm.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="font-mono text-xs text-faint">
              <tr>
                <th className="py-2 pr-3">Prüfung</th>
                <th className="py-2 pr-3">Soll</th>
                <th className="py-2 pr-3">Ist</th>
                <th className="py-2">Befund</th>
              </tr>
            </thead>
            <tbody>
              {fit.rows.map((r) => (
                <tr key={r.id} className="border-t border-line">
                  <td className="py-2 pr-3">{r.name}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{r.need}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{r.have}</td>
                  <td className="py-2">
                    <Badge tone={r.ok ? "ok" : "hot"}>{r.ok ? "passt" : "nein"}</Badge>
                    <span className="ml-2 text-xs text-muted">{r.note}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-lg font-medium">Fertigungsdateien geprüft</h3>
        <p className="mt-1 text-sm text-muted">
          Rev. D — Blech-ZIP neu laden. Alte Rückwand nicht verwenden.
        </p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {audit.map((a) => (
            <li key={a.id} className="flex gap-2">
              <Badge tone={a.ok ? "ok" : "hot"}>{a.ok ? "ok" : "fehler"}</Badge>
              <span className={a.ok ? "text-muted" : "text-fg"}>{a.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h3 className="text-lg font-medium">Werkstoff und Stärke</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="font-mono text-xs text-faint">Werkstoff</dt>
              <dd className="mt-0.5">{CASE.material}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-faint">Wandstärke</dt>
              <dd className="mt-0.5">{CASE.wall} mm Blech · Druck {CASE.wallPrint} mm</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-faint">Oberfläche</dt>
              <dd className="mt-0.5">{CASE.paint}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-faint">Deckel</dt>
              <dd className="mt-0.5">{CASE.gasket}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm leading-relaxed text-muted">{CASE.materialWhy}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{CASE.alloyAlt}</p>
        </article>
        <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h3 className="text-lg font-medium">Perforation und Luftweg</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Waben Ø {CASE.holeD} mm, Teilung {CASE.holePitch} mm — unter dem
            Prüffinger, EMV-tauglich unter 30 MHz. Zuluft an beiden Längsseiten
            auf Höhe des Kühlkörpers, Abluft hinten um den 60-mm-Lüfter. Front
            und Deckel bleiben geschlossen, damit Schirm und Anzeigen dicht sind.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Innen {inn.w.toFixed(0)} × {inn.d.toFixed(0)} × {inn.h.toFixed(0)} mm.
            Vier M3-Distanzbolzen {CASE.standoff} mm, geerdet.
          </p>
        </article>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h3 className="text-lg font-medium">Blech · Fremdfertigung</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Sechs Abwicklungen DXF + SVG, Lochbild, Auftragstext. Aluminium 1,5 mm,
            Deckel mit EMV-Feder. Das ist der Weg für Schutzklasse I und Schirmung.
          </p>
          <Button className="mt-4 min-h-11" onClick={() => downloadBlob(buildBlechZip(), `${CASE.name}-Blech.zip`)}>
            <Download />
            Blech-ZIP laden
          </Button>
        </article>
        <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h3 className="text-lg font-medium">3D-Druck · Attrappe</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            STL Wanne, Deckel, Front plus OpenSCAD. Maßhaltig zur Platine — aber
            Kunststoff ist nicht geerdet und nicht EMV-dicht. Nur Lehre / Dummy.
          </p>
          <Button variant="outline" className="mt-4 min-h-11" onClick={() => downloadBlob(buildPrintZip(), `${CASE.name}-3DDruck.zip`)}>
            <Download />
            Druck-ZIP laden
          </Button>
        </article>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-lg font-medium">PE, Berührung, EMV</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
          <li>
            Schutzleiter vom IEC-Kontakt (zuerst geschlossen) auf M4-Bolzen am
            Chassis, 4 mm² gn/ge, Fächerscheibe. Deckel über Erdungsband. Messung
            unter 0,3 Ω.
          </li>
          <li>
            230 V nur hinter der Kombibuchse (Schalter + Sicherung). Waben 4 mm —
            Prüffinger kommt nicht an spannungsführende Teile.
          </li>
          <li>
            Y-Kondensatoren und Filtermasse am PE-Sternpunkt. Durchgehendes
            Aluminium, lackfreie Kontaktflächen, 360° Deckelauflage.
          </li>
        </ul>
      </section>
    </div>
  );
}
