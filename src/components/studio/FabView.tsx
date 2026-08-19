import { useMemo, useState } from "react";
import { Download, FileText, Layers } from "lucide-react";
import {
  FAB,
  allPads,
  buildFabFiles,
  downloadBlob,
  downloadText,
  mountingHoles,
  poursOnBoard,
  slotRect,
  toBoard,
  tracesOnBoard,
  zipStore,
} from "@/lib/gerber";
import { PCB_PARTS } from "@/lib/pcb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LayerKey = "bot" | "top" | "mask" | "silk" | "drill" | "dim";

const LAYER_META: { id: LayerKey; label: string }[] = [
  { id: "bot", label: "Kupfer unten" },
  { id: "top", label: "Kupfer oben" },
  { id: "mask", label: "Lötstopp" },
  { id: "silk", label: "Bestückdruck" },
  { id: "drill", label: "Bohrungen" },
  { id: "dim", label: "Maße" },
];

export function FabView() {
  const [on, setOn] = useState<Record<LayerKey, boolean>>({
    bot: true,
    top: true,
    mask: true,
    silk: true,
    drill: true,
    dim: true,
  });
  const [hover, setHover] = useState<string | null>(null);

  const traces = useMemo(() => tracesOnBoard(), []);
  const pours = useMemo(() => poursOnBoard(), []);
  const pads = useMemo(() => allPads(), []);
  const holes = useMemo(() => mountingHoles(), []);
  const slot = useMemo(() => slotRect(), []);
  const files = useMemo(() => buildFabFiles(), []);

  const pad = 18;
  const vw = FAB.w + pad * 2;
  const vh = FAB.h + pad * 2 + 10;

  function toggle(id: LayerKey) {
    setOn((s) => ({ ...s, [id]: !s[id] }));
  }

  function saveZip() {
    downloadBlob(zipStore(files), `${FAB.name}-Gerber.zip`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Fertigung · Ätzerei
          </p>
          <h2 className="text-2xl font-medium tracking-tight">Leiterplatte 2D</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="selv">
            {FAB.w} × {FAB.h} mm
          </Badge>
          <Badge tone="neutral">2 Lagen · {FAB.thick} mm FR4</Badge>
          <Badge tone="ok">RS-274X</Badge>
        </div>
      </header>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        Fertigungsreife Zweilagenkarte des optimierten Netzteils. Primär links,
        SELV rechts, Isolationsschlitz dazwischen. Die HB-533-Regelung sitzt auf
        derselben Platine — die Originalkarte muss nicht extra geätzt werden.
        Dateien sind Gerber RS-274X plus Excellon, so wie Leiterplattenwerke und
        Ätzereien sie erwarten.
      </p>

      <section className="flex flex-wrap gap-2">
        {LAYER_META.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => toggle(l.id)}
            className={cn(
              "min-h-11 rounded-md px-3 text-sm",
              on[l.id] ? "bg-accent text-accent-fg" : "bg-raised text-muted",
            )}
          >
            {l.label}
          </button>
        ))}
      </section>

      <div className="overflow-x-auto rounded-xl bg-bg p-2 shadow-[var(--shadow-border)] md:p-4">
        <svg
          viewBox={`0 0 ${vw} ${vh}`}
          className="mx-auto block h-auto w-full max-w-5xl"
          role="img"
          aria-label="Leiterplatte 2D"
        >
          <rect width={vw} height={vh} fill="#101114" />
          <g transform={`translate(${pad} ${pad})`}>
            <rect width={FAB.w} height={FAB.h} fill="#163828" stroke="#c4b48a" strokeWidth={0.4} />

            {on.bot && (
              <g opacity={0.85}>
                <rect x={2} y={2} width={slot.x - 3.2} height={FAB.h - 4} fill="#6a4018" />
                <rect
                  x={slot.x + slot.w + 1.2}
                  y={2}
                  width={FAB.w - slot.x - slot.w - 3.2}
                  height={FAB.h - 4}
                  fill="#6a4018"
                />
              </g>
            )}

            {on.top && (
              <g>
                {pours.map((p) => (
                  <rect
                    key={p.id}
                    x={p.x - p.w / 2}
                    y={p.y - p.d / 2}
                    width={p.w}
                    height={p.d}
                    fill="#b56a2e"
                    opacity={0.55}
                  />
                ))}
                {traces.map((t) => (
                  <polyline
                    key={t.id}
                    points={t.pts.map((p) => p.join(",")).join(" ")}
                    fill="none"
                    stroke="#c47a38"
                    strokeWidth={t.w}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {pads.map((p, i) =>
                  p.shape === "rect" && p.w && p.h ? (
                    <rect
                      key={`pd${i}`}
                      x={p.x - p.w / 2}
                      y={p.y - p.h / 2}
                      width={p.w}
                      height={p.h}
                      fill="#d4924a"
                    />
                  ) : (
                    <circle key={`pd${i}`} cx={p.x} cy={p.y} r={p.d / 2} fill="#d4924a" />
                  ),
                )}
              </g>
            )}

            {on.mask && (
              <rect width={FAB.w} height={FAB.h} fill="#0f2a1c" opacity={0.28} />
            )}

            <rect x={slot.x} y={slot.y} width={slot.w} height={slot.h} fill="#101114" />

            {on.silk && (
              <g fill="#e8e4d8" fontFamily="IBM Plex Mono, ui-monospace, monospace">
                {PCB_PARTS.map((p) => {
                  const o = toBoard(p.x, p.z);
                  return (
                    <text
                      key={p.id}
                      x={o.x + 1.4}
                      y={o.y - 2.2}
                      fontSize={2.1}
                      className="cursor-pointer"
                      onMouseEnter={() => setHover(p.id)}
                      onMouseLeave={() => setHover(null)}
                    >
                      {p.ref}
                    </text>
                  );
                })}
                <text x={8} y={FAB.h - 5} fontSize={3.2}>
                  {FAB.name}  REV {FAB.rev}
                </text>
                <text x={8} y={8} fontSize={3}>
                  PRI 230 V
                </text>
                <text x={FAB.w * 0.58} y={8} fontSize={3}>
                  SELV
                </text>
              </g>
            )}

            {on.drill && (
              <g fill="#101114" stroke="#c9cdc4" strokeWidth={0.15}>
                {pads
                  .filter((p) => p.drill > 0.15)
                  .map((p, i) => (
                    <circle key={`h${i}`} cx={p.x} cy={p.y} r={p.drill / 2} />
                  ))}
                {holes.map((h, i) => (
                  <circle key={`m${i}`} cx={h.x} cy={h.y} r={h.d / 2} />
                ))}
              </g>
            )}

            {hover &&
              PCB_PARTS.filter((p) => p.id === hover).map((p) => {
                const o = toBoard(p.x, p.z);
                return (
                  <g key="tip">
                    <rect x={o.x + 4} y={o.y - 12} width={42} height={10} fill="#18191e" rx={1} />
                    <text
                      x={o.x + 6}
                      y={o.y - 5.5}
                      fill="#eceae4"
                      fontSize={2.4}
                      fontFamily="IBM Plex Sans, sans-serif"
                    >
                      {p.ref}  {p.value}
                    </text>
                  </g>
                );
              })}

            {on.dim && (
              <g
                fill="#8a8c84"
                stroke="#8a8c84"
                strokeWidth={0.2}
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
                fontSize={2.4}
              >
                <line x1={0} y1={FAB.h + 6} x2={FAB.w} y2={FAB.h + 6} />
                <line x1={0} y1={FAB.h + 4.5} x2={0} y2={FAB.h + 7.5} />
                <line x1={FAB.w} y1={FAB.h + 4.5} x2={FAB.w} y2={FAB.h + 7.5} />
                <text x={FAB.w / 2 - 12} y={FAB.h + 9.4}>
                  {FAB.w} mm
                </text>
                <line x1={-6} y1={0} x2={-6} y2={FAB.h} />
                <text x={-16} y={FAB.h / 2} transform={`rotate(-90 -16 ${FAB.h / 2})`}>
                  {FAB.h} mm
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Download className="size-4" />
            Dateien für die Ätzerei
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Ein ZIP mit Kupfer, Lötstopp, Bestückdruck, Kontur und Bohrdaten.
            So nimmt es PCBWay, Multi-CB, Leiterplatten.de oder die lokale
            Ätzerei.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button className="min-h-11" onClick={saveZip}>
              <Download />
              Gerber-ZIP laden
            </Button>
            <Button
              variant="outline"
              className="min-h-11"
              onClick={() => downloadText(files.find((f) => f.name.endsWith(".txt"))?.text ?? "", "README-FERTIGUNG.txt")}
            >
              <FileText />
              Auftragstext
            </Button>
          </div>
          <ul className="mt-4 space-y-1 font-mono text-xs text-muted">
            {files.map((f) => (
              <li key={f.name} className="flex items-center justify-between gap-2">
                <span>{f.name}</span>
                <button
                  type="button"
                  className="min-h-8 text-fg underline-offset-2 hover:underline"
                  onClick={() => downloadText(f.text, f.name, mimeFor(f.name))}
                >
                  einzeln
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Layers className="size-4" />
            Spezifikation
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <Fact k="Abmessung" v={`${FAB.w} × ${FAB.h} mm`} />
            <Fact k="Lagen" v={`${FAB.layers} · ${FAB.stack}`} />
            <Fact k="Oberfläche" v={FAB.finish} />
            <Fact k="Lack / Druck" v={`${FAB.mask} / ${FAB.silk}`} />
            <Fact k="Min. Bahn" v={`${FAB.minTrace} mm`} />
            <Fact k="Isolation" v={FAB.isolation} />
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Vor dem Auftrag Gerber in einem Viewer prüfen. Den Isolationsschlitz
            nicht schließen — dort liegt die Trennung 230 V / SELV.
          </p>
          <Button
            variant="outline"
            className="mt-4 min-h-11"
            onClick={() => downloadSvg(on)}
          >
            <Download />
            Ansicht als SVG
          </Button>
        </article>
      </section>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-xs text-faint">{k}</dt>
      <dd className="mt-0.5">{v}</dd>
    </div>
  );
}

function mimeFor(name: string) {
  if (name.endsWith(".csv")) return "text/csv";
  if (name.endsWith(".svg")) return "image/svg+xml";
  return "text/plain";
}

function downloadSvg(on: Record<LayerKey, boolean>) {
  const traces = tracesOnBoard();
  const pours = poursOnBoard();
  const pads = allPads();
  const holes = mountingHoles();
  const slot = slotRect();
  const silk = PCB_PARTS.map((p) => {
    const o = toBoard(p.x, p.z);
    return `<text x="${o.x + 1.4}" y="${o.y - 2.2}" font-size="2.1" fill="#e8e4d8">${esc(p.ref)}</text>`;
  }).join("");
  const top = on.top
    ? pours
        .map(
          (p) =>
            `<rect x="${p.x - p.w / 2}" y="${p.y - p.d / 2}" width="${p.w}" height="${p.d}" fill="#b56a2e" opacity="0.55"/>`,
        )
        .join("") +
      traces
        .map(
          (t) =>
            `<polyline points="${t.pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#c47a38" stroke-width="${t.w}" stroke-linecap="round" stroke-linejoin="round"/>`,
        )
        .join("") +
      pads
        .map((p) =>
          p.shape === "rect" && p.w && p.h
            ? `<rect x="${p.x - p.w / 2}" y="${p.y - p.h / 2}" width="${p.w}" height="${p.h}" fill="#d4924a"/>`
            : `<circle cx="${p.x}" cy="${p.y}" r="${p.d / 2}" fill="#d4924a"/>`,
        )
        .join("")
    : "";
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FAB.w} ${FAB.h}" width="${FAB.w}mm" height="${FAB.h}mm">
  <rect width="${FAB.w}" height="${FAB.h}" fill="#163828"/>
  ${on.bot ? `<rect x="2" y="2" width="${slot.x - 3.2}" height="${FAB.h - 4}" fill="#6a4018"/><rect x="${slot.x + slot.w + 1.2}" y="2" width="${FAB.w - slot.x - slot.w - 3.2}" height="${FAB.h - 4}" fill="#6a4018"/>` : ""}
  ${top}
  <rect x="${slot.x}" y="${slot.y}" width="${slot.w}" height="${slot.h}" fill="#101114"/>
  ${on.silk ? `<g font-family="monospace">${silk}<text x="8" y="${FAB.h - 5}" font-size="3.2" fill="#e8e4d8">${FAB.name} REV ${FAB.rev}</text></g>` : ""}
  ${on.drill ? pads.filter((p) => p.drill > 0.15).map((p) => `<circle cx="${p.x}" cy="${p.y}" r="${p.drill / 2}" fill="#101114"/>`).join("") + holes.map((h) => `<circle cx="${h.x}" cy="${h.y}" r="${h.d / 2}" fill="#101114"/>`).join("") : ""}
</svg>`;
  downloadText(svg, `${FAB.name}-ansicht.svg`, "image/svg+xml");
}

function esc(s: string) {
  return s.replace(/&/g, "&").replace(/</g, "<");
}
