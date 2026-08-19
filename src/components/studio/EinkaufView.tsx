import { Badge } from "@/components/ui/badge";
import {
  CASE_OFFERS,
  PCB_OFFERS,
  SHOP_ASOF,
  SHOP_ITEMS,
  itemTotal,
  shopByVendor,
  shopCsv,
  shopPartsSum,
  type FabOffer,
} from "@/lib/shop";

const GROUP: Record<string, string> = {
  kit: "Bausatz",
  pri: "Primär",
  sec: "SELV",
  rails: "Wandler",
  mech: "Mechanik",
  front: "Front",
  passiv: "Kleinmaterial",
};

function money(n: number) {
  return n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

function downloadCsv() {
  const blob = new Blob([shopCsv()], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `IFT-NT-2026-einkauf-${SHOP_ASOF.replace(/\./g, "")}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function EinkaufView() {
  const parts = shopPartsSum();
  const vendors = shopByVendor();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          Einkauf · Stand {SHOP_ASOF} · Europa, bevorzugt DE
        </p>
        <h2 className="text-2xl font-medium tracking-tight">Günstigste Beschaffung</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Teile über deutsche Versandhändler, Platine und Gehäuse in der EU.
          Preise sind geprüft oder aus den öffentlichen Rechnern der Häuser
          hochgerechnet — vor der Bestellung den Link öffnen und den Tagespreis
          bestätigen. China (JLCPCB) wäre billiger, fällt wegen Zoll und der
          Vorgabe Europa raus.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <SumCard title="Bauteile" value={money(parts)} hint={`${SHOP_ITEMS.length} Positionen, brutto`} />
        <SumCard title="Platine 3 Stück" value="ca. 91 €" hint="AISLER Rheine, netto" />
        <SumCard title="Gehäuse 1 Stück" value="ca. 95–150 €" hint="Laserhub, Al 1,5 mm" />
      </div>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-medium">Warenkorb nach Händler</h3>
            <p className="mt-1 text-sm text-muted">
              Eine Bestellung je Shop spart Versand. Conrad nur für Kit und
              Kühlkörper, Rest Reichelt.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadCsv}
            className="h-11 rounded-md bg-raised px-4 text-sm font-medium"
          >
            CSV laden
          </button>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {vendors.map(([name, items]) => {
            const sum = items.reduce((s, i) => s + itemTotal(i), 0);
            return (
              <li key={name} className="rounded-lg bg-raised p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium">{name}</p>
                  <p className="font-mono text-sm">{money(sum)}</p>
                </div>
                <p className="mt-1 font-mono text-xs text-faint">{items.length} Zeilen</p>
                <ul className="mt-2 space-y-0.5 text-sm text-muted">
                  {items.slice(0, 4).map((i) => (
                    <li key={i.id}>
                      {i.qty}× {i.ref}
                    </li>
                  ))}
                  {items.length > 4 && <li>… +{items.length - 4}</li>}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-line font-mono text-xs text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Ref</th>
              <th className="px-3 py-3 font-medium">Teil</th>
              <th className="hidden px-3 py-3 font-medium md:table-cell">Bestellnr.</th>
              <th className="px-3 py-3 font-medium">Stk</th>
              <th className="px-3 py-3 font-medium">Summe</th>
              <th className="px-3 py-3 font-medium">Shop</th>
            </tr>
          </thead>
          <tbody>
            {SHOP_ITEMS.map((it) => (
              <tr key={it.id} className="border-b border-line last:border-0">
                <td className="px-3 py-2.5 font-mono text-xs">{it.ref}</td>
                <td className="px-3 py-2.5">
                  <p>{it.name}</p>
                  <p className="text-xs text-faint">
                    <Badge tone="neutral">{GROUP[it.group]}</Badge>
                    {it.note ? `  ${it.note}` : ""}
                  </p>
                </td>
                <td className="hidden px-3 py-2.5 font-mono text-xs text-muted md:table-cell">
                  {it.mpn}
                </td>
                <td className="px-3 py-2.5 tabular-nums">{it.qty}</td>
                <td className="px-3 py-2.5 tabular-nums">{money(itemTotal(it))}</td>
                <td className="px-3 py-2.5">
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline decoration-line underline-offset-2 hover:text-fg"
                  >
                    {it.vendor}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-3 py-3 font-medium" colSpan={4}>
                Bauteile brutto
              </td>
              <td className="px-3 py-3 font-mono">{money(parts)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-lg font-medium">Leiterplatte ätzen — fünf Häuser</h3>
        <p className="mt-1 text-sm text-muted">
          IFT-NT-2026, 248 × 158 mm, 2 Lagen, 35 µm, HASL, Isolationsschlitz.
          Gerber aus dem Tab Fertigung. Sortiert nach erwartetem Preis.
        </p>
        <OfferTable offers={PCB_OFFERS} />
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-lg font-medium">Gehäuse blechen — fünf Häuser</h3>
        <p className="mt-1 text-sm text-muted">
          Al 1,5 mm EN AW-5754, 280 × 200 × 88 mm, DXF Rev. D aus dem Tab
          Gehäuse. Günstig ist Zuschnitt + lokale Kantung, nicht der
          Komplettkasten bei Xometry.
        </p>
        <OfferTable offers={CASE_OFFERS} />
      </section>

      <p className="text-xs leading-relaxed text-muted">
        STP10NK60Z bei Reichelt 1,35 € inkl. (Lager). HB 533 bei Conrad 26,04 €
        zzgl. MwSt. AISLER-Preis aus der öffentlichen Flächenformel. Alle
        anderen Zeilen sind Tagesrichtwerte {SHOP_ASOF}. Kein China, keine
        Zölle.
      </p>
    </div>
  );
}

function SumCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">{title}</p>
      <p className="mt-1 text-xl font-medium tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-faint">{hint}</p>
    </div>
  );
}

function OfferTable({ offers }: { offers: FabOffer[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="font-mono text-xs text-muted">
          <tr>
            <th className="py-2 pr-3 font-medium">#</th>
            <th className="py-2 pr-3 font-medium">Haus</th>
            <th className="py-2 pr-3 font-medium">Preis</th>
            <th className="hidden py-2 pr-3 font-medium md:table-cell">Zeit</th>
            <th className="py-2 font-medium">Warum</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((o, i) => (
            <tr key={o.id} className="border-t border-line align-top">
              <td className="py-3 pr-3 font-mono text-xs text-faint">{i + 1}</td>
              <td className="py-3 pr-3">
                <a href={o.url} target="_blank" rel="noreferrer" className="font-medium underline decoration-line underline-offset-2">
                  {o.name}
                </a>
                <p className="text-xs text-faint">
                  {o.city} · {o.country} · {o.qty}
                </p>
              </td>
              <td className="py-3 pr-3 tabular-nums">{o.price}</td>
              <td className="hidden py-3 pr-3 text-muted md:table-cell">{o.lead}</td>
              <td className="py-3 text-muted">
                {o.why}
                <span className="block text-xs text-faint">{o.note}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
