import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FAN_OFF,
  FAN_ON,
  FAN_RTH,
  RAILS,
  coldSim,
  operatingPoint,
  stepSim,
  type HeatId,
  type HeatNode,
  type OpInputs,
  type RailId,
  type SimState,
} from "@/lib/design";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const SPEEDS = [1, 10, 60] as const;

export function SimView() {
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
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(10);
  const [sim, setSim] = useState<SimState>(() => coldSim(tAmb));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
  const hot = hottest(op.heat, sim.temps);
  const tjOk = (sim.temps.q23 ?? tAmb) <= 125 && (sim.temps.hs ?? tAmb) <= 90;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Prüfstand · Strom und Thermik
          </p>
          <h2 className="text-2xl font-medium tracking-tight">Betriebssimulation</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={running ? "ok" : "neutral"}>
            {running ? "in Betrieb" : "gehalten"}
          </Badge>
          <Badge tone={sim.fan ? "warn" : "neutral"}>
            Lüfter {sim.fan ? "ein" : "aus"}
          </Badge>
          <Badge tone={tjOk ? "ok" : "hot"}>
            {tjOk ? "Tj im Grünen" : "Übertemperatur"}
          </Badge>
        </div>
      </header>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        Elektrische Größen folgen der Last sofort. Temperaturen haben thermische
        Trägheit — der Kühlkörper braucht Minuten, der MOSFET Sekunden. Der
        Klixon schaltet den Lüfter bei {FAN_ON} °C ein und bei {FAN_OFF} °C
        wieder aus.
      </p>

      <section className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => setRunning((v) => !v)}
          className="min-h-11"
        >
          {running ? <Pause /> : <Play />}
          {running ? "Halten" : "Einschalten"}
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
          Kaltstart
        </Button>
        <div className="flex overflow-hidden rounded-md shadow-[var(--shadow-border)]">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn(
                "min-h-11 px-3 font-mono text-sm",
                speed === s ? "bg-accent text-accent-fg" : "bg-raised text-muted",
              )}
            >
              {s}×
            </button>
          ))}
        </div>
        <p className="font-mono text-sm tabular-nums text-muted">
          t = {fmtTime(sim.t)}
        </p>
      </section>

      <section className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setAllLoad(p.load);
              setLab(p.u, p.i);
              setPrereg(p.pre);
            }}
            className="min-h-11 rounded-md bg-raised px-3 text-sm text-fg hover:bg-raised/80"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPrereg(!usePrereg)}
          className="min-h-11 rounded-md bg-raised px-3 text-sm"
        >
          Vorregler {usePrereg ? "ein" : "aus"}
        </button>
      </section>

      <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">Fronttafel · DSN-VC288</h3>
          <p className="font-mono text-xs text-faint">Sense an der Buchse</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {op.rails.map((r) => (
            <Meter
              key={r.id}
              name={r.id === "lab" ? "M5 Labor" : `M${meterNo(r.id)} ${r.label}`}
              v={r.v}
              i={r.i}
              on={() => select(r.id === "lab" ? "disp" : "disp")}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat k="Netzaufnahme" v={`${op.sys.pac.toFixed(1)} W`} h={`${op.iAc.toFixed(2)} A · PF ${op.pf.toFixed(2)}`} />
        <Stat k="Abgabe" v={`${op.sys.pout.toFixed(1)} W`} h={`Schalt ${op.sw.pout.toFixed(1)} W`} />
        <Stat k="Wirkungsgrad" v={`${op.sys.etaPct.toFixed(1)} %`} h="System inkl. Labor" />
        <Stat
          k={hot.ref}
          v={`${(sim.temps[hot.id] ?? tAmb).toFixed(0)} °C`}
          h={`${hot.pW.toFixed(1)} W · Grenze ${hot.tLimit} °C`}
          warn={(sim.temps[hot.id] ?? tAmb) > hot.tLimit * 0.85}
        />
        <Stat
          k="Lüfter K1"
          v={sim.fan ? "EIN" : "AUS"}
          h={sim.fan ? `${fanRth.toFixed(2)} K/W aktiv` : `Klixon ${FAN_ON} °C`}
        />
      </div>

      <section className="overflow-x-auto rounded-xl bg-paper p-2 text-ink shadow-[var(--shadow-border)] md:p-4">
        <LiveChassis
          op={op}
          temps={sim.temps}
          tAmb={tAmb}
          fan={sim.fan}
          selected={selected}
          onSelect={select}
        />
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
        <h3 className="text-lg font-medium">Last am Prüfstand</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {RAILS.map((r) => (
            <label key={r.id} className="block">
              <div className="mb-2 flex justify-between text-sm">
                <span>{r.label}</span>
                <span className="font-mono tabular-nums text-muted">
                  {Math.round(load[r.id] * 100)} % ·{" "}
                  {(r.id === "lab" ? labU * labI * load.lab : r.v * r.i * load[r.id]).toFixed(1)} W
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
              <span>Labor-Sollspannung</span>
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
              <span>Labor-Stromgrenze</span>
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

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-3 md:p-5">
          <h3 className="text-sm font-medium">Temperaturverlauf</h3>
          <div className="mt-3 h-56">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sim.history}>
                  <CartesianGrid stroke="var(--color-line)" vertical={false} />
                  <XAxis
                    dataKey="t"
                    stroke="var(--color-muted)"
                    fontSize={11}
                    tickFormatter={(v) => fmtTime(Number(v))}
                  />
                  <YAxis
                    stroke="var(--color-muted)"
                    fontSize={11}
                    unit="°"
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18191e",
                      border: "1px solid #2c2d34",
                      borderRadius: 8,
                      color: "#eceae4",
                    }}
                    labelFormatter={(v) => `t = ${fmtTime(Number(v))}`}
                    formatter={(v, name) => [`${Number(v).toFixed(1)} °C`, String(name)]}
                  />
                  <Line type="monotone" dataKey="q23" name="T1/T2" stroke="var(--color-hot)" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="hs" name="Kühlkörper" stroke="var(--color-warn)" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="q1" name="Q1 MOSFET" stroke="var(--color-selv)" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-md bg-raised" />
            )}
          </div>
        </section>

        <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-2 md:p-5">
          <h3 className="text-sm font-medium">Wärmebilanz</h3>
          <ul className="mt-3 space-y-1.5">
            {op.heat.map((n) => {
              const t = sim.temps[n.id] ?? tAmb;
              const tone = t >= n.tLimit ? "hot" : t > n.tLimit * 0.75 ? "warn" : "ok";
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => select(n.part)}
                    className="flex w-full items-baseline gap-2 rounded-md px-1 py-1 text-left hover:bg-raised"
                  >
                    <span className="w-16 shrink-0 font-mono text-xs text-faint">{n.ref}</span>
                    <span className="min-w-0 flex-1 truncate text-sm">{n.name}</span>
                    <span className="font-mono text-xs tabular-nums text-muted">{n.pW.toFixed(1)} W</span>
                    <span
                      className={cn(
                        "w-12 text-right font-mono text-xs tabular-nums",
                        tone === "hot" && "text-hot",
                        tone === "warn" && "text-warn",
                        tone === "ok" && "text-muted",
                      )}
                    >
                      {t.toFixed(0)}°
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

const PRESETS: {
  id: string;
  label: string;
  load: number;
  u: number;
  i: number;
  pre: boolean;
}[] = [
  { id: "idle", label: "Leerlauf", load: 0, u: 12, i: 0, pre: true },
  { id: "half", label: "50 % Bronze", load: 0.5, u: 12, i: 1.5, pre: true },
  { id: "full", label: "Volllast", load: 1, u: 12, i: 2, pre: true },
  { id: "exam", label: "Prüfung 1 V / 3 A", load: 1, u: 1, i: 3, pre: true },
  { id: "worst", label: "Worst Case ohne Vorregler", load: 1, u: 1, i: 3, pre: false },
];

function meterNo(id: RailId) {
  if (id === "p12") return 1;
  if (id === "n12") return 2;
  if (id === "p5") return 3;
  if (id === "n5") return 4;
  return 5;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function hottest(heat: HeatNode[], temps: Record<HeatId, number>): HeatNode {
  return heat.reduce((a, b) => ((temps[b.id] ?? 0) > (temps[a.id] ?? 0) ? b : a));
}

function Meter({
  name,
  v,
  i,
  on,
}: {
  name: string;
  v: number;
  i: number;
  on: () => void;
}) {
  return (
    <button
      type="button"
      onClick={on}
      className="rounded-lg bg-bg px-3 py-3 text-left shadow-[var(--shadow-border)]"
    >
      <p className="font-mono text-xs tracking-widest text-faint uppercase">{name}</p>
      <p className="mt-1 font-mono text-xl tabular-nums tracking-tight text-accent">
        {v >= 0 ? "+" : "−"}
        {Math.abs(v).toFixed(2)}
        <span className="ml-1 text-xs text-muted">V</span>
      </p>
      <p className="font-mono text-lg tabular-nums text-ok">
        {i.toFixed(2)}
        <span className="ml-1 text-xs text-muted">A</span>
      </p>
    </button>
  );
}

function Stat({
  k,
  v,
  h,
  warn,
}: {
  k: string;
  v: string;
  h: string;
  warn?: boolean;
}) {
  return (
    <article className="rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="font-mono text-xs text-faint">{k}</p>
      <p className={cn("mt-1 font-mono text-2xl tabular-nums", warn && "text-hot")}>{v}</p>
      <p className="mt-1 text-xs text-muted">{h}</p>
    </article>
  );
}

function heatFill(t: number, amb: number, limit: number, cool: string) {
  const x = Math.max(0, Math.min(1, (t - amb) / Math.max(12, limit - amb)));
  if (x < 0.12) return cool;
  if (x < 0.55) return mix(cool, "#e2c48a", (x - 0.12) / 0.43);
  return mix("#e2c48a", "#d07068", (x - 0.55) / 0.45);
}

function mix(a: string, b: string, t: number) {
  const p = (h: string) => [
    Number.parseInt(h.slice(1, 3), 16),
    Number.parseInt(h.slice(3, 5), 16),
    Number.parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const k = Math.max(0, Math.min(1, t));
  const m = (x: number, y: number) => Math.round(x + (y - x) * k);
  return `rgb(${m(ar, br)} ${m(ag, bg)} ${m(ab, bb)})`;
}

function LiveChassis({
  op,
  temps,
  tAmb,
  fan,
  selected,
  onSelect,
}: {
  op: ReturnType<typeof operatingPoint>;
  temps: Record<HeatId, number>;
  tAmb: number;
  fan: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const t = (id: HeatId) => temps[id] ?? tAmb;
  const n = (id: HeatId) => op.heat.find((h) => h.id === id)!;
  const rail = (id: RailId) => op.rails.find((r) => r.id === id)!;

  return (
    <svg
      viewBox="0 0 1100 620"
      className="h-auto w-full min-w-xl"
      role="img"
      aria-label="Live-Strompfad und Wärmebild des Netzteils"
    >
      <defs>
        <pattern id="sim-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#7a2f2f" strokeWidth="1" opacity="0.35" />
        </pattern>
      </defs>

      <text x="24" y="26" fill="#4a4c44" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        IFT-NT-2026 · Betrieb · Stromfluss und Bauteiltemperatur
      </text>

      <Zone x={16} y={40} w={1068} h={168} label="PRIMÄRSEITE  ·  230 V AC" stroke="#7a2f2f" fill="#f6e8e4" />
      <rect x="16" y="218" width="1068" height="22" fill="url(#sim-hatch)" />
      <text x="550" y="233" textAnchor="middle" fill="#7a2f2f" fontFamily="IBM Plex Sans, sans-serif" fontSize="11" fontWeight="500">
        Galvanische Trennung T1 · 8 mm Kriechstrecke
      </text>
      <Zone x={16} y={250} w={1068} h={220} label="SELV" stroke="#2a4a62" fill="#e4edf3" />
      <Zone x={16} y={484} w={1068} h={120} label="FRONT  ·  Last an den Buchsen" stroke="#3d6b4f" fill="#e5efe8" />

      <Cell
        id="in"
        x={36}
        y={68}
        w={190}
        h={118}
        title="Netzeingang"
        lines={[`${op.sys.pac.toFixed(1)} W`, `${op.iAc.toFixed(2)} A AC`]}
        fill="#fbf7ee"
        selected={selected}
        onSelect={onSelect}
      />
      <Flow d="M226 127 H256" i={op.iAc} pri />

      <Cell
        id="emc"
        x={256}
        y={68}
        w={180}
        h={118}
        title="EMV-Filter"
        lines={["L1 · X2 · Y2", `${op.iAc.toFixed(2)} A`]}
        fill="#fbf7ee"
        selected={selected}
        onSelect={onSelect}
      />
      <Flow d="M436 127 H466" i={op.iAc} pri />

      <Cell
        id="br1"
        x={466}
        y={68}
        w={190}
        h={118}
        title="BR1  GBU406"
        lines={[
          `${n("br1").pW.toFixed(1)} W`,
          `${t("br1").toFixed(0)} °C  ·  ${op.uDc.toFixed(0)} V`,
        ]}
        fill={heatFill(t("br1"), tAmb, n("br1").tLimit, "#f6e8e4")}
        selected={selected}
        onSelect={onSelect}
        part="br1"
      />
      <Flow d="M656 127 H686" i={op.iDc} pri />

      <Cell
        id="fly"
        x={686}
        y={68}
        w={376}
        h={118}
        title="Sperrwandler  Q1 + T1"
        lines={[
          `Q1 ${t("q1").toFixed(0)} °C  ·  ${n("q1").pW.toFixed(1)} W`,
          `T1 ${t("t1").toFixed(0)} °C  ·  ${op.iDc.toFixed(2)} A`,
        ]}
        fill={heatFill(Math.max(t("q1"), t("t1")), tAmb, 150, "#f6e8e4")}
        selected={selected}
        onSelect={onSelect}
        part="q1"
      />

      <Flow d="M874 186 V250" i={op.iBus15 + op.iBus35} />

      <Cell
        id="bus"
        x={36}
        y={278}
        w={230}
        h={170}
        title="Sekundärbusse"
        lines={[
          `+15 V  ${op.iBus15.toFixed(2)} A`,
          `+35 V  ${op.iBus35.toFixed(2)} A`,
          `D1/2 ${t("d15").toFixed(0)}°  D3 ${t("d35").toFixed(0)}°`,
        ]}
        fill={heatFill(Math.max(t("d15"), t("d35")), tAmb, 125, "#e4edf3")}
        selected={selected}
        onSelect={onSelect}
        part="d3"
      />

      <Flow d="M266 320 H300" i={rail("p12").i + rail("p5").i} />
      <Flow d="M266 368 H300" i={rail("n12").i + rail("n5").i} />
      <Flow d="M266 418 H720" i={op.iBus35} />

      <Cell
        id="p12"
        x={300}
        y={278}
        w={190}
        h={78}
        title="+12 V / 1 A"
        lines={[`${rail("p12").i.toFixed(2)} A  ·  ${t("buck").toFixed(0)} °C`]}
        fill={heatFill(t("buck"), tAmb, 125, "#e4edf3")}
        selected={selected}
        onSelect={onSelect}
        part="ic2"
      />
      <Cell
        id="p5"
        x={508}
        y={278}
        w={190}
        h={78}
        title="+5 V / 1 A"
        lines={[`${rail("p5").i.toFixed(2)} A  ·  IC4`]}
        fill={heatFill(t("buck"), tAmb, 125, "#e4edf3")}
        selected={selected}
        onSelect={onSelect}
        part="ic4"
      />
      <Cell
        id="n12"
        x={300}
        y={368}
        w={190}
        h={78}
        title="−12 V / 1 A"
        lines={[`${rail("n12").i.toFixed(2)} A  ·  ${t("inv").toFixed(0)} °C`]}
        fill={heatFill(t("inv"), tAmb, 125, "#e4edf3")}
        selected={selected}
        onSelect={onSelect}
        part="ic3"
      />
      <Cell
        id="n5"
        x={508}
        y={368}
        w={190}
        h={78}
        title="−5 V / 1 A"
        lines={[`${rail("n5").i.toFixed(2)} A  ·  IC5`]}
        fill={heatFill(t("inv"), tAmb, 125, "#e4edf3")}
        selected={selected}
        onSelect={onSelect}
        part="ic5"
      />

      <Cell
        id="lab"
        x={720}
        y={278}
        w={342}
        h={168}
        title="Labor 1…30 V"
        lines={[
          `IC7 ${t("ic7").toFixed(0)} °C  ·  ${n("ic7").pW.toFixed(1)} W`,
          `T1/T2 ${t("q23").toFixed(0)} °C  ·  ${n("q23").pW.toFixed(1)} W`,
          `K1 ${t("hs").toFixed(0)} °C  ·  Lüfter ${fan ? "EIN" : "AUS"}`,
        ]}
        fill={heatFill(Math.max(t("q23"), t("hs")), tAmb, 125, "#f3ead8")}
        selected={selected}
        onSelect={onSelect}
        part="q2"
      />

      {fan && <FanIcon x={1020} y={286} />}

      <Flow d="M395 356 V502" i={rail("p12").i} />
      <Flow d="M603 356 V502" i={rail("p5").i} />
      <Flow d="M395 446 V532 H300" i={rail("n12").i} />
      <Flow d="M603 446 V532 H508" i={rail("n5").i} />
      <Flow d="M891 446 V502" i={rail("lab").i} />

      <Jack x={36} y={514} label="M1 +12 V" i={rail("p12").i} v={rail("p12").v} />
      <Jack x={244} y={514} label="M2 −12 V" i={rail("n12").i} v={rail("n12").v} />
      <Jack x={452} y={514} label="M3 +5 V" i={rail("p5").i} v={rail("p5").v} />
      <Jack x={660} y={514} label="M4 −5 V" i={rail("n5").i} v={rail("n5").v} />
      <Jack x={868} y={514} label="M5 Labor" i={rail("lab").i} v={rail("lab").v} />
    </svg>
  );
}

function Zone({
  x,
  y,
  w,
  h,
  label,
  stroke,
  fill,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  stroke: string;
  fill: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <text x={x + 14} y={y + 20} fill={stroke} fontFamily="IBM Plex Mono, monospace" fontSize="11">
        {label}
      </text>
    </g>
  );
}

function Cell({
  id,
  x,
  y,
  w,
  h,
  title,
  lines,
  fill,
  selected,
  onSelect,
  part,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  fill: string;
  selected: string | null;
  onSelect: (id: string) => void;
  part?: string;
}) {
  const key = part ?? id;
  const on = selected === key || selected === id;
  return (
    <g
      className={cn("cursor-pointer", on && "sch-sel")}
      onClick={() => onSelect(key)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(key);
      }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        fill={fill}
        stroke={on ? "#2a4a62" : "#1c1d18"}
        strokeWidth={on ? 2.2 : 1.3}
      />
      <text x={x + 12} y={y + 22} fill="#1c1d18" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fontWeight="600">
        {title}
      </text>
      {lines.map((ln, i) => (
        <text
          key={`${id}-${i}`}
          x={x + 12}
          y={y + 44 + i * 17}
          fill="#4a4c44"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="12"
        >
          {ln}
        </text>
      ))}
    </g>
  );
}

function Flow({ d, i, pri }: { d: string; i: number; pri?: boolean }) {
  const on = Math.abs(i) > 0.015;
  const dur = Math.max(0.32, 1.7 / (0.22 + Math.abs(i) * 2.4));
  return (
    <path
      d={d}
      fill="none"
      stroke={pri ? "#7a2f2f" : "#2a4a62"}
      strokeWidth={1.15 + Math.min(3.4, Math.abs(i) * 1.5)}
      strokeLinecap="round"
      className={on ? "sim-flow" : undefined}
      style={on ? { animationDuration: `${dur}s` } : undefined}
      opacity={on ? 0.95 : 0.28}
    />
  );
}

function Jack({
  x,
  y,
  label,
  i,
  v,
}: {
  x: number;
  y: number;
  label: string;
  i: number;
  v: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={188} height={72} rx="8" fill="#fbf7ee" stroke="#1c1d18" strokeWidth="1.2" />
      <text x={x + 12} y={y + 20} fill="#4a4c44" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        {label}
      </text>
      <text x={x + 12} y={y + 42} fill="#1c1d18" fontFamily="IBM Plex Mono, monospace" fontSize="13">
        {v >= 0 ? "+" : "−"}
        {Math.abs(v).toFixed(1)} V
      </text>
      <text x={x + 12} y={y + 60} fill="#3d6b4f" fontFamily="IBM Plex Mono, monospace" fontSize="13">
        {i.toFixed(2)} A
      </text>
    </g>
  );
}

function FanIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="sim-fan-on">
        <circle cx="14" cy="14" r="13" fill="#efe8d6" stroke="#8a6230" strokeWidth="1.2" />
        <path d="M14 14 L14 4 A10 10 0 0 1 22 10 Z" fill="#8a6230" />
        <path d="M14 14 L24 14 A10 10 0 0 1 18 23 Z" fill="#8a6230" />
        <path d="M14 14 L14 24 A10 10 0 0 1 5 18 Z" fill="#8a6230" />
        <path d="M14 14 L4 14 A10 10 0 0 1 10 5 Z" fill="#8a6230" />
        <circle cx="14" cy="14" r="3" fill="#efe8d6" />
      </g>
    </g>
  );
}
