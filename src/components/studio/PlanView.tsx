import { SHEETS } from "@/lib/design";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  CapV,
  DiodeH,
  Dot,
  FuseH,
  Gnd,
  Hit,
  IcBox,
  IndH,
  Jack,
  Nmos,
  Npn,
  Paper,
  Ref,
  ResH,
  ResV,
  Tag,
  Wire,
} from "./schematic/kit";

export function PlanView() {
  const sheet = useStudio((s) => s.sheet);
  const setSheet = useStudio((s) => s.setSheet);

  return (
    <div className="space-y-3">
      <div className="no-print flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Stromlaufplan · IEC / DIN
          </p>
          <h2 className="text-lg font-medium">Schaltplan mit allen Bauteilen</h2>
        </div>
        <div className="flex flex-wrap gap-1">
          {SHEETS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSheet(s.id)}
              className={cn(
                "min-h-10 rounded-md px-3 text-sm",
                sheet === s.id ? "bg-raised text-fg" : "text-muted hover:bg-raised",
              )}
            >
              {s.no} {s.title}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl bg-paper shadow-[var(--shadow-border)]">
        {sheet === "pri" && <SheetPri />}
        {sheet === "sec" && <SheetSec />}
        {sheet === "rails" && <SheetRails />}
        {sheet === "lab" && <SheetLab />}
        {sheet === "meter" && <SheetMeter />}
      </div>
    </div>
  );
}

function SheetPri() {
  return (
    <Paper no="01" title="Primärseite, EMV-Filter und Sperrwandler">
      <rect x="24" y="28" width="1432" height="26" fill="#f6e8e4" stroke="#7a2f2f" />
      <Tag x="36" y="46" t="NETZSPANNUNGSEBENE  ·  Schutzklasse I  ·  PE am Metallgehäuse  ·  8 mm zur SELV-Seite" />

      <Tag x={36} y={88} t="L 230 V" />
      <Tag x={36} y={208} t="N" />
      <Tag x={36} y={308} t="PE" />

      <Wire d="M90 84 H128" pri />
      <FuseH x={128} y={84} id="f1" ref="F1" val="2 A T / 250 V" />
      <Wire d="M168 84 H240" pri />
      <ResH x={240} y={84} id="ntc1" ref="NTC1" val="10 Ω NTC" />
      <Wire d="M276 84 H360" pri />
      <Wire d="M90 204 H360" pri />
      <Wire d="M90 304 H700" />

      <Hit id="mov1">
        <path d="M220 84 V128" />
        <rect x="204" y="128" width="32" height="36" />
        <line x1="204" y1="128" x2="236" y2="164" />
        <path d="M220 164 V204" />
        <Ref x={220} y={122} t="MOV1" />
        <Tag x={220} y={186} t="S14K275" anchor="middle" small />
      </Hit>

      <CapV x={300} y={84} id="c1" ref="C1" val="100 nF X2" />
      <Wire d="M300 92 V204" pri />

      <Hit id="l1">
        <path d="M360 84 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0" />
        <path d="M360 204 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0" />
        <line x1="388" y1="98" x2="388" y2="190" strokeDasharray="3 3" />
        <Ref x={388} y={74} t="L1 WE-CMB" />
        <Tag x={388} y={228} t="2 × 10 mH" anchor="middle" small />
      </Hit>

      <Wire d="M416 84 H500" pri />
      <Wire d="M416 204 H500" pri />

      <Hit id="cy1">
        <path d="M470 84 V250" />
        <line x1="462" y1="250" x2="478" y2="250" />
        <line x1="462" y1="258" x2="478" y2="258" />
        <path d="M470 258 V304" />
        <Ref x={486} y={252} t="CY1" anchor="start" />
      </Hit>
      <Hit id="cy1">
        <path d="M494 204 V250" />
        <line x1="486" y1="250" x2="502" y2="250" />
        <line x1="486" y1="258" x2="502" y2="258" />
        <path d="M494 258 V304" />
        <Ref x={510} y={268} t="CY2 2n2 Y2" anchor="start" />
      </Hit>

      <Hit id="br1">
        <rect x="500" y="64" width="88" height="156" />
        <text x="544" y="92" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fontWeight="600" fill="#1c1d18">
          BR1
        </text>
        <text x="544" y="112" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#4a4c44">
          GBU406
        </text>
        <text x="544" y="136" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#4a4c44">
          600 V / 4 A
        </text>
        <text x="544" y="168" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#4a4c44">
          +           −
        </text>
      </Hit>

      <Wire d="M588 84 H868" pri />
      <Tag x={620} y={76} t="+390 V DC (PFC)" />
      <Wire d="M588 204 H760" pri />
      <Tag x={620} y={196} t="GND_PRI" />

      <CapV x={660} y={84} id="c2" ref="C2" val="120 µF / 400 V" polar />
      <Wire d="M660 92 V204" pri />
      <ResV x={720} y={110} id="r1" ref="R1" val="100 k / 2 W" />
      <Wire d="M720 84 V110" pri />
      <Wire d="M720 146 V204" pri />
      <Dot x={660} y={84} />
      <Dot x={720} y={84} />
      <Dot x={660} y={204} />

      <Hit id="t1">
        <line x1="900" y1="56" x2="900" y2="400" />
        <line x1="912" y1="56" x2="912" y2="400" />
        <path d="M868 80 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20" />
        <path d="M944 90 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20" />
        <path d="M944 200 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20" />
        <path d="M944 290 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20" />
        <Ref x={906} y={48} t="T1 EFD30" />
        <Tag x={906} y={418} t="TIW · 3 kVrms · Fräsnut" anchor="middle" small />
      </Hit>

      <Wire d="M868 160 H800" pri />
      <Nmos x={766} y={204} id="q1" ref="Q1" val="STP10NK60Z" />
      <Wire d="M800 160 V188" pri />
      <ResV x={800} y={236} id="rs" ref="Rs" val="0,33 Ω / 2 W" />
      <Wire d="M800 272 V320 H660" pri />
      <Wire d="M660 204 V320" pri />
      <Gnd x={660} y={320} />

      <Hit id="snub">
        <path d="M830 84 V50 H1000 V80" />
        <polygon points="1000,80 1000,70 1014,80" fill="#1c1d18" />
        <rect x="1020" y="72" width="40" height="16" />
        <line x1="1060" y1="80" x2="1090" y2="80" />
        <line x1="1090" y1="66" x2="1090" y2="94" />
        <line x1="1098" y1="66" x2="1098" y2="94" />
        <path d="M1098 80 V160 H868" />
        <Ref x={1050} y={60} t="RCD" />
        <Tag x={1050} y={112} t="UF4007 · 100 k · 2n2/1kV" anchor="middle" small />
      </Hit>

      <IcBox
        id="ic1"
        x={1040}
        y={460}
        w={160}
        h={150}
        name="IC1 UC3843B"
        pinsL={["2 FB", "3 CS", "4 RT/CT"]}
        pinsR={["7 VCC", "6 OUT", "5 GND"]}
      />
      <Wire d="M1216 528 H800" pri />
      <Tag x={860} y={520} t="RG 10 Ω → Gate Q1" />
      <Wire d="M1024 492 H840 V320" pri />
      <Tag x={850} y={480} t="Cs von Rs" />
      <CapV x={1260} y={492} id="ic1" ref="Cvcc" val="47 µF / 50 V" polar />
      <Wire d="M1260 500 V680 H1216" />
      <Wire d="M1216 492 H1320 V84 H830" pri />
      <Tag x={1240} y={76} t="Rstart 100 k" />

      <Hit id="ok1">
        <rect x="1040" y="680" width="160" height="52" />
        <text x="1120" y="702" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fontWeight="600" fill="#1c1d18">
          OK1 LTV-817
        </text>
        <text x="1120" y="720" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#4a4c44">
          FB von TL431 Blatt 02
        </text>
      </Hit>
      <Wire d="M1040 698 H1024 V492" />

      <Tag x={960} y={108} t="Ns1 +15 V → Blatt 02" />
      <Tag x={960} y={218} t="Ns2 −15 V" />
      <Tag x={960} y={308} t="Ns3 +35 V" />

      <Hit id="x1">
        <rect x="36" y="360" width="168" height="64" />
        <text x="120" y="388" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fontWeight="600" fill="#1c1d18">
          X1 IEC C14
        </text>
        <text x="120" y="408" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#4a4c44">
          Schurter · PE Gehäuse
        </text>
      </Hit>
      <Wire d="M90 360 V304" />
      <Gnd x={700} y={304} />
      <Tag x={714} y={324} t="PE" />

      <text x="36" y="800" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Current-Mode: Pin 3 misst den Peak an Rs. Aux-Wicklung speist VCC nach dem Anlauf über Rstart. UVLO im UC3843B.
      </text>
      <text x="36" y="824" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Sternpunkt GND_PRI am Minus von C2. Q1 auf Kühlblech. Unter T1 und OK1 Fräsnut, Kriechstrecke ≥ 8 mm.
      </text>
      <text x="36" y="848" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        EMV: X2 vor der Drossel, Y2 danach gegen PE. Gehäuse als Schirm, DIN EN 61000-6-3.
      </text>
    </Paper>
  );
}

function SheetSec() {
  return (
    <Paper no="02" title="Sekundärbusse +15 V, −15 V, +35 V">
      <rect x="24" y="28" width="1432" height="26" fill="#e4edf3" stroke="#2a4a62" />
      <Tag x="36" y="46" t="SELV  ·  gemeinsame Sekundärmasse  ·  keine Verbindung zu GND_PRI" />

      <Hit id="t1">
        <line x1="70" y1="80" x2="70" y2="780" />
        <line x1="82" y1="80" x2="82" y2="780" />
        <path d="M114 130 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24" />
        <path d="M114 340 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24" />
        <path d="M114 560 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24" />
        <Ref x={76} y={70} t="T1" />
      </Hit>

      <SecBus y={130} name="+15 V DC" id="d1" dref="D1" dval="MBR10100" l="L2 10 µH" c="C3 1000 µF / 35 V" />
      <SecBus y={340} name="−15 V DC" id="d2" dref="D2" dval="MBR10100" l="L3 10 µH" c="C5 1000 µF / 35 V" />
      <SecBus y={560} name="+35 V DC" id="d3" dref="D3" dval="MBR20100CT" l="L7 22 µH" c="C7 2200 µF / 50 V" />

      <IcBox
        id="u431"
        x={1120}
        y={150}
        w={150}
        h={110}
        name="IC6 TL431"
        pinsL={["KATH", "REF"]}
        pinsR={["ANODE"]}
      />
      <Hit id="ok1">
        <rect x="1120" y="290" width="150" height="48" />
        <text x="1195" y="320" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="12" fontWeight="600" fill="#1c1d18">
          OK1 LED-Seite
        </text>
      </Hit>
      <Tag x={1120} y={360} t="führt +35-V-Bus, Opto → Blatt 01" />
      <Tag x={160} y={840} t="LC nach jeder Wicklung. Restwelligkeit < 100 mVss. Schottky auf Kupferfläche oder Blech." />
    </Paper>
  );
}

function SecBus({
  y,
  name,
  id,
  dref,
  dval,
  l,
  c,
}: {
  y: number;
  name: string;
  id: string;
  dref: string;
  dval: string;
  l: string;
  c: string;
}) {
  return (
    <g>
      <Wire d={`M138 ${y} H210`} />
      <DiodeH x={210} y={y} id={id} ref={dref} val={dval} />
      <Wire d={`M226 ${y} H300`} />
      <IndH x={300} y={y} id="c3" ref={l.split(" ")[0] ?? "L"} val={l} />
      <Wire d={`M340 ${y} H720`} />
      <CapV x={460} y={y} id="c3" ref={c.split(" ")[0] ?? "C"} val={c} polar />
      <Wire d={`M460 ${y + 8} V${y + 70}`} />
      <Wire d={`M138 ${y + 64} H720`} />
      <Gnd x={400} y={y + 70} />
      <CapV x={560} y={y} id="c3" ref="MLCC" val="100 nF" />
      <Wire d={`M560 ${y + 8} V${y + 70}`} />
      <Tag x={740} y={y + 4} t={name} />
      <Dot x={460} y={y} />
    </g>
  );
}

function SheetRails() {
  return (
    <Paper no="03" title="Festspannungen · vier TPS5430">
      <rect x="24" y="28" width="1432" height="26" fill="#e4edf3" stroke="#2a4a62" />
      <Tag x="36" y="46" t="Uout = 1,221 V · (1 + Rtop / Rbot)   ·   Rbot = 10 kΩ   ·   500 kHz   ·   Catch-Diode MBRS340" />

      <RailCard x={40} y={80} id="ic2" title="IC2  TPS5430  Buck" out="+12 V / 1 A" bus="+15 V" rtop="88,7 kΩ" l="15 µH" />
      <RailCard x={760} y={80} id="ic4" title="IC4  TPS5430  Buck" out="+5 V / 1 A" bus="+15 V" rtop="30,9 kΩ" l="15 µH" />
      <RailCard x={40} y={470} id="ic3" title="IC3  TPS5430  invertierend" out="−12 V / 1 A" bus="+15 V" rtop="88,7 kΩ" l="22 µH" inv />
      <RailCard x={760} y={470} id="ic5" title="IC5  TPS5430  invertierend" out="−5 V / 1 A" bus="+15 V" rtop="30,9 kΩ" l="22 µH" inv />
    </Paper>
  );
}

function RailCard({
  x,
  y,
  id,
  title,
  out,
  bus,
  rtop,
  l,
  inv,
}: {
  x: number;
  y: number;
  id: string;
  title: string;
  out: string;
  bus: string;
  rtop: string;
  l: string;
  inv?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width="680" height="360" fill="#fbf7ee" stroke="#1c1d18" />
      <text x={x + 16} y={y + 28} fontFamily="IBM Plex Sans, sans-serif" fontSize="15" fontWeight="600" fill="#1c1d18">
        {title}
      </text>
      <Tag x={x + 16} y={y + 50} t={inv ? "GND-Pin des IC liegt auf der negativen Schiene" : "klassischer Tiefsetzsteller"} />

      <Tag x={x + 16} y={y + 90} t={bus} />
      <Wire d={`M${x + 70} ${y + 86} H${x + 130}`} />
      <IcBox
        id={id}
        x={x + 130}
        y={y + 70}
        w={170}
        h={130}
        name="TPS5430"
        pinsL={["VIN", "ENA", "GND"]}
        pinsR={["PH", "VSENSE", "BOOT"]}
      />
      <Wire d={`M${x + 316} ${y + 102} H${x + 360}`} />
      <IndH x={x + 360} y={y + 102} id={id} ref="L" val={l} />
      <Wire d={`M${x + 400} ${y + 102} H${x + 560}`} />
      <Tag x={x + 570} y={y + 106} t={out} />
      <CapV x={x + 470} y={y + 102} id={id} ref="Cout" val="220 µF" polar />
      <Wire d={`M${x + 470} ${y + 110} V${y + 230}`} />
      <Gnd x={x + 200} y={y + 230} />
      <Wire d={`M${x + 146} ${y + 218} V${y + 230} H${x + 470}`} />
      <ResV x={x + 520} y={y + 118} id={id} ref="Rtop" val={rtop} />
      <ResV x={x + 520} y={y + 168} id={id} ref="Rbot" val="10 kΩ" />
      <DiodeH x={x + 340} y={y + 180} id={id} ref="D" val="MBRS340" />
      <Wire d={`M${x + 316} ${y + 102} V${y + 180} H${x + 340}`} />
      <Wire d={`M${x + 356} ${y + 180} H${x + 200} V${y + 230}`} />
      <Tag x={x + 16} y={y + 280} t="Thermal Pad + 8 Vias auf ≥ 4 cm² Kupfer" />
      <Tag x={x + 16} y={y + 300} t={inv ? "Inverting Buck-Boost, Ausgang negativ gegen GND_SEK" : "η Ziel 90–94 %, Ripple < 100 mVss"} />
    </g>
  );
}

function SheetLab() {
  return (
    <Paper no="04" title="Universal 1…30 V / 3 A · Vorregler + Längsregler">
      <rect x="24" y="28" width="1432" height="26" fill="#f3ead8" stroke="#8a6230" />
      <Tag x="36" y="46" t="KRITISCH  ·  ohne Vorregler Pv = (35 − Uout) · I  →  Worst Case 102 W bei 1 V / 3 A" />

      <Tag x={40} y={100} t="+35 V Bus" />
      <Wire d="M120 96 H190" />
      <IcBox
        id="prereg"
        x={190}
        y={60}
        w={190}
        h={120}
        name="IC7 Tracking-Vorregler"
        pinsL={["VIN", "ENA"]}
        pinsR={["PH", "VSENSE"]}
      />
      <Wire d="M396 98 H460" />
      <IndH x={460} y={98} id="prereg" ref="L8" val="15 µH" />
      <Wire d="M500 98 H680" />
      <Tag x={690} y={102} t="Uvor = Uout + 3,5 V" />
      <CapV x={580} y={98} id="prereg" ref="C8" val="470 µF / 50 V" polar />
      <Wire d="M580 106 V200" />
      <Gnd x={580} y={200} />

      <Npn x={700} y={200} id="q2" ref="T1" val="BD249" />
      <Npn x={880} y={200} id="q2" ref="T2" val="BD249" />
      <Wire d="M680 98 H728 V172" />
      <Wire d="M680 98 H908 V172" />
      <ResV x={728} y={228} id="re" ref="R3" val="0,47 Ω / 5 W" />
      <ResV x={908} y={228} id="re" ref="R4" val="0,47 Ω / 5 W" />
      <Wire d="M728 264 H908" />
      <Wire d="M818 264 V320" />
      <Tag x={830} y={320} t="Ausgang 1…30 V / 3 A" />

      <Hit id="hs">
        <rect x="1120" y="60" width="300" height="220" />
        <text x="1270" y="92" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="14" fontWeight="600" fill="#1c1d18">
          K1 Kühlung
        </text>
        <text x="1270" y="122" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#4a4c44">
          Fischer SK 85
        </text>
        <text x="1270" y="146" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#4a4c44">
          12-V-Lüfter + Klixon
        </text>
        <text x="1270" y="178" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="12" fill="#1c1d18">
          Q2 und Q3 isoliert montiert
        </text>
        <text x="1270" y="204" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#4a4c44">
          Wärmeleitpaste, isolierte Pads
        </text>
        <text x="1270" y="228" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#4a4c44">
          Rth,K-A ≈ 0,45 K/W erzwungen
        </text>
      </Hit>

      <rect x="40" y="380" width="1380" height="200" fill="#fbf7ee" stroke="#1c1d18" />
      <text x="56" y="410" fontFamily="IBM Plex Sans, sans-serif" fontSize="15" fontWeight="600" fill="#1c1d18">
        Conrad- / H-Tronic-Regelkarte bleibt
      </text>
      <text x="56" y="440" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Die Original-Endstufe bleibt: T1/T2 = 2× BD249, T3 = BD136, IC1 = LM723.
        Stromgrenze über R7 = 0,15 Ω und POT6. Emitter R3/R4 = 0,47 Ω / 5 W sind schon im Kit.
      </text>
      <text x="56" y="464" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Anleitung S. 9–10: Pv max. 20 W, Dauerkurzschluss nur mit 0,6 K/W. Ohne Vorregler 102 W.
      </text>
      <text x="56" y="500" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Neu: Tracking-Vorregler hält ΔU ≈ 3,5 V → 10,5 W. Kit-Trafo, BR1 und F 4 A bleiben ungenutzt (DC vom Flyback).
      </text>
      <text x="56" y="536" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Analogausgang bleibt rauscharm (unter 2 mV). Deshalb Hybrid: Schaltregler für Festspannungen, HB 533 für Labor.
      </text>

      <text x="40" y="640" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Formel:  Tj = Tu + Pv,je · (Rth,J-C + Rth,C-K) + Pv,ges · Rth,K-A  ≤ 125 °C
      </text>
      <text x="40" y="668" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Rechenblatt und Lastpunkt-Schieber stehen unter Thermik. Worst Case der Prüfung ist 1 V / 3 A, nicht 30 V.
      </text>
    </Paper>
  );
}

function SheetMeter() {
  const cols = [
    { x: 70, name: "+12 V" },
    { x: 350, name: "−12 V" },
    { x: 630, name: "+5 V" },
    { x: 910, name: "−5 V" },
    { x: 1190, name: "1…30 V" },
  ];
  return (
    <Paper no="05" title="Messtechnik, Shunts und Laborbuchsen">
      <rect x="24" y="28" width="1432" height="26" fill="#e5efe8" stroke="#3d6b4f" />
      <Tag x="36" y="46" t="Shunt in der Rückleitung  ·  Voltmeter-Sense an der Buchse  ·  fünf Kanäle" />

      {cols.map((c) => (
        <g key={c.name}>
          <Tag x={c.x} y={90} t={`vom Regler ${c.name}`} />
          <Wire d={`M${c.x + 50} 104 V155`} />
          <Jack x={c.x + 50} y={166} label={`${c.name} +`} id="disp" />
          <Wire d={`M${c.x + 50} 176 V230 H${c.x + 110}`} />
          <Jack x={c.x + 110} y={240} label="GND" id="sh12" />
          <Hit id="sh12">
            <rect x={c.x + 94} y={258} width="32" height="16" />
            <Ref x={c.x + 110} y={252} t="Rsh" />
            <Tag x={c.x + 110} y={290} t="10 mΩ" anchor="middle" small />
          </Hit>
          <Wire d={`M${c.x + 110} 274 V320`} />
          <Gnd x={c.x + 110} y={320} />
          <Hit id="disp">
            <rect x={c.x} y={380} width="210" height="72" />
            <text
              x={c.x + 105}
              y={410}
              textAnchor="middle"
              fontFamily="IBM Plex Sans, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill="#1c1d18"
            >
              DSN-VC288
            </text>
            <text
              x={c.x + 105}
              y={432}
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="11"
              fill="#4a4c44"
            >
              V an +Buchse · A über Rsh
            </text>
          </Hit>
        </g>
      ))}

      <text x="40" y="520" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Displays intern aus der jeweiligen Schiene oder aus +12 V speisen. Eigenstrom nicht durch den Last-Shunt führen.
      </text>
      <text x="40" y="548" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Kelvin-Sinn: Spannungsmessung nach dem Shunt, direkt an der Buchse. Sonst liegt der 10-mΩ-Abfall in der Anzeige.
      </text>
      <text x="40" y="576" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#1c1d18">
        Kurzschlussfest: TPS5430 intern begrenzt, Längsregler über die Regelkarte. Alle Buchsen SELV, PE nur am Gehäuse.
      </text>
    </Paper>
  );
}
