import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  CONRAD,
  FAN_OFF,
  FAN_ON,
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
import { pcbById } from "@/lib/pcb";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const PcbStage = lazy(() => import("./pcb/PcbStage"));

const ALIAS: Record<string, string> = {
  q3: "q2",
  re2: "re",
  fan: "hs",
  klx: "klx",
  st3: "ic8",
  pot4: "pot4",
};

export function Sim3dView() {
  const load = useStudio((s) => s.load);
  const setLoad = useStudio((s) => s.setLoad);
  const setAllLoad = useStudio((s) => s.setAllLoad);
  const labU = useStudio((s) => s.labU);
  const labI = useStudio((s) => s.labI);
  const setLab = useStudio((s) => s.setLab);
  const usePrereg = useStudio((s) => s.usePrereg);
  const setPrereg = useStudio((s) => s.setPrereg);
  const nQ = useStudio((s) => s.nQ);
  const rthKA = useStudio((s) => s.rthKA);
  const tAmb = useStudio((s) => s.tAmb);
  const select = useStudio((s) => s.select);
  const selected = useStudio((s) => s.selected);

  const inp: OpInputs = { load, labU, labI, usePrereg, nQ, rthKA, tAmb };
  const inpRef = useRef(inp);
  inpRef.current = inp;

  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<1 | 10 | 60>(10);
  const [sim, setSim] = useState<SimState>(() => coldSim(tAmb));
  const [hovered, setHovered] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000) * speed;
      last = now;
      if (dt > 0) setSim((s) => stepSim(s, dt, inpRef.current));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, speed]);

  const fanRth = sim.fan ? Math.min(rthKA, FAN_RTH) : rthKA;
  const op = operatingPoint({ ...inp, rthKA: fanRth });
  const hoverPart = hovered ? pcbById(hovered) : null;
  const hoverTemp =
    hoverPart?.heat && sim.temps[hoverPart.heat] != null
      ? sim.temps[hoverPart.heat]
      : null;
  const over20 = op.lab.pLin > CONRAD.pvMax;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            3D-Prüfstand · Wärme
          </p>
          <h2 className="text-2xl font-medium tracking-tight">Betrieb im Raum</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={running ? "ok" : "neutral"}>{running ? "läuft" : "gehalten"}</Badge>
          <Badge tone={sim.fan ? "warn" : "neutral"}>Lüfter {sim.fan ? "ein" : "aus"}</Badge>
          <Badge tone={over20 ? "hot" : "ok"}>
            Pv Labor {op.lab.pLin.toFixed(1)} W / {CONRAD.pvMax} W
          </Badge>
        </div>
      </header>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        Strom an den Schienen stellen — Bahnen und Bauteile färben sich nach
        der lokalen Wärme: Kupfer kalt, dann Gelb, Orange, Rot, fast weiß.
        Die Anleitung begrenzt den HB 533 auf {CONRAD.pvMax} W.
      </p>

      <section className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setRunning((v) => !v)} className="min-h-11">
          {running ? <Pause /> : <Play />}
          {running ? "Halten" : "Start"}
        </Button>
        <Button
          variant="outline"
          className="min-h-11"
          onClick={() => {
            setSim(coldSim(tAmb));
            setRunning(false);
          }}
        >
          <RotateCcw />
          Kalt
        </Button>
        <div className="flex overflow-hidden rounded-md shadow-[var(--shadow-border)]">
          {(
            [
              [1, "Echtzeit"],
              [10, "10 s/s"],
              [60, "1 min/s"],
            ] as const
          ).map(([s, label]) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn(
                "min-h-11 px-3 text-sm",
                speed === s ? "bg-accent text-accent-fg" : "bg-raised text-muted",
              )}
            >
              <span className="font-mono">{s}×</span>
              <span className="ml-1.5 hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <span className="text-xs text-faint">Simulationszeit</span>
        <button
          type="button"
          onClick={() => setPrereg(!usePrereg)}
          className="min-h-11 rounded-md bg-raised px-3 text-sm"
        >
          Vorregler {usePrereg ? "ein" : "aus"}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-md bg-raised px-3 text-sm"
          onClick={() => select("klx")}
        >
          Klixon zeigen
        </button>
        <button
          type="button"
          className="min-h-11 rounded-md bg-raised px-3 text-sm"
          onClick={() => {
            setAllLoad(1);
            setLab(1, 3);
            setPrereg(false);
          }}
        >
          Worst Case 1 V / 3 A
        </button>
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="relative h-[380px] overflow-hidden rounded-xl bg-bg shadow-[var(--shadow-border)] lg:col-span-3 md:h-[520px]">
          {ready ? (
          <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted">Szene…</div>}>
            <PcbStage
              mode="heat"
              selected={selected}
              hovered={hovered}
              onHover={setHovered}
              onSelect={(id) => select(id ? (ALIAS[id] ?? id) : null)}
              temps={sim.temps}
              tAmb={tAmb}
              fanOn={sim.fan}
            />
          </Suspense>
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted">Szene…</div>
          )}
          {hoverPart && (
            <div className="pointer-events-none absolute top-3 left-3 rounded-lg bg-ink/90 px-3 py-2 text-paper">
              <p className="font-mono text-xs text-paper/70">{hoverPart.ref}</p>
              <p className="text-sm font-medium">{hoverPart.name}</p>
              {hoverTemp != null && (
                <p className="font-mono text-sm tabular-nums">{hoverTemp.toFixed(0)} °C</p>
              )}
            </div>
          )}
          <HeatLegend />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
            <h3 className="text-sm font-medium">Strom an den Buchsen</h3>
            <div className="mt-3 space-y-4">
              {RAILS.map((r) => (
                <label key={r.id} className="block">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{r.label}</span>
                    <span className="font-mono tabular-nums text-muted">
                      {r.id === "lab"
                        ? `${(labI * load.lab).toFixed(2)} A`
                        : `${(r.i * load[r.id]).toFixed(2)} A`}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[load[r.id]]}
                    onValueChange={([v]) => setLoad(r.id as RailId, v ?? 0)}
                  />
                </label>
              ))}
              <label className="block">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Labor U</span>
                  <span className="font-mono tabular-nums text-muted">{labU.toFixed(1)} V</span>
                </div>
                <Slider
                  min={1}
                  max={30}
                  step={0.5}
                  value={[labU]}
                  onValueChange={([v]) => setLab(v ?? 12, labI)}
                />
              </label>
              <label className="block">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Labor I max</span>
                  <span className="font-mono tabular-nums text-muted">{labI.toFixed(2)} A</span>
                </div>
                <Slider
                  min={0}
                  max={3}
                  step={0.05}
                  value={[labI]}
                  onValueChange={([v]) => setLab(labU, v ?? 0)}
                />
              </label>
            </div>
          </section>

          <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <h3 className="text-sm font-medium">Klixon auf dem Kühlkörper</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Der Thermoschalter sitzt auf K1, neben T1/T2 — die kleine braune
              Scheibe mit zwei Fahnen. Er misst die Kühlkörpertemperatur, nicht
              die Sperrschicht. Bimetall, kein NTC, kein PWM.
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
              <div>
                <dt className="text-faint">Ein</dt>
                <dd>{FAN_ON} °C</dd>
              </div>
              <div>
                <dt className="text-faint">Aus</dt>
                <dd>{FAN_OFF} °C</dd>
              </div>
              <div>
                <dt className="text-faint">Jetzt K1</dt>
                <dd className="tabular-nums">{(sim.temps.hs ?? tAmb).toFixed(0)} °C</dd>
              </div>
              <div>
                <dt className="text-faint">Lüfter</dt>
                <dd>{sim.fan ? "läuft" : "steht"}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Hysterese verhindert Takteln: erst ab {FAN_ON} °C an, erst unter{" "}
              {FAN_OFF} °C wieder aus. Läuft der Lüfter, sinkt Rth,K-A auf{" "}
              {FAN_RTH} K/W.
            </p>
          </section>

          <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <h3 className="text-sm font-medium">Heiße Stellen</h3>
            <ul className="mt-3 space-y-1.5">
              {op.heat
                .slice()
                .sort((a, b) => (sim.temps[b.id] ?? 0) - (sim.temps[a.id] ?? 0))
                .slice(0, 6)
                .map((n) => {
                  const t = sim.temps[n.id as HeatId] ?? tAmb;
                  return (
                    <li key={n.id} className="flex justify-between gap-2 font-mono text-xs">
                      <span className="text-muted">{n.ref}</span>
                      <span className={t > n.tLimit * 0.85 ? "text-hot" : "tabular-nums"}>
                        {t.toFixed(0)} °C · {n.pW.toFixed(1)} W
                      </span>
                    </li>
                  );
                })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function HeatLegend() {
  return (
    <div className="pointer-events-none absolute right-3 bottom-3 w-44 rounded-md bg-ink/85 px-2.5 py-2">
      <p className="mb-1.5 font-mono text-[10px] tracking-wide text-paper/60 uppercase">
        Bahnwärme
      </p>
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
  );
}
