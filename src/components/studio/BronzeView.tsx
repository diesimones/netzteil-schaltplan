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
import {
  BRONZE_230,
  BRONZE_PLUS,
} from "@/lib/design";
import {
  CHAIN_MW,
  CHAIN_OLD,
  MW_TAKE,
  bronzePass,
  bronzeRows,
  systemAt,
} from "@/lib/bronze";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

function pct(n: number) {
  return `${n.toFixed(1)} %`;
}

export function BronzeView() {
  const labU = useStudio((s) => s.labU);
  const labI = useStudio((s) => s.labI);
  const usePrereg = useStudio((s) => s.usePrereg);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const oldRows = bronzeRows(CHAIN_OLD);
  const mwRows = bronzeRows(CHAIN_MW);
  const pass = bronzePass(CHAIN_MW);
  const oldFail = !bronzePass(CHAIN_OLD);

  const chart = mwRows.map((r, i) => ({
    name: r.name,
    vorher: Math.round(oldRows[i]!.etaPct * 10) / 10,
    jetzt: Math.round(r.etaPct * 10) / 10,
    bronze: r.officialPct,
    plus: 80,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            80 PLUS Bronze+ · 230 V · 25 / 50 / 100 %
          </p>
          <h2 className="text-2xl font-medium tracking-tight">Bronze+ Nachweis</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={pass ? "ok" : "hot"}>
            {pass ? "Schaltnetzteil besteht" : "Schaltnetzteil unter Grenze"}
          </Badge>
          <Badge tone={oldFail ? "warn" : "ok"}>Vorher ohne PFC durchgefallen</Badge>
        </div>
      </header>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        Bronze+ hier: mindestens 80 % bei 25, 50 und 100 % Last auf den vier
        Festschienen, Leistungsfaktor ≥ 0,90 bei 50 %. Offiziell 230-V-Bronze
        ist 81 / 85 / 81 % bei 20 / 50 / 100 %. Der Längsregler zählt nicht
        zum 80-PLUS-Gerät — das ist bei Mean Well genauso: gemessen wird das
        Schaltnetzteil.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {mwRows.map((r) => (
          <article key={r.name} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="font-mono text-xs tracking-widest text-muted uppercase">
              Last {r.name}
            </p>
            <p className="mt-1 text-2xl font-medium tabular-nums">{pct(r.etaPct)}</p>
            <p className="mt-1 text-xs text-muted">
              Grenze +80 % · Bronze {r.officialPct.toFixed(0)} % · PF {r.pf.toFixed(2)}
            </p>
            <div className="mt-2 flex gap-2">
              <Badge tone={r.plusOk ? "ok" : "hot"}>Bronze+</Badge>
              <Badge tone={r.bronzeOk ? "ok" : "warn"}>230-V-Bronze</Badge>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-6">
        <h3 className="text-sm font-medium">Vorher gegen Mean-Well-Pfad</h3>
        <div className="mt-4 h-64">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={12} />
                <YAxis domain={[70, 95]} stroke="var(--color-muted)" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: "#18191e",
                    border: "1px solid #2c2d34",
                    borderRadius: 8,
                    color: "#eceae4",
                  }}
                  formatter={(v) => [`${v} %`, undefined]}
                />
                <ReferenceLine y={80} stroke="#8a6a2a" strokeDasharray="4 4" />
                <ReferenceLine y={85} stroke="#3d6b4f" strokeDasharray="4 4" />
                <Bar dataKey="vorher" name="Vorher" fill="#5c5e58" radius={[4, 4, 0, 0]} />
                <Bar dataKey="jetzt" name="Mit PFC / QR" fill="#c9cdc4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-md bg-raised" />
          )}
        </div>
        <p className="mt-3 text-xs text-muted">
          Strich bei 80 % = Bronze+. Strich bei 85 % = Bronze 50 %-Punkt.
        </p>
      </section>

      <section className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-line font-mono text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Last</th>
              <th className="px-4 py-3 font-medium">Vorher</th>
              <th className="px-4 py-3 font-medium">Jetzt</th>
              <th className="px-4 py-3 font-medium">Bronze+</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Paus / Pein</th>
            </tr>
          </thead>
          <tbody>
            {mwRows.map((r, i) => {
              const o = oldRows[i]!;
              return (
                <tr key={r.name} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono">{r.name}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">{pct(o.etaPct)}</td>
                  <td className="px-4 py-3 tabular-nums">{pct(r.etaPct)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={r.plusOk && r.bronzeOk ? "ok" : r.plusOk ? "warn" : "hot"}>
                      {r.plusOk && r.bronzeOk ? "beide" : r.plusOk ? "nur +80" : "nein"}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-muted md:table-cell">
                    {r.pout.toFixed(1)} W / {r.pac.toFixed(1)} W
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-lg font-medium">Von der Mean-Well-Platine übernommen</h3>
        <p className="mt-1 text-sm text-muted">
          RSP-320-R26VAI, FAN4800A, SR280C, STTH8S06, zwei Ringkern-CMC, 100 µF /
          400 V, Frässchlitz. Nicht 1:1 kopiert — 320 W LLC wäre für 34 W
          Festschiene überdimensioniert. Übernommen ist das, was Bronze bei
          Teillast wirklich trägt.
        </p>
        <ul className="mt-4 space-y-3">
          {MW_TAKE.map((row) => (
            <li key={row.from} className="border-t border-line pt-3 first:border-0 first:pt-0">
              <p className="text-sm font-medium">{row.ours}</p>
              <p className="mt-0.5 text-xs text-faint">RSP-320: {row.from}</p>
              <p className="mt-1 text-sm text-muted">{row.why}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-lg font-medium">System inkl. Labor (nicht 80 PLUS)</h3>
        <p className="mt-1 text-sm text-muted">
          Zum Vergleich, Soll {labU.toFixed(0)} V / {labI.toFixed(1)} A, Vorregler{" "}
          {usePrereg ? "ein" : "aus"}. Der Längsregler kann bei 1 V / 3 A kein
          Bronze — deshalb Tracking auf ΔU ≈ {3.2.toFixed(1)} V.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {([0.25, 0.5, 1] as const).map((p) => {
            const s = systemAt(p, labU, labI, usePrereg);
            return (
              <li key={p} className="rounded-lg bg-raised px-3 py-3">
                <p className="font-mono text-xs text-faint">{Math.round(p * 100)} % alle Schienen</p>
                <p className="mt-1 text-lg tabular-nums">{pct(s.etaPct)}</p>
                <p className="text-xs text-muted">
                  {s.pout.toFixed(1)} W raus / {s.pac.toFixed(1)} W rein
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-xs leading-relaxed text-muted">
        Offiziell Bronze 230 V intern: {(BRONZE_230.p20 * 100).toFixed(0)} /{" "}
        {(BRONZE_230.p50 * 100).toFixed(0)} / {(BRONZE_230.p100 * 100).toFixed(0)}{" "}
        %. PF {(BRONZE_PLUS.pf50 * 100).toFixed(0)} % bei halber Last. Messung
        am AC-Eingang gegen die vier Festausgänge, Laborbuchse offen.
      </p>
    </div>
  );
}
