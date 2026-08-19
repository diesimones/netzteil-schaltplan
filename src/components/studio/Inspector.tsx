import { X } from "lucide-react";
import { BLOCKS, PARTS, partById } from "@/lib/design";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Inspector() {
  const selected = useStudio((s) => s.selected);
  const select = useStudio((s) => s.select);
  const setView = useStudio((s) => s.setView);
  const setSheet = useStudio((s) => s.setSheet);

  const part = selected ? partById(selected) : null;
  const block = selected ? BLOCKS.find((b) => b.id === selected) : null;
    const related = block ? PARTS.filter((p) => (block.parts as readonly string[]).includes(p.id)) : [];

  if (!part && !block) {
    return (
      <aside className="no-print hidden w-80 shrink-0 border-l border-line p-5 xl:block">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          Bauteil
        </p>
        <h2 className="mt-2 text-lg font-medium">Nichts gewählt</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Tippe im Blockschaltbild oder Schaltplan auf ein Feld, um Referenz,
          Wert und Rolle zu sehen.
        </p>
      </aside>
    );
  }

  const title = part?.ref ?? block?.title;
  const zone = part?.zone ?? block?.zone;

  return (
    <aside className="no-print border-t border-line p-4 lg:w-80 lg:shrink-0 lg:border-t-0 lg:border-l lg:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            {part ? "Bauteil" : "Funktionsblock"}
          </p>
          <h2 className="mt-1 text-lg font-medium tracking-tight">{title}</h2>
        </div>
        <Button
          variant="quiet"
          size="icon"
          aria-label="Schließen"
          onClick={() => select(null)}
        >
          <X />
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {zone && (
          <Badge tone={zone === "pri" ? "pri" : zone === "lab" ? "warn" : "selv"}>
            {zoneLabel(zone)}
          </Badge>
        )}
        {part && <Badge>{part.maker}</Badge>}
      </div>

      {part && (
        <dl className="mt-4 space-y-3 text-sm">
          <Row k="Bezeichnung" v={part.name} />
          <Row k="Wert" v={part.value} mono />
          <Row k="Funktion" v={part.role} />
          <Row k="Blatt" v={sheetName(part.sheet)} />
        </dl>
      )}

      {block && (
        <>
          <p className="mt-4 text-sm leading-relaxed text-muted">{block.detail}</p>
          <p className="mt-3 font-mono text-xs text-faint">Ausgang {block.out}</p>
          <ul className="mt-4 space-y-2">
            {related.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => select(p.id)}
                  className="flex w-full items-baseline justify-between gap-2 rounded-md px-2 py-2 text-left hover:bg-raised"
                >
                  <span className="font-mono text-xs text-muted">{p.ref}</span>
                  <span className="truncate text-sm">{p.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {(part || block) && (
        <Button
          variant="outline"
          className="mt-5 w-full"
          onClick={() => {
            const sheet = part?.sheet ?? related[0]?.sheet ?? "pri";
            setSheet(sheet);
            setView("plan");
          }}
        >
          Im Schaltplan zeigen
        </Button>
      )}
    </aside>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-xs text-faint">{k}</dt>
      <dd className={mono ? "mt-0.5 font-mono text-sm" : "mt-0.5"}>{v}</dd>
    </div>
  );
}

function zoneLabel(z: string) {
  if (z === "pri") return "Primär 230 V";
  if (z === "iso") return "Isolation";
  if (z === "sec") return "SELV";
  if (z === "lab") return "Längsregler";
  if (z === "meter") return "Messung";
  return "Mechanik";
}

function sheetName(s: string) {
  const map: Record<string, string> = {
    pri: "01 Primärseite",
    sec: "02 Sekundärbusse",
    rails: "03 Festspannungen",
    lab: "04 Universal",
    meter: "05 Messtechnik",
  };
  return map[s] ?? s;
}
