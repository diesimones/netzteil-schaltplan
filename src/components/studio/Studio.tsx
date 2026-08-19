import {
  Activity,
  Box,
  BoxSelect,
  CircuitBoard,
  ClipboardList,
  Flame,
  Gauge,
  LayoutPanelTop,
  FileDown,
  Rotate3d,
  Shield,
  Medal,
  ShoppingCart,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PROJECT, type ViewId } from "@/lib/design";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AuftragView } from "./AuftragView";
import { BlockView } from "./BlockView";
import { BomView } from "./BomView";
import { BronzeView } from "./BronzeView";
import { CaseView } from "./CaseView";
import { EfficiencyView } from "./EfficiencyView";
import { FabView } from "./FabView";
import { EinkaufView } from "./EinkaufView";
import { Inspector } from "./Inspector";
import { PcbView } from "./PcbView";
import { PlanView } from "./PlanView";
import { Sim3dView } from "./Sim3dView";
import { SimView } from "./SimView";
import { ThermalView } from "./ThermalView";

const NAV: { id: ViewId; label: string; hint: string; icon: typeof Gauge }[] = [
  { id: "auftrag", label: "Auftrag", hint: "Vorgaben", icon: ClipboardList },
  { id: "block", label: "Blockbild", hint: "Topologie", icon: LayoutPanelTop },
  { id: "plan", label: "Schaltplan", hint: "5 Blätter", icon: CircuitBoard },
  { id: "pcb", label: "Platine", hint: "3D", icon: Box },
  { id: "fab", label: "Fertigung", hint: "Gerber", icon: FileDown },
  { id: "case", label: "Gehäuse", hint: "EMV", icon: Shield },
  { id: "sim", label: "Betrieb", hint: "2D", icon: Activity },
  { id: "sim3d", label: "3D-Wärme", hint: "Strom", icon: Rotate3d },
  { id: "thermik", label: "Thermik", hint: "Kühlung", icon: Flame },
  { id: "eta", label: "Wirkungsgrad", hint: "80 PLUS", icon: Gauge },
  { id: "bronze", label: "Bronze+", hint: "25/50/100", icon: Medal },
  { id: "bom", label: "Stückliste", hint: "BOM", icon: BoxSelect },
  { id: "einkauf", label: "Einkauf", hint: "Preise", icon: ShoppingCart },
];

export function Studio() {
  const view = useStudio((s) => s.view);
  const setView = useStudio((s) => s.setView);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="no-print flex items-center gap-3 border-b border-line px-4 py-3 md:px-6">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            {PROJECT.code} · {PROJECT.exam}
          </p>
          <h1 className="truncate text-base font-medium tracking-tight md:text-lg">
            {PROJECT.title}
          </h1>
        </div>
        <AuthSlot />
      </header>

      <nav className="no-print border-b border-line">
        <div className="flex flex-nowrap gap-1 overflow-x-auto px-2 py-2 md:px-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const on = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150",
                  on ? "bg-raised text-fg" : "text-muted hover:bg-raised hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                <span className="font-medium">{item.label}</span>
                <span className="hidden font-mono text-xs text-faint sm:inline">
                  {item.hint}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <main className="min-w-0 flex-1 p-3 md:p-6">
          {view === "auftrag" && <AuftragView />}
          {view === "block" && <BlockView />}
          {view === "plan" && <PlanView />}
          {view === "pcb" && <PcbView />}
          {view === "fab" && <FabView />}
          {view === "case" && <CaseView />}
          {view === "sim" && <SimView />}
          {view === "sim3d" && <Sim3dView />}
          {view === "thermik" && <ThermalView />}
          {view === "eta" && <EfficiencyView />}
          {view === "bronze" && <BronzeView />}
          {view === "bom" && <BomView />}
          {view === "einkauf" && <EinkaufView />}
        </main>
        <Inspector />
      </div>
    </div>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-raised" />;
  }
  return (
    <>
      <SignedOut>
        <a
          href="/login"
          className="hidden h-10 items-center rounded-md px-3 text-sm text-muted hover:text-fg sm:inline-flex"
        >
          Anmelden
        </a>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted sm:inline">
            {user?.displayName}
          </span>
          <UserButton />
        </div>
      </SignedIn>
    </>
  );
}
