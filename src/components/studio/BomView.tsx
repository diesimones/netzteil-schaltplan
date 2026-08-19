import { PARTS } from "@/lib/design";
import { useStudio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const ZONE: Record<string, string> = {
  pri: "Primär",
  iso: "Isolation",
  sec: "SELV",
  lab: "Labor",
  meter: "Messung",
  mech: "Mechanik",
};

export function BomView() {
  const select = useStudio((s) => s.select);
  const setView = useStudio((s) => s.setView);
  const setSheet = useStudio((s) => s.setSheet);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-5">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          Stückliste · {PARTS.length} Positionen
        </p>
        <h2 className="text-2xl font-medium tracking-tight">Bill of Materials</h2>
        <p className="mt-2 text-sm text-muted">
          Zeile antippen öffnet den Schaltplan am Bauteil.
        </p>
      </header>
      <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-xl text-left text-sm">
          <thead className="border-b border-line font-mono text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Ref</th>
              <th className="px-4 py-3 font-medium">Bauteil</th>
              <th className="px-4 py-3 font-medium">Wert</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Hersteller</th>
              <th className="px-4 py-3 font-medium">Zone</th>
            </tr>
          </thead>
          <tbody>
            {PARTS.map((p) => (
              <tr
                key={p.id}
                className="cursor-pointer border-b border-line last:border-0 hover:bg-raised"
                onClick={() => {
                  select(p.id);
                  setSheet(p.sheet);
                  setView("plan");
                }}
              >
                <td className="px-4 py-3 font-mono text-xs">{p.ref}</td>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{p.value}</td>
                <td className="hidden px-4 py-3 text-muted md:table-cell">{p.maker}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={
                      p.zone === "pri" ? "pri" : p.zone === "lab" ? "warn" : "selv"
                    }
                  >
                    {ZONE[p.zone]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
