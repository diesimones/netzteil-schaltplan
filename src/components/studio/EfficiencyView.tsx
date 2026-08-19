import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRONZE_230, RAILS, systemEta, type LoadMap, type RailId } from "@/lib/design";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export function EfficiencyView() {
  const load = useStudio((s) => s.load);
  const setLoad = useStudio((s) => s.setLoad);
  const setAllLoad = useStudio((s) => s.setAllLoad);
  const labU = useStudio((s) => s.labU);
  const labI = useStudio((s) => s.labI);
  const setLab = useStudio((s) => s.setLab);
  const usePrereg = useStudio((s) => s.usePrereg);
  const setPrereg = useStudio((s) => s.setPrereg);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const now = systemEta(load, labU, labI, usePrereg);
  const railsOnly = systemEta({ ...load, lab: 0 }, labU, labI, usePrereg);
  const sweep = [0.2, 0.5, 1].map((p) => {
    const L: LoadMap = { p12: p, n12: p, p5: p, n5: p, lab: p };
    const sys = systemEta(L, labU, labI, usePrereg);
    const rails = systemEta({ ...L, lab: 0 }, labU, labI, usePrereg);
    return {
      name: `${Math.round(p * 100)} %`,
      system: round1(sys.etaPct),
      schalt: round1(rails.etaPct),
      bronze: p === 0.5 ? 85 : 81,
    };
  });

  const bronzeOk = railsOnly.etaPct >= 82;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            80 PLUS Bronze · 230 V
          </p>
          <h2 className="text-2xl font-medium tracking-tight">Wirkungsgrad</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={bronzeOk ? "ok" : "hot"}>
            Schaltnetzteil {railsOnly.etaPct.toFixed(1)} %
          </Badge>
          <Badge tone="neutral">System {now.etaPct.toFixed(1)} %</Badge>
        </div>
      </header>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        Bronze 230 V: 81 / 85 / 81 % bei 20 / 50 / 100 %. Bronze+ (≥ 80 % bei
        25 / 50 / 100 %) steht im Tab Bronze+. Der Längsregler zählt getrennt.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat k="Paus Schalt" v={`${railsOnly.pout.toFixed(1)} W`} />
        <Stat k="Paus Labor" v={`${now.lab.pout.toFixed(1)} W`} />
        <Stat k="Pein Schalt" v={`${railsOnly.pac.toFixed(1)} W`} />
      </div>

      <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-6">
        <h3 className="text-sm font-medium">Lastpunkte gegen Bronze (81 / 85 / 81 %)</h3>
        <div className="mt-4 h-64">
          {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sweep}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="var(--color-muted)" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{
                  background: "#18191e",
                  border: "1px solid #2c2d34",
                  borderRadius: 8,
                  color: "#eceae4",
                }}
                formatter={(v) => [`${v} %`, undefined]}
              />
              <ReferenceLine y={81} stroke="#3d6b4f" strokeDasharray="4 4" />
              <Bar dataKey="schalt" name="Schaltnetzteil" fill="#c9cdc4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="system" name="System inkl. Labor" fill="#5c5e58" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-md bg-raised" />
          )}
        </div>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-medium">Lastsimulator</h3>
          <div className="flex flex-wrap gap-2">
            {[0.25, 0.5, 1].map((p) => (
              <button
                key={p}
                type="button"
                className="h-10 rounded-md bg-raised px-3 text-sm"
                onClick={() => setAllLoad(p)}
              >
                {Math.round(p * 100)} %
              </button>
            ))}
            <button
              type="button"
              className="h-10 rounded-md bg-raised px-3 text-sm"
              onClick={() => setPrereg(!usePrereg)}
            >
              Vorregler {usePrereg ? "ein" : "aus"}
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {RAILS.map((r) => (
            <label key={r.id} className="block">
              <div className="mb-2 flex justify-between text-sm">
                <span>{r.label}</span>
                <span className="font-mono tabular-nums text-muted">
                  {Math.round(load[r.id] * 100)} % ·{" "}
                  {(r.id === "lab"
                    ? labU * labI * load.lab
                    : r.v * r.i * load[r.id]
                  ).toFixed(1)}{" "}
                  W
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
              <span className="font-mono tabular-nums text-muted">
                {labU.toFixed(1)} V / {labI.toFixed(2)} A
              </span>
            </div>
            <Slider
              min={1}
              max={30}
              step={0.5}
              value={[labU]}
              onValueChange={([v]) => setLab(v ?? 12, labI)}
            />
          </label>
        </div>
      </section>
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <article className="rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="font-mono text-xs text-faint">{k}</p>
      <p className="mt-1 font-mono text-2xl tabular-nums">{v}</p>
    </article>
  );
}
