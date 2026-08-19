import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Gauge, c as CircuitBoard, i as LayoutPanelTop, o as Flame, r as SquareDashed, s as ClipboardList, t as X } from "../_libs/lucide-react.mjs";
import { a as signOut, n as authClient, r as cn, t as Button } from "./button-D5-kd2Kw.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as ReferenceLine, c as Tooltip, i as CartesianGrid, n as YAxis, o as Bar, r as XAxis, s as ResponsiveContainer, t as BarChart } from "../_libs/recharts+[...].mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-G14_A0xq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
var PROJECT = {
	title: "Multispannungs-Labornetzgerät",
	short: "IFT Meister Netzteil",
	code: "IFT-NT-2026",
	exam: "Meisterprüfung Informationstechniker",
	norm: "DIN EN 62368-1 / DIN EN 61000-6-3",
	vin: "230 V AC ±10 %, 50 Hz",
	topology: "Sperrwandler + DC-DC + Längsregler"
};
var RAILS = [
	{
		id: "p12",
		label: "+12 V",
		v: 12,
		i: 1,
		sign: 1,
		kind: "buck"
	},
	{
		id: "n12",
		label: "−12 V",
		v: 12,
		i: 1,
		sign: -1,
		kind: "inv"
	},
	{
		id: "p5",
		label: "+5 V",
		v: 5,
		i: 1,
		sign: 1,
		kind: "buck"
	},
	{
		id: "n5",
		label: "−5 V",
		v: 5,
		i: 1,
		sign: -1,
		kind: "inv"
	},
	{
		id: "lab",
		label: "1…30 V",
		v: 30,
		i: 3,
		sign: 1,
		kind: "linear"
	}
];
var PARTS = [
	{
		id: "x1",
		ref: "X1",
		name: "Kaltgerätebuchse mit PE",
		value: "IEC C14 / 10 A",
		maker: "Schurter 4301.1401",
		zone: "pri",
		sheet: "pri",
		block: "in",
		role: "Netzeingang, Schutzleiter an Gehäuse"
	},
	{
		id: "f1",
		ref: "F1",
		name: "Feinsicherung träge",
		value: "2,0 A T / 250 V",
		maker: "5×20 mm",
		zone: "pri",
		sheet: "pri",
		block: "in",
		role: "Primärschutz, träge wegen Elko-Ladestrom"
	},
	{
		id: "ntc1",
		ref: "NTC1",
		name: "Einschaltstrombegrenzer",
		value: "10 Ω",
		maker: "EPCOS B57237S0100M000",
		zone: "pri",
		sheet: "pri",
		block: "in",
		role: "Begrenzt den Stoßstrom von C2"
	},
	{
		id: "mov1",
		ref: "MOV1",
		name: "Varistor",
		value: "275 V AC",
		maker: "EPCOS S14K275",
		zone: "pri",
		sheet: "pri",
		block: "in",
		role: "Ableitung von Netztransienten"
	},
	{
		id: "c1",
		ref: "C1",
		name: "X2-Kondensator",
		value: "100 nF / 275 V AC",
		maker: "WIMA MKP-X2",
		zone: "pri",
		sheet: "pri",
		block: "emc",
		role: "Gegentakt-Entstörung"
	},
	{
		id: "cy1",
		ref: "CY1/CY2",
		name: "Y2-Kondensatoren",
		value: "2,2 nF / 250 V AC",
		maker: "WIMA MKP-Y2",
		zone: "pri",
		sheet: "pri",
		block: "emc",
		role: "Gleichtakt gegen PE, Sicherheitsklasse Y2"
	},
	{
		id: "l1",
		ref: "L1",
		name: "Gleichtaktdrossel",
		value: "2 × 10 mH",
		maker: "Würth WE-CMB",
		zone: "pri",
		sheet: "pri",
		block: "emc",
		role: "EMV DIN EN 61000-6-3"
	},
	{
		id: "br1",
		ref: "BR1",
		name: "Brückengleichrichter",
		value: "600 V / 4 A",
		maker: "GBU406",
		zone: "pri",
		sheet: "pri",
		block: "rect",
		role: "230 V~ → ~325 V="
	},
	{
		id: "c2",
		ref: "C2",
		name: "Zwischenkreis-Elko",
		value: "120 µF / 400 V",
		maker: "Panasonic ED, 105 °C",
		zone: "pri",
		sheet: "pri",
		block: "rect",
		role: "Puffer, Hold-up, Low-ESR"
	},
	{
		id: "r1",
		ref: "R1",
		name: "Entladewiderstand",
		value: "100 kΩ / 2 W",
		maker: "Metalloxid",
		zone: "pri",
		sheet: "pri",
		block: "rect",
		role: "Entlädt C2 nach Netztrennung"
	},
	{
		id: "ic1",
		ref: "IC1",
		name: "Current-Mode PWM",
		value: "UC3843B",
		maker: "Texas Instruments",
		zone: "pri",
		sheet: "pri",
		block: "fly",
		role: "65–100 kHz, UVLO, Strombegrenzung"
	},
	{
		id: "q1",
		ref: "Q1",
		name: "Power-MOSFET",
		value: "600 V / 0,75 Ω",
		maker: "ST STP10NK60Z",
		zone: "pri",
		sheet: "pri",
		block: "fly",
		role: "Primärschalter, Kühlblech nötig"
	},
	{
		id: "rs",
		ref: "Rs",
		name: "Strommess-Shunt",
		value: "0,33 Ω / 2 W",
		maker: "Draht / Metallband",
		zone: "pri",
		sheet: "pri",
		block: "fly",
		role: "Peak-Current-Mode an Pin 3"
	},
	{
		id: "snub",
		ref: "RCD",
		name: "RCD-Snubber",
		value: "UF4007 + 100 kΩ/3 W + 2,2 nF/1 kV",
		maker: "Diskret",
		zone: "pri",
		sheet: "pri",
		block: "fly",
		role: "Begrenzt Streuinduktivitäts-Spitzen an Q1"
	},
	{
		id: "t1",
		ref: "T1",
		name: "HF-Sperrwandler-Trafo",
		value: "EFD30, TIW, 3 kVrms",
		maker: "Eigenwicklung / Musterkern",
		zone: "iso",
		sheet: "pri",
		block: "fly",
		role: "Galvanische Trennung SELV, Ns1/Ns2/Ns3 + Aux"
	},
	{
		id: "ok1",
		ref: "OK1",
		name: "Optokoppler",
		value: "5 kVrms",
		maker: "Lite-On LTV-817",
		zone: "iso",
		sheet: "pri",
		block: "fly",
		role: "Feedback über Isolationsbarriere"
	},
	{
		id: "u431",
		ref: "IC6",
		name: "Präzisionsreferenz",
		value: "2,495 V",
		maker: "TI TL431",
		zone: "sec",
		sheet: "sec",
		block: "fly",
		role: "Regelt +35-V-Bus als Führungsgröße"
	},
	{
		id: "d1",
		ref: "D1",
		name: "Schottky +15 V",
		value: "100 V / 10 A",
		maker: "MBR10100",
		zone: "sec",
		sheet: "sec",
		block: "bus",
		role: "Sekundärgleichrichtung, VF ≈ 0,6 V"
	},
	{
		id: "d2",
		ref: "D2",
		name: "Schottky −15 V",
		value: "100 V / 10 A",
		maker: "MBR10100",
		zone: "sec",
		sheet: "sec",
		block: "bus",
		role: "Negative Wicklung, gemeinsame Masse"
	},
	{
		id: "d3",
		ref: "D3",
		name: "Schottky +35 V",
		value: "100 V / 20 A",
		maker: "MBR20100CT",
		zone: "sec",
		sheet: "sec",
		block: "bus",
		role: "Labor-Zwischenkreis, Kühlung nötig"
	},
	{
		id: "c3",
		ref: "C3/C5/C7",
		name: "Sieb-Elkos",
		value: "1000…2200 µF Low-ESR",
		maker: "Panasonic FR",
		zone: "sec",
		sheet: "sec",
		block: "bus",
		role: "Restwelligkeit < 100 mVss nach LC"
	},
	{
		id: "ic2",
		ref: "IC2",
		name: "Buck +12 V",
		value: "TPS5430 / 500 kHz",
		maker: "Texas Instruments",
		zone: "sec",
		sheet: "rails",
		block: "p12",
		role: "η ≈ 92 %, L = 15 µH, Rtop = 88,7 kΩ"
	},
	{
		id: "ic4",
		ref: "IC4",
		name: "Buck +5 V",
		value: "TPS5430 / 500 kHz",
		maker: "Texas Instruments",
		zone: "sec",
		sheet: "rails",
		block: "p5",
		role: "η ≈ 90 %, Rtop = 30,9 kΩ"
	},
	{
		id: "ic3",
		ref: "IC3",
		name: "Inverting −12 V",
		value: "TPS5430 inverted",
		maker: "Texas Instruments",
		zone: "sec",
		sheet: "rails",
		block: "n12",
		role: "Buck-Boost, GND am negativen Ausgang"
	},
	{
		id: "ic5",
		ref: "IC5",
		name: "Inverting −5 V",
		value: "TPS5430 inverted",
		maker: "Texas Instruments",
		zone: "sec",
		sheet: "rails",
		block: "n5",
		role: "Wie IC3, Teiler auf −5 V"
	},
	{
		id: "q2",
		ref: "Q2/Q3",
		name: "Längstransistoren",
		value: "2 × TIP35C",
		maker: "ST / ON",
		zone: "lab",
		sheet: "lab",
		block: "lab",
		role: "Parallel mit 0,1 Ω Emitterwiderständen"
	},
	{
		id: "re",
		ref: "Re1/Re2",
		name: "Symmetrierwiderstände",
		value: "0,1 Ω / 5 W",
		maker: "Draht",
		zone: "lab",
		sheet: "lab",
		block: "lab",
		role: "Gleichmäßige Stromaufteilung"
	},
	{
		id: "prereg",
		ref: "IC7",
		name: "Tracking-Vorregler",
		value: "TPS5430, Uout+3,5 V",
		maker: "Texas Instruments",
		zone: "lab",
		sheet: "lab",
		block: "lab",
		role: "Hält ΔU am Längsregler auf ca. 3,5 V"
	},
	{
		id: "hs",
		ref: "K1",
		name: "Kühlkörper + Lüfter",
		value: "SK 85 + 12 V / Klixon",
		maker: "Fischer Elektronik",
		zone: "mech",
		sheet: "lab",
		block: "lab",
		role: "Aktivkühlung, Thermoschalter"
	},
	{
		id: "sh12",
		ref: "Rsh",
		name: "Mess-Shunts",
		value: "10 mΩ / 1 W / 1 %",
		maker: "Isabellenhütte o. ä.",
		zone: "meter",
		sheet: "meter",
		block: "meter",
		role: "In der Rückleitung, Sense an der Buchse"
	},
	{
		id: "disp",
		ref: "M1–M5",
		name: "Panelmeter",
		value: "0–100 V / 0–10 A",
		maker: "DSN-VC288",
		zone: "meter",
		sheet: "meter",
		block: "meter",
		role: "Ein Dual-Display je Kanal"
	}
];
var BLOCKS = [
	{
		id: "in",
		title: "Netzeingang & Schutz",
		zone: "pri",
		parts: [
			"x1",
			"f1",
			"ntc1",
			"mov1"
		],
		out: "230 V AC",
		detail: "Kaltgerätebuchse, PE am Gehäuse, träge 2-A-Sicherung, NTC, Varistor."
	},
	{
		id: "emc",
		title: "EMV-Netzfilter",
		zone: "pri",
		parts: [
			"l1",
			"c1",
			"cy1"
		],
		out: "230 V AC gefiltert",
		detail: "WE-CMB 2×10 mH, X2 und Y2. Pflicht für DIN EN 61000-6-3."
	},
	{
		id: "rect",
		title: "Gleichrichtung",
		zone: "pri",
		parts: [
			"br1",
			"c2",
			"r1"
		],
		out: "≈ 325 V DC",
		detail: "GBU406 und 120 µF / 400 V. Udc = 230 · √2 ≈ 325 V."
	},
	{
		id: "fly",
		title: "Sperrwandler",
		zone: "iso",
		parts: [
			"ic1",
			"q1",
			"rs",
			"snub",
			"t1",
			"ok1",
			"u431"
		],
		out: "HF, galvanisch getrennt",
		detail: "UC3843B + STP10NK60Z, EFD30, Optokoppler + TL431. 65–100 kHz."
	},
	{
		id: "bus",
		title: "Sekundärbusse",
		zone: "sec",
		parts: [
			"d1",
			"d2",
			"d3",
			"c3"
		],
		out: "+15 V / −15 V / +35 V",
		detail: "Schottky + LC. Drei getrennte Wicklungen, gemeinsame SELV-Masse."
	},
	{
		id: "p12",
		title: "+12 V / 1 A",
		zone: "sec",
		parts: ["ic2"],
		out: "+12,0 V",
		detail: "TPS5430 Buck aus +15 V. η ≈ 92 %."
	},
	{
		id: "p5",
		title: "+5 V / 1 A",
		zone: "sec",
		parts: ["ic4"],
		out: "+5,0 V",
		detail: "TPS5430 Buck aus +15 V. η ≈ 90 %."
	},
	{
		id: "n12",
		title: "−12 V / 1 A",
		zone: "sec",
		parts: ["ic3"],
		out: "−12,0 V",
		detail: "TPS5430 inverting aus +15 V. η ≈ 88 %."
	},
	{
		id: "n5",
		title: "−5 V / 1 A",
		zone: "sec",
		parts: ["ic5"],
		out: "−5,0 V",
		detail: "TPS5430 inverting aus +15 V. η ≈ 86 %."
	},
	{
		id: "lab",
		title: "Universal 1…30 V / 3 A",
		zone: "lab",
		parts: [
			"prereg",
			"q2",
			"re",
			"hs"
		],
		out: "1–30 V, sauber",
		detail: "Conrad-Längsregler, Tracking-Vorregler, 2× TIP35C, Aktivkühlung."
	},
	{
		id: "meter",
		title: "Anzeige & Buchsen",
		zone: "meter",
		parts: ["sh12", "disp"],
		out: "5 Kanäle V/A",
		detail: "Shunt in der Rückleitung, Sense an der Buchse, fünf DSN-VC288."
	}
];
var SHEETS = [
	{
		id: "pri",
		no: "01",
		title: "Primärseite & Sperrwandler"
	},
	{
		id: "sec",
		no: "02",
		title: "Sekundärbusse +15 / −15 / +35 V"
	},
	{
		id: "rails",
		no: "03",
		title: "Festspannungen TPS5430"
	},
	{
		id: "lab",
		no: "04",
		title: "Universal-Längsregler"
	},
	{
		id: "meter",
		no: "05",
		title: "Messtechnik & Buchsen"
	}
];
var ETA = {
	front: .99,
	flyback: .93,
	buck12: .94,
	buck5: .93,
	inv12: .91,
	inv5: .89,
	prereg: .92,
	linearDrop: 3.5,
	biasW: .7
};
function clamp(n, a, b) {
	return Math.min(b, Math.max(a, n));
}
function switchingPower(load) {
	const p12 = 12 * load.p12;
	const p5 = 5 * load.p5;
	const n12 = 12 * load.n12;
	const n5 = 5 * load.n5;
	const pout = p12 + p5 + n12 + n5;
	const psec = p12 / ETA.buck12 + p5 / ETA.buck5 + n12 / ETA.inv12 + n5 / ETA.inv5;
	const pdc = psec / ETA.flyback;
	const pac = pdc / ETA.front + ETA.biasW;
	const eta = pout > 0 ? pout / pac : 0;
	return {
		pout,
		psec,
		pdc,
		pac,
		eta,
		etaPct: eta * 100
	};
}
function labPower(uOut, iOut, usePrereg) {
	const uBus = 35;
	const u = clamp(uOut, 1, 30);
	const i = clamp(iOut, 0, 3);
	const pout = u * i;
	if (i === 0) return {
		pout: 0,
		pLin: 0,
		pPre: 0,
		pBus: 0,
		pac: 0,
		eta: 0,
		uDrop: 0
	};
	if (usePrereg) {
		const uPre = Math.min(34.5, u + ETA.linearDrop);
		const pLin = Math.max(0, (uPre - u) * i);
		const pPreOut = uPre * i;
		const pBus = pPreOut / ETA.prereg;
		const pac = pBus / ETA.flyback / ETA.front;
		return {
			pout,
			pLin,
			pPre: pBus - pPreOut,
			pBus,
			pac,
			eta: pout / pac,
			uDrop: uPre - u
		};
	}
	const pLin = Math.max(0, (uBus - u) * i);
	const pBus = pout + pLin;
	const pac = pBus / ETA.flyback / ETA.front;
	return {
		pout,
		pLin,
		pPre: 0,
		pBus,
		pac,
		eta: pout / pac,
		uDrop: uBus - u
	};
}
function systemEta(load, labU, labI, usePrereg) {
	const sw = switchingPower(load);
	const lab = labPower(labU, labI * load.lab, usePrereg);
	const pout = sw.pout + lab.pout;
	const pac = sw.pac + lab.pac;
	const eta = pout > 0 ? pout / pac : 0;
	return {
		pout,
		pac,
		eta,
		etaPct: eta * 100,
		sw,
		lab
	};
}
function thermal(t) {
	const pv = Math.max(0, (t.uIn - t.uOut) * t.i);
	const n = Math.max(1, t.nQ);
	const pvEach = pv / n;
	const tj = t.tAmb + pvEach * (t.rthJC + t.rthCK) + pv * t.rthKA;
	return {
		pv,
		pvEach,
		tj,
		rthNeed: pv > 0 ? (125 - t.tAmb) / pv - (t.rthJC + t.rthCK) / n : Infinity,
		ok: tj <= 125
	};
}
function partById(id) {
	return PARTS.find((p) => p.id === id);
}
var NORMS = [
	{
		id: "62368",
		title: "DIN EN 62368-1",
		text: "Produktsicherheit. 8 mm Kriech-/Luftstrecke Primär–SELV, Fräsnut unter T1 und OK1, IP20, Schutzklasse I."
	},
	{
		id: "61000",
		title: "DIN EN 61000-6-3 / 6-1",
		text: "EMV Wohnbereich. Netzfilter, Y2/X2, geschirmtes Metallgehäuse, Ausgangs-LC < 100 mVss."
	},
	{
		id: "50678",
		title: "DIN EN 50678 / VDE 0701-0702",
		text: "Schutzleiter < 0,3 Ω, Isolation > 1 MΩ, Ersatzableitstrom vor Inbetriebnahme."
	},
	{
		id: "selvs",
		title: "SELV / PELV",
		text: "Alle Laborbuchsen Schutzkleinspannung. PE nur am Gehäuse, nicht auf den Analogausgang zwingen."
	}
];
var full = {
	p12: 1,
	n12: 1,
	p5: 1,
	n5: 1,
	lab: 1
};
var useStudio = create((set) => ({
	view: "auftrag",
	sheet: "pri",
	selected: null,
	labU: 12,
	labI: 2,
	usePrereg: true,
	nQ: 2,
	rthKA: .45,
	tAmb: 45,
	load: full,
	setView: (view) => set({ view }),
	setSheet: (sheet) => set({ sheet }),
	select: (selected) => set({ selected }),
	setLab: (labU, labI) => set({
		labU,
		labI
	}),
	setLoad: (id, v) => set((s) => ({ load: {
		...s.load,
		[id]: Math.min(1, Math.max(0, v))
	} })),
	setAllLoad: (v) => set({ load: {
		p12: v,
		n12: v,
		p5: v,
		n5: v,
		lab: v
	} }),
	setPrereg: (usePrereg) => set({ usePrereg }),
	setNq: (nQ) => set({ nQ }),
	setRth: (rthKA) => set({ rthKA }),
	setTamb: (tAmb) => set({ tAmb })
}));
function Badge({ className, tone = "neutral", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2 py-0.5 font-mono text-xs tracking-wide", tone === "neutral" && "bg-raised text-muted", tone === "ok" && "bg-ok/15 text-ok", tone === "warn" && "bg-warn/15 text-warn", tone === "hot" && "bg-hot/15 text-hot", tone === "pri" && "bg-pri/15 text-pri", tone === "selv" && "bg-selv/15 text-selv", className),
		children
	});
}
var SPECS = [
	{
		k: "Eingang",
		v: "230 V AC ±10 %, 50 Hz, Schutzklasse I"
	},
	{
		k: "Festspannungen",
		v: "+12 V, −12 V, +5 V, −5 V, je 1 A"
	},
	{
		k: "Universal",
		v: "1…30 V / 0…3 A, analoger Längsregler"
	},
	{
		k: "Wirkungsgrad",
		v: "80 PLUS Bronze, 82–85 % am Schaltnetzteil"
	},
	{
		k: "Restwelligkeit",
		v: "< 100 mVss Schaltausgänge, < 20 mVss Analog"
	},
	{
		k: "Anzeigen",
		v: "Volt- und Amperemeter an allen 5 Kanälen"
	},
	{
		k: "Topologie",
		v: "Sperrwandler + TPS5430 + Hybrid-Längsregler"
	},
	{
		k: "Prüfung",
		v: "1-h-Volllast, Kurzschluss, VDE 0701-0702"
	}
];
function AuftragView() {
	const setView = useStudio((s) => s.setView);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Situationsaufgabe" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "ok",
								children: "80 PLUS Bronze"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "pri",
								children: "SELV nach 62368-1"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-2xl font-medium tracking-tight md:text-3xl",
						children: "Hybrid-Labornetzteil für die Meisterprüfung"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-base",
						children: "Eigenentwickeltes Multispannungs-Schaltnetzteil mit vier Festspannungen und integriertem Universalmodul 1…30 V / 3 A. Die Festschienen laufen über einen Sperrwandler und TPS5430-Wandler, damit der Bronze-Wirkungsgrad hält. Der Conrad-Längsregler bleibt für saubere Analogspannung — thermisch aber nur mit Vorregler und parallelen TIP35C zulässig."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setView("block"),
							children: "Blockschaltbild"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setView("plan"),
							children: "Schaltplan öffnen"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: SPECS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-faint uppercase",
						children: s.k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-snug",
						children: s.v
					})]
				}, s.k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-medium",
						children: "Normen, die die Zeichnung tragen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-4",
						children: NORMS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line pt-4 first:border-t-0 first:pt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted",
								children: n.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: n.text
							})]
						}, n.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 font-mono text-xs text-faint",
						children: PROJECT.norm
					})
				]
			})
		]
	});
}
function BlockView() {
	const selected = useStudio((s) => s.selected);
	const select = useStudio((s) => s.select);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-widest text-muted uppercase",
				children: "Blatt 00 · Topologie"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-medium",
				children: "Blockschaltbild"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Feld antippen — Bauteile rechts"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-paper p-2 text-ink shadow-[var(--shadow-border)] md:p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 1100 720",
				className: "h-auto w-full min-w-xl",
				role: "img",
				"aria-label": "Blockschaltbild des Multispannungs-Netzteils",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
						id: "hatch",
						width: "6",
						height: "6",
						patternUnits: "userSpaceOnUse",
						patternTransform: "rotate(45)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "6",
							stroke: "#7a2f2f",
							strokeWidth: "1",
							opacity: "0.35"
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "24",
						y: "28",
						fill: "#4a4c44",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "11",
						children: "IFT-NT-2026 · 230 V / 50 Hz · Hybrid Flyback + Buck + Längsregler"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zone, {
						x: 16,
						y: 44,
						w: 1068,
						h: 158,
						label: "PRIMÄRSEITE  ·  230 V AC  ·  Schutzklasse I",
						stroke: "#7a2f2f",
						fill: "#f6e8e4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zone, {
						x: 16,
						y: 248,
						w: 1068,
						h: 228,
						label: "SEKUNDÄRSEITE  ·  SELV nach DIN EN 62368-1",
						stroke: "#2a4a62",
						fill: "#e4edf3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zone, {
						x: 16,
						y: 508,
						w: 1068,
						h: 196,
						label: "FRONT  ·  Anzeigen und Laborbuchsen",
						stroke: "#3d6b4f",
						fill: "#e5efe8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "16",
						y: "212",
						width: "1068",
						height: "24",
						fill: "url(#hatch)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "550",
						y: "228",
						textAnchor: "middle",
						fill: "#7a2f2f",
						fontFamily: "IBM Plex Sans, sans-serif",
						fontSize: "12",
						fontWeight: "500",
						children: "Galvanische Trennung — HF-Trafo T1 EFD30 / 3 kVrms — Kriechstrecke ≥ 8 mm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "in",
						x: 36,
						y: 72,
						w: 200,
						h: 108,
						title: "Netzeingang",
						lines: [
							"X1 Schurter C14 + PE",
							"F1 2 A T  ·  NTC1 10 Ω",
							"MOV1 S14K275"
						],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
						x1: 236,
						y1: 126,
						x2: 268,
						y2: 126
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "emc",
						x: 268,
						y: 72,
						w: 210,
						h: 108,
						title: "EMV-Filter",
						lines: [
							"L1 WE-CMB 2×10 mH",
							"C1 100 nF X2",
							"CY1/2 2,2 nF Y2"
						],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
						x1: 478,
						y1: 126,
						x2: 510,
						y2: 126
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "rect",
						x: 510,
						y: 72,
						w: 220,
						h: 108,
						title: "Gleichrichtung",
						lines: [
							"BR1 GBU406 600 V/4 A",
							"C2 120 µF / 400 V",
							"R1 100 kΩ Entladung"
						],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
						x1: 730,
						y1: 126,
						x2: 762,
						y2: 126
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "fly",
						x: 762,
						y: 72,
						w: 300,
						h: 108,
						title: "Sperrwandler 65–100 kHz",
						lines: [
							"IC1 UC3843B  ·  Q1 STP10NK60Z",
							"RCD-Snubber  ·  Rs 0,33 Ω",
							"OK1 LTV-817 + IC6 TL431"
						],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M912 180 v32",
						stroke: "#1c1d18",
						strokeWidth: "1.4",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "bus",
						x: 36,
						y: 278,
						w: 280,
						h: 172,
						title: "Sekundärbusse",
						lines: [
							"D1/D2 MBR10100",
							"D3 MBR20100CT",
							"LC Low-ESR",
							"+15 V  ·  −15 V  ·  +35 V"
						],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
						x1: 316,
						y1: 316,
						x2: 360,
						y2: 316,
						label: "+15 V"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
						x1: 316,
						y1: 368,
						x2: 360,
						y2: 368,
						label: "+15 V"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
						x1: 316,
						y1: 424,
						x2: 360,
						y2: 424,
						label: "+35 V"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "p12",
						x: 360,
						y: 278,
						w: 200,
						h: 74,
						title: "+12 V / 1 A",
						lines: ["IC2 TPS5430 Buck", "L 15 µH  ·  η ≈ 94 %"],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "p5",
						x: 580,
						y: 278,
						w: 200,
						h: 74,
						title: "+5 V / 1 A",
						lines: ["IC4 TPS5430 Buck", "Rtop 30,9 kΩ  ·  η ≈ 93 %"],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "n12",
						x: 360,
						y: 368,
						w: 200,
						h: 74,
						title: "−12 V / 1 A",
						lines: ["IC3 TPS5430 invert.", "aus +15 V  ·  η ≈ 91 %"],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "n5",
						x: 580,
						y: 368,
						w: 200,
						h: 74,
						title: "−5 V / 1 A",
						lines: ["IC5 TPS5430 invert.", "η ≈ 89 %"],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "lab",
						x: 800,
						y: 278,
						w: 262,
						h: 164,
						title: "Universal 1…30 V / 3 A",
						lines: [
							"IC7 Tracking-Vorregler",
							"Q2/Q3  2× TIP35C",
							"Re 0,1 Ω  ·  K1 SK 85 + Lüfter",
							"Conrad-Längsregler, sauber"
						],
						selected,
						onSelect: select
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M460 352 v156",
						stroke: "#1c1d18",
						strokeWidth: "1.4",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M680 352 v156",
						stroke: "#1c1d18",
						strokeWidth: "1.4",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M460 442 v66",
						stroke: "#1c1d18",
						strokeWidth: "1.4",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M680 442 v66",
						stroke: "#1c1d18",
						strokeWidth: "1.4",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M931 442 v66",
						stroke: "#1c1d18",
						strokeWidth: "1.4",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						id: "meter",
						x: 36,
						y: 532,
						w: 1028,
						h: 152,
						title: "Messtechnik  ·  5 × DSN-VC288  ·  Shunts 10 mΩ in der Rückleitung",
						lines: [
							"M1 +12 V    M2 −12 V    M3 +5 V    M4 −5 V    M5 1…30 V",
							"Sense direkt an den Buchsen — Eigenverbrauch verfälscht die Anzeige nicht",
							"Buchsen: rot / schwarz Labor, gemeinsame SELV-Masse, PE nur am Gehäuse"
						],
						selected,
						onSelect: select
					})
				]
			})
		})]
	});
}
function Zone({ x, y, w, h, label, stroke, fill }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x,
		y,
		width: w,
		height: h,
		rx: "10",
		fill,
		stroke,
		strokeWidth: "1.4"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
		x: x + 14,
		y: y + 22,
		fill: stroke,
		fontFamily: "IBM Plex Mono, monospace",
		fontSize: "11",
		children: label
	})] });
}
function Block({ id, x, y, w, h, title, lines, selected, onSelect }) {
	const on = selected === id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		className: cn("cursor-pointer", on && "sch-sel"),
		onClick: () => onSelect(id),
		role: "button",
		tabIndex: 0,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") onSelect(id);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x,
				y,
				width: w,
				height: h,
				rx: "8",
				fill: on ? "#fffdf6" : "#fbf7ee",
				stroke: on ? "#2a4a62" : "#1c1d18",
				strokeWidth: on ? 2.2 : 1.3
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: x + 12,
				y: y + 22,
				fill: "#1c1d18",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fontWeight: "600",
				children: title
			}),
			lines.map((ln, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: x + 12,
				y: y + 42 + i * 16,
				fill: "#4a4c44",
				fontFamily: "IBM Plex Mono, monospace",
				fontSize: "11",
				children: ln
			}, ln))
		]
	});
}
function Arrow({ x1, y1, x2, y2, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1,
			y1,
			x2,
			y2,
			stroke: "#1c1d18",
			strokeWidth: "1.4"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
			points: `${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}`,
			fill: "#1c1d18"
		}),
		label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: (x1 + x2) / 2,
			y: y1 - 6,
			textAnchor: "middle",
			fill: "#4a4c44",
			fontFamily: "IBM Plex Mono, monospace",
			fontSize: "10",
			children: label
		})
	] });
}
var ZONE = {
	pri: "Primär",
	iso: "Isolation",
	sec: "SELV",
	lab: "Labor",
	meter: "Messung",
	mech: "Mechanik"
};
function BomView() {
	const select = useStudio((s) => s.select);
	const setView = useStudio((s) => s.setView);
	const setSheet = useStudio((s) => s.setSheet);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs tracking-widest text-muted uppercase",
					children: [
						"Stückliste · ",
						PARTS.length,
						" Positionen"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-medium tracking-tight",
					children: "Bill of Materials"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Zeile antippen öffnet den Schaltplan am Bauteil."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-xl text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-line font-mono text-xs text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Ref"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Bauteil"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Wert"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "hidden px-4 py-3 font-medium md:table-cell",
							children: "Hersteller"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Zone"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: PARTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "cursor-pointer border-b border-line last:border-0 hover:bg-raised",
					onClick: () => {
						select(p.id);
						setSheet(p.sheet);
						setView("plan");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-mono text-xs",
							children: p.ref
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-mono text-xs text-muted",
							children: p.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "hidden px-4 py-3 text-muted md:table-cell",
							children: p.maker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: p.zone === "pri" ? "pri" : p.zone === "lab" ? "warn" : "selv",
								children: ZONE[p.zone]
							})
						})
					]
				}, p.id)) })]
			})
		})]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-raised",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-accent shadow-[var(--shadow-border)] focus-visible:outline-none" })]
	});
}
function EfficiencyView() {
	const load = useStudio((s) => s.load);
	const setLoad = useStudio((s) => s.setLoad);
	const setAllLoad = useStudio((s) => s.setAllLoad);
	const labU = useStudio((s) => s.labU);
	const labI = useStudio((s) => s.labI);
	const setLab = useStudio((s) => s.setLab);
	const usePrereg = useStudio((s) => s.usePrereg);
	const setPrereg = useStudio((s) => s.setPrereg);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const now = systemEta(load, labU, labI, usePrereg);
	const railsOnly = systemEta({
		...load,
		lab: 0
	}, labU, labI, usePrereg);
	const sweep = [
		.2,
		.5,
		1
	].map((p) => {
		const L = {
			p12: p,
			n12: p,
			p5: p,
			n5: p,
			lab: p
		};
		const sys = systemEta(L, labU, labI, usePrereg);
		const rails = systemEta({
			...L,
			lab: 0
		}, labU, labI, usePrereg);
		return {
			name: `${Math.round(p * 100)} %`,
			system: round1(sys.etaPct),
			schalt: round1(rails.etaPct),
			bronze: p === .5 ? 88 : 85
		};
	});
	const bronzeOk = railsOnly.etaPct >= 82;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-widest text-muted uppercase",
					children: "80 PLUS Bronze · 230 V"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-medium tracking-tight",
					children: "Wirkungsgrad"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: bronzeOk ? "ok" : "hot",
						children: [
							"Schaltnetzteil ",
							railsOnly.etaPct.toFixed(1),
							" %"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "neutral",
						children: [
							"System ",
							now.etaPct.toFixed(1),
							" %"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-3xl text-sm leading-relaxed text-muted",
				children: "Bronze wird am eigenentwickelten Schaltnetzteil nachgewiesen (vier Festschienen über Sperrwandler und TPS5430). Grenze 230 V: 85 / 88 / 85 % bei 20 / 50 / 100 % Last. Der Längsregler zählt als Integrationsmodul und steht getrennt in der Thermik."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Paus Schalt",
						v: `${railsOnly.pout.toFixed(1)} W`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Paus Labor",
						v: `${now.lab.pout.toFixed(1)} W`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Pein Schalt",
						v: `${railsOnly.pac.toFixed(1)} W`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium",
					children: "Lastpunkte gegen Bronze (85 / 88 / 85 %)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-64",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: sweep,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--color-line)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "var(--color-muted)",
									fontSize: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: [0, 100],
									stroke: "var(--color-muted)",
									fontSize: 12,
									unit: "%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "#18191e",
										border: "1px solid #2c2d34",
										borderRadius: 8,
										color: "#eceae4"
									},
									formatter: (v) => [`${v} %`, void 0]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
									y: 85,
									stroke: "#3d6b4f",
									strokeDasharray: "4 4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "schalt",
									name: "Schaltnetzteil",
									fill: "#c9cdc4",
									radius: [
										4,
										4,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "system",
									name: "System inkl. Labor",
									fill: "#5c5e58",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-md bg-raised" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-medium",
						children: "Lastsimulator"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [[
							.25,
							.5,
							1
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "h-10 rounded-md bg-raised px-3 text-sm",
							onClick: () => setAllLoad(p),
							children: [Math.round(p * 100), " %"]
						}, p)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "h-10 rounded-md bg-raised px-3 text-sm",
							onClick: () => setPrereg(!usePrereg),
							children: ["Vorregler ", usePrereg ? "ein" : "aus"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [RAILS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums text-muted",
								children: [
									Math.round(load[r.id] * 100),
									" % ·",
									" ",
									(r.id === "lab" ? labU * labI * load.lab : r.v * r.i * load[r.id]).toFixed(1),
									" ",
									"W"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 1,
							step: .05,
							value: [load[r.id]],
							onValueChange: ([v]) => setLoad(r.id, v ?? 0)
						})]
					}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Labor-Sollspannung" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums text-muted",
								children: [
									labU.toFixed(1),
									" V / ",
									labI.toFixed(2),
									" A"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 1,
							max: 30,
							step: .5,
							value: [labU],
							onValueChange: ([v]) => setLab(v ?? 12, labI)
						})]
					})]
				})]
			})
		]
	});
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs text-faint",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-mono text-2xl tabular-nums",
			children: v
		})]
	});
}
function Inspector() {
	const selected = useStudio((s) => s.selected);
	const select = useStudio((s) => s.select);
	const setView = useStudio((s) => s.setView);
	const setSheet = useStudio((s) => s.setSheet);
	const part = selected ? partById(selected) : null;
	const block = selected ? BLOCKS.find((b) => b.id === selected) : null;
	const related = block ? PARTS.filter((p) => block.parts.includes(p.id)) : [];
	if (!part && !block) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "no-print hidden w-80 shrink-0 border-l border-line p-5 xl:block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-widest text-muted uppercase",
				children: "Bauteil"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-lg font-medium",
				children: "Nichts gewählt"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "Tippe im Blockschaltbild oder Schaltplan auf ein Feld, um Referenz, Wert und Rolle zu sehen."
			})
		]
	});
	const title = part?.ref ?? block?.title;
	const zone = part?.zone ?? block?.zone;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "no-print border-t border-line p-4 lg:w-80 lg:shrink-0 lg:border-t-0 lg:border-l lg:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-widest text-muted uppercase",
					children: part ? "Bauteil" : "Funktionsblock"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-lg font-medium tracking-tight",
					children: title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					size: "icon",
					"aria-label": "Schließen",
					onClick: () => select(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: [zone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: zone === "pri" ? "pri" : zone === "lab" ? "warn" : "selv",
					children: zoneLabel(zone)
				}), part && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: part.maker })]
			}),
			part && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Bezeichnung",
						v: part.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Wert",
						v: part.value,
						mono: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Funktion",
						v: part.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Blatt",
						v: sheetName(part.sheet)
					})
				]
			}),
			block && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted",
					children: block.detail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-mono text-xs text-faint",
					children: ["Ausgang ", block.out]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => select(p.id),
						className: "flex w-full items-baseline justify-between gap-2 rounded-md px-2 py-2 text-left hover:bg-raised",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted",
							children: p.ref
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-sm",
							children: p.name
						})]
					}) }, p.id))
				})
			] }),
			(part || block) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "mt-5 w-full",
				onClick: () => {
					const sheet = part?.sheet ?? related[0]?.sheet ?? "pri";
					setSheet(sheet);
					setView("plan");
				},
				children: "Im Schaltplan zeigen"
			})
		]
	});
}
function Row({ k, v, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "font-mono text-xs text-faint",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: mono ? "mt-0.5 font-mono text-sm" : "mt-0.5",
		children: v
	})] });
}
function zoneLabel(z) {
	if (z === "pri") return "Primär 230 V";
	if (z === "iso") return "Isolation";
	if (z === "sec") return "SELV";
	if (z === "lab") return "Längsregler";
	if (z === "meter") return "Messung";
	return "Mechanik";
}
function sheetName(s) {
	return {
		pri: "01 Primärseite",
		sec: "02 Sekundärbusse",
		rails: "03 Festspannungen",
		lab: "04 Universal",
		meter: "05 Messtechnik"
	}[s] ?? s;
}
var F = {
	sans: "IBM Plex Sans, Segoe UI, sans-serif",
	mono: "IBM Plex Mono, ui-monospace, monospace"
};
function Paper({ no, title, children, viewBox = "0 0 1480 980" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox,
		className: "paper-sheet h-auto w-full min-w-3xl bg-paper text-ink",
		role: "img",
		"aria-label": `Schaltplan Blatt ${no}: ${title}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "8",
				width: "1464",
				height: "964",
				fill: "none",
				stroke: "#1c1d18",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14",
				y: "14",
				width: "1452",
				height: "952",
				fill: "none",
				stroke: "#1c1d18",
				strokeWidth: "0.6"
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "14",
					y: "900",
					width: "1452",
					height: "66",
					fill: "#efe8d6",
					stroke: "#1c1d18",
					strokeWidth: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "220",
					y1: "900",
					x2: "220",
					y2: "966",
					stroke: "#1c1d18"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "980",
					y1: "900",
					x2: "980",
					y2: "966",
					stroke: "#1c1d18"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "1180",
					y1: "900",
					x2: "1180",
					y2: "966",
					stroke: "#1c1d18"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "28",
					y: "924",
					fontFamily: F.mono,
					fontSize: "11",
					fill: "#4a4c44",
					children: "IFT-NT-2026"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "28",
					y: "948",
					fontFamily: F.sans,
					fontSize: "13",
					fontWeight: "600",
					children: "Meisterprüfung Informationstechnik"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "236",
					y: "924",
					fontFamily: F.sans,
					fontSize: "16",
					fontWeight: "600",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "236",
					y: "948",
					fontFamily: F.mono,
					fontSize: "11",
					fill: "#4a4c44",
					children: "Hybrid-Sperrwandler · TPS5430 · Längsregler · DIN EN 62368-1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "996",
					y: "924",
					fontFamily: F.mono,
					fontSize: "11",
					fill: "#4a4c44",
					children: "Blatt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "996",
					y: "950",
					fontFamily: F.sans,
					fontSize: "20",
					fontWeight: "600",
					children: [no, " / 05"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "1196",
					y: "924",
					fontFamily: F.mono,
					fontSize: "11",
					fill: "#4a4c44",
					children: "A3 quer · nicht maßstäblich"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "1196",
					y: "948",
					fontFamily: F.mono,
					fontSize: "11",
					children: "Bauteil klicken"
				})
			] })
		]
	});
}
function Hit({ id, children }) {
	const selected = useStudio((s) => s.selected);
	const select = useStudio((s) => s.select);
	const on = selected === id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
		className: cn("cursor-pointer", on && "sch-sel"),
		onClick: (e) => {
			e.stopPropagation();
			select(id);
		},
		stroke: on ? "#2a4a62" : "#1c1d18",
		fill: "none",
		children
	});
}
function Wire({ d, pri }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		d,
		fill: "none",
		stroke: pri ? "#7a2f2f" : "#1c1d18",
		strokeWidth: pri ? 1.7 : 1.25
	});
}
function Dot({ x, y }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: x,
		cy: y,
		r: "2.6",
		fill: "#1c1d18"
	});
}
function Gnd({ x, y }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		stroke: "#1c1d18",
		strokeWidth: "1.3",
		fill: "none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x,
				y1: y,
				x2: x,
				y2: y + 8
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x - 12,
				y1: y + 8,
				x2: x + 12,
				y2: y + 8
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x - 8,
				y1: y + 13,
				x2: x + 8,
				y2: y + 13
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x - 4,
				y1: y + 18,
				x2: x + 4,
				y2: y + 18
			})
		]
	});
}
function Tag({ x, y, t, anchor = "start", small }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
		x,
		y,
		textAnchor: anchor,
		fontFamily: F.mono,
		fontSize: small ? 10 : 12,
		fill: "#4a4c44",
		children: t
	});
}
function Ref({ x, y, t, anchor = "middle" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
		x,
		y,
		textAnchor: anchor,
		fontFamily: F.sans,
		fontSize: "12",
		fontWeight: "600",
		fill: "#1c1d18",
		children: t
	});
}
function ResH({ x, y, id, ref, val }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x,
				y: y - 8,
				width: "36",
				height: "16"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
				x: x + 18,
				y: y - 12,
				t: ref
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: x + 18,
				y: y + 24,
				t: val,
				anchor: "middle",
				small: true
			})
		]
	});
}
function ResV({ x, y, id, ref, val }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: x - 8,
				y,
				width: "16",
				height: "36"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
				x: x + 18,
				y: y + 14,
				t: ref,
				anchor: "start"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: x + 18,
				y: y + 28,
				t: val,
				small: true
			})
		]
	});
}
function CapV({ x, y, id, ref, val, polar }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x - 14,
				y1: y,
				x2: x + 14,
				y2: y
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x - 14,
				y1: y + 8,
				x2: x + 14,
				y2: y + 8
			}),
			polar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: x + 16,
				y: y + 6,
				fontFamily: F.mono,
				fontSize: "11",
				children: "+"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
				x: x + 20,
				y: y + 4,
				t: ref,
				anchor: "start"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: x + 20,
				y: y + 18,
				t: val,
				small: true
			})
		]
	});
}
function DiodeH({ x, y, id, ref, val }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: `${x},${y - 9} ${x},${y + 9} ${x + 16},${y}`,
				fill: "#1c1d18",
				stroke: "#1c1d18"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 16,
				y1: y - 10,
				x2: x + 16,
				y2: y + 10
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
				x: x + 8,
				y: y - 14,
				t: ref
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: x + 8,
				y: y + 24,
				t: val,
				anchor: "middle",
				small: true
			})
		]
	});
}
function FuseH({ x, y, id, ref, val }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x,
				y: y - 8,
				width: "40",
				height: "16",
				rx: "8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 6,
				y1: y,
				x2: x + 34,
				y2: y
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
				x: x + 20,
				y: y - 14,
				t: ref
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: x + 20,
				y: y + 24,
				t: val,
				anchor: "middle",
				small: true
			})
		]
	});
}
function Nmos({ x, y, id, ref, val }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x,
				y1: y,
				x2: x + 14,
				y2: y
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 14,
				y1: y - 16,
				x2: x + 14,
				y2: y + 16
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 20,
				y1: y - 18,
				x2: x + 20,
				y2: y + 18
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 20,
				y1: y - 12,
				x2: x + 34,
				y2: y - 12
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 20,
				y1: y + 12,
				x2: x + 34,
				y2: y + 12
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 34,
				y1: y - 12,
				x2: x + 34,
				y2: y - 36
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 34,
				y1: y + 12,
				x2: x + 34,
				y2: y + 28
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: `${x + 26},${y} ${x + 18},${y - 4} ${x + 18},${y + 4}`,
				fill: "#1c1d18"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
				x: x + 44,
				y: y - 8,
				t: ref,
				anchor: "start"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: x + 44,
				y: y + 8,
				t: val,
				small: true
			})
		]
	});
}
function Npn({ x, y, id, ref, val }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: x + 18,
				cy: y,
				r: "16"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x,
				y1: y,
				x2: x + 10,
				y2: y
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 10,
				y1: y - 12,
				x2: x + 10,
				y2: y + 12
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 10,
				y1: y - 8,
				x2: x + 28,
				y2: y - 16
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 10,
				y1: y + 8,
				x2: x + 28,
				y2: y + 16
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: `${x + 22},${y + 12} ${x + 16},${y + 16} ${x + 24},${y + 18}`,
				fill: "#1c1d18"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 28,
				y1: y - 16,
				x2: x + 28,
				y2: y - 28
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + 28,
				y1: y + 16,
				x2: x + 28,
				y2: y + 28
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
				x: x + 40,
				y: y - 4,
				t: ref,
				anchor: "start"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: x + 40,
				y: y + 12,
				t: val,
				small: true
			})
		]
	});
}
function IndH({ x, y, id, ref, val }) {
	const humps = [
		0,
		10,
		20,
		30
	].map((o) => `a 5 5 0 0 1 10 0`).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: `M ${x} ${y} ${humps}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
				x: x + 20,
				y: y - 12,
				t: ref
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: x + 20,
				y: y + 18,
				t: val,
				anchor: "middle",
				small: true
			})
		]
	});
}
function IcBox({ x, y, w, h, id, name, pinsL, pinsR }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x,
				y,
				width: w,
				height: h
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: x + w / 2,
				y: y + 16,
				textAnchor: "middle",
				fontFamily: F.sans,
				fontSize: "12",
				fontWeight: "600",
				fill: "#1c1d18",
				children: name
			}),
			pinsL.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x - 16,
				y1: y + 32 + i * 18,
				x2: x,
				y2: y + 32 + i * 18
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: x + 6,
				y: y + 36 + i * 18,
				fontFamily: F.mono,
				fontSize: "10",
				fill: "#4a4c44",
				children: p
			})] }, `l${p}`)),
			pinsR.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x + w,
				y1: y + 32 + i * 18,
				x2: x + w + 16,
				y2: y + 32 + i * 18
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: x + w - 6,
				y: y + 36 + i * 18,
				textAnchor: "end",
				fontFamily: F.mono,
				fontSize: "10",
				fill: "#4a4c44",
				children: p
			})] }, `r${p}`))
		]
	});
}
function Jack({ x, y, label, id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: x,
				cy: y,
				r: "10"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: x,
				cy: y,
				r: "4",
				fill: "#1c1d18"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x,
				y: y + 26,
				t: label,
				anchor: "middle",
				small: true
			})
		]
	});
}
function PlanView() {
	const sheet = useStudio((s) => s.sheet);
	const setSheet = useStudio((s) => s.setSheet);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print flex flex-wrap items-end justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-widest text-muted uppercase",
				children: "Stromlaufplan · IEC / DIN"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-medium",
				children: "Schaltplan mit allen Bauteilen"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1",
				children: SHEETS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSheet(s.id),
					className: cn("min-h-10 rounded-md px-3 text-sm", sheet === s.id ? "bg-raised text-fg" : "text-muted hover:bg-raised"),
					children: [
						s.no,
						" ",
						s.title
					]
				}, s.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-x-auto rounded-xl bg-paper shadow-[var(--shadow-border)]",
			children: [
				sheet === "pri" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetPri, {}),
				sheet === "sec" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetSec, {}),
				sheet === "rails" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetRails, {}),
				sheet === "lab" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetLab, {}),
				sheet === "meter" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetMeter, {})
			]
		})]
	});
}
function SheetPri() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Paper, {
		no: "01",
		title: "Primärseite, EMV-Filter und Sperrwandler",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "1432",
				height: "26",
				fill: "#f6e8e4",
				stroke: "#7a2f2f"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: "36",
				y: "46",
				t: "NETZSPANNUNGSEBENE  ·  Schutzklasse I  ·  PE am Metallgehäuse  ·  8 mm zur SELV-Seite"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 36,
				y: 88,
				t: "L 230 V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 36,
				y: 208,
				t: "N"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 36,
				y: 308,
				t: "PE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M90 84 H128",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FuseH, {
				x: 128,
				y: 84,
				id: "f1",
				ref: "F1",
				val: "2 A T / 250 V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M168 84 H240",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResH, {
				x: 240,
				y: 84,
				id: "ntc1",
				ref: "NTC1",
				val: "10 Ω NTC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M276 84 H360",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M90 204 H360",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M90 304 H700" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "mov1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M220 84 V128" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "204",
						y: "128",
						width: "32",
						height: "36"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "204",
						y1: "128",
						x2: "236",
						y2: "164"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M220 164 V204" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
						x: 220,
						y: 122,
						t: "MOV1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						x: 220,
						y: 186,
						t: "S14K275",
						anchor: "middle",
						small: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapV, {
				x: 300,
				y: 84,
				id: "c1",
				ref: "C1",
				val: "100 nF X2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M300 92 V204",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "l1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M360 84 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M360 204 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "388",
						y1: "98",
						x2: "388",
						y2: "190",
						strokeDasharray: "3 3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
						x: 388,
						y: 74,
						t: "L1 WE-CMB"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						x: 388,
						y: 228,
						t: "2 × 10 mH",
						anchor: "middle",
						small: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M416 84 H500",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M416 204 H500",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "cy1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M470 84 V250" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "462",
						y1: "250",
						x2: "478",
						y2: "250"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "462",
						y1: "258",
						x2: "478",
						y2: "258"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M470 258 V304" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
						x: 486,
						y: 252,
						t: "CY1",
						anchor: "start"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "cy1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M494 204 V250" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "486",
						y1: "250",
						x2: "502",
						y2: "250"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "486",
						y1: "258",
						x2: "502",
						y2: "258"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M494 258 V304" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
						x: 510,
						y: 268,
						t: "CY2 2n2 Y2",
						anchor: "start"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "br1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "500",
						y: "64",
						width: "88",
						height: "156"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "544",
						y: "92",
						textAnchor: "middle",
						fontFamily: "IBM Plex Sans, sans-serif",
						fontSize: "13",
						fontWeight: "600",
						fill: "#1c1d18",
						children: "BR1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "544",
						y: "112",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "11",
						fill: "#4a4c44",
						children: "GBU406"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "544",
						y: "136",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "11",
						fill: "#4a4c44",
						children: "600 V / 4 A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "544",
						y: "168",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "11",
						fill: "#4a4c44",
						children: "+           −"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M588 84 H868",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 620,
				y: 76,
				t: "+325 V DC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M588 204 H760",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 620,
				y: 196,
				t: "GND_PRI"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapV, {
				x: 660,
				y: 84,
				id: "c2",
				ref: "C2",
				val: "120 µF / 400 V",
				polar: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M660 92 V204",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResV, {
				x: 720,
				y: 110,
				id: "r1",
				ref: "R1",
				val: "100 k / 2 W"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M720 84 V110",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M720 146 V204",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				x: 660,
				y: 84
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				x: 720,
				y: 84
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				x: 660,
				y: 204
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "t1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "900",
						y1: "56",
						x2: "900",
						y2: "400"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "912",
						y1: "56",
						x2: "912",
						y2: "400"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M868 80 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M944 90 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M944 200 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M944 290 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20 a10 10 0 0 0 0 20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
						x: 906,
						y: 48,
						t: "T1 EFD30"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						x: 906,
						y: 418,
						t: "TIW · 3 kVrms · Fräsnut",
						anchor: "middle",
						small: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M868 160 H800",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nmos, {
				x: 766,
				y: 204,
				id: "q1",
				ref: "Q1",
				val: "STP10NK60Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M800 160 V188",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResV, {
				x: 800,
				y: 236,
				id: "rs",
				ref: "Rs",
				val: "0,33 Ω / 2 W"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M800 272 V320 H660",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M660 204 V320",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gnd, {
				x: 660,
				y: 320
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "snub",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M830 84 V50 H1000 V80" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "1000,80 1000,70 1014,80",
						fill: "#1c1d18"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "1020",
						y: "72",
						width: "40",
						height: "16"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "1060",
						y1: "80",
						x2: "1090",
						y2: "80"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "1090",
						y1: "66",
						x2: "1090",
						y2: "94"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "1098",
						y1: "66",
						x2: "1098",
						y2: "94"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M1098 80 V160 H868" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
						x: 1050,
						y: 60,
						t: "RCD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						x: 1050,
						y: 112,
						t: "UF4007 · 100 k · 2n2/1kV",
						anchor: "middle",
						small: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IcBox, {
				id: "ic1",
				x: 1040,
				y: 460,
				w: 160,
				h: 150,
				name: "IC1 UC3843B",
				pinsL: [
					"2 FB",
					"3 CS",
					"4 RT/CT"
				],
				pinsR: [
					"7 VCC",
					"6 OUT",
					"5 GND"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M1216 528 H800",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 860,
				y: 520,
				t: "RG 10 Ω → Gate Q1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M1024 492 H840 V320",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 850,
				y: 480,
				t: "Cs von Rs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapV, {
				x: 1260,
				y: 492,
				id: "ic1",
				ref: "Cvcc",
				val: "47 µF / 50 V",
				polar: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M1260 500 V680 H1216" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, {
				d: "M1216 492 H1320 V84 H830",
				pri: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 1240,
				y: 76,
				t: "Rstart 100 k"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "ok1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "1040",
						y: "680",
						width: "160",
						height: "52"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "1120",
						y: "702",
						textAnchor: "middle",
						fontFamily: "IBM Plex Sans, sans-serif",
						fontSize: "13",
						fontWeight: "600",
						fill: "#1c1d18",
						children: "OK1 LTV-817"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "1120",
						y: "720",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "11",
						fill: "#4a4c44",
						children: "FB von TL431 Blatt 02"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M1040 698 H1024 V492" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 960,
				y: 108,
				t: "Ns1 +15 V → Blatt 02"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 960,
				y: 218,
				t: "Ns2 −15 V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 960,
				y: 308,
				t: "Ns3 +35 V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "x1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "36",
						y: "360",
						width: "168",
						height: "64"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "120",
						y: "388",
						textAnchor: "middle",
						fontFamily: "IBM Plex Sans, sans-serif",
						fontSize: "13",
						fontWeight: "600",
						fill: "#1c1d18",
						children: "X1 IEC C14"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "120",
						y: "408",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "11",
						fill: "#4a4c44",
						children: "Schurter · PE Gehäuse"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M90 360 V304" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gnd, {
				x: 700,
				y: 304
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 714,
				y: 324,
				t: "PE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "36",
				y: "800",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Current-Mode: Pin 3 misst den Peak an Rs. Aux-Wicklung speist VCC nach dem Anlauf über Rstart. UVLO im UC3843B."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "36",
				y: "824",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Sternpunkt GND_PRI am Minus von C2. Q1 auf Kühlblech. Unter T1 und OK1 Fräsnut, Kriechstrecke ≥ 8 mm."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "36",
				y: "848",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "EMV: X2 vor der Drossel, Y2 danach gegen PE. Gehäuse als Schirm, DIN EN 61000-6-3."
			})
		]
	});
}
function SheetSec() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Paper, {
		no: "02",
		title: "Sekundärbusse +15 V, −15 V, +35 V",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "1432",
				height: "26",
				fill: "#e4edf3",
				stroke: "#2a4a62"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: "36",
				y: "46",
				t: "SELV  ·  gemeinsame Sekundärmasse  ·  keine Verbindung zu GND_PRI"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "t1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "70",
						y1: "80",
						x2: "70",
						y2: "780"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "82",
						y1: "80",
						x2: "82",
						y2: "780"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M114 130 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M114 340 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M114 560 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24 a12 12 0 0 0 0 24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
						x: 76,
						y: 70,
						t: "T1"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecBus, {
				y: 130,
				name: "+15 V DC",
				id: "d1",
				dref: "D1",
				dval: "MBR10100",
				l: "L2 10 µH",
				c: "C3 1000 µF / 35 V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecBus, {
				y: 340,
				name: "−15 V DC",
				id: "d2",
				dref: "D2",
				dval: "MBR10100",
				l: "L3 10 µH",
				c: "C5 1000 µF / 35 V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecBus, {
				y: 560,
				name: "+35 V DC",
				id: "d3",
				dref: "D3",
				dval: "MBR20100CT",
				l: "L7 22 µH",
				c: "C7 2200 µF / 50 V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IcBox, {
				id: "u431",
				x: 1120,
				y: 150,
				w: 150,
				h: 110,
				name: "IC6 TL431",
				pinsL: ["KATH", "REF"],
				pinsR: ["ANODE"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "ok1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "1120",
					y: "290",
					width: "150",
					height: "48"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "1195",
					y: "320",
					textAnchor: "middle",
					fontFamily: "IBM Plex Sans, sans-serif",
					fontSize: "12",
					fontWeight: "600",
					fill: "#1c1d18",
					children: "OK1 LED-Seite"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 1120,
				y: 360,
				t: "führt +35-V-Bus, Opto → Blatt 01"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 160,
				y: 840,
				t: "LC nach jeder Wicklung. Restwelligkeit < 100 mVss. Schottky auf Kupferfläche oder Blech."
			})
		]
	});
}
function SecBus({ y, name, id, dref, dval, l, c }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M138 ${y} H210` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiodeH, {
			x: 210,
			y,
			id,
			ref: dref,
			val: dval
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M226 ${y} H300` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndH, {
			x: 300,
			y,
			id: "c3",
			ref: l.split(" ")[0] ?? "L",
			val: l
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M340 ${y} H720` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapV, {
			x: 460,
			y,
			id: "c3",
			ref: c.split(" ")[0] ?? "C",
			val: c,
			polar: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M460 ${y + 8} V${y + 70}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M138 ${y + 64} H720` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gnd, {
			x: 400,
			y: y + 70
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapV, {
			x: 560,
			y,
			id: "c3",
			ref: "MLCC",
			val: "100 nF"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M560 ${y + 8} V${y + 70}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			x: 740,
			y: y + 4,
			t: name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
			x: 460,
			y
		})
	] });
}
function SheetRails() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Paper, {
		no: "03",
		title: "Festspannungen · vier TPS5430",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "1432",
				height: "26",
				fill: "#e4edf3",
				stroke: "#2a4a62"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: "36",
				y: "46",
				t: "Uout = 1,221 V · (1 + Rtop / Rbot)   ·   Rbot = 10 kΩ   ·   500 kHz   ·   Catch-Diode MBRS340"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailCard, {
				x: 40,
				y: 80,
				id: "ic2",
				title: "IC2  TPS5430  Buck",
				out: "+12 V / 1 A",
				bus: "+15 V",
				rtop: "88,7 kΩ",
				l: "15 µH"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailCard, {
				x: 760,
				y: 80,
				id: "ic4",
				title: "IC4  TPS5430  Buck",
				out: "+5 V / 1 A",
				bus: "+15 V",
				rtop: "30,9 kΩ",
				l: "15 µH"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailCard, {
				x: 40,
				y: 470,
				id: "ic3",
				title: "IC3  TPS5430  invertierend",
				out: "−12 V / 1 A",
				bus: "+15 V",
				rtop: "88,7 kΩ",
				l: "22 µH",
				inv: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailCard, {
				x: 760,
				y: 470,
				id: "ic5",
				title: "IC5  TPS5430  invertierend",
				out: "−5 V / 1 A",
				bus: "+15 V",
				rtop: "30,9 kΩ",
				l: "22 µH",
				inv: true
			})
		]
	});
}
function RailCard({ x, y, id, title, out, bus, rtop, l, inv }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x,
			y,
			width: "680",
			height: "360",
			fill: "#fbf7ee",
			stroke: "#1c1d18"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: x + 16,
			y: y + 28,
			fontFamily: "IBM Plex Sans, sans-serif",
			fontSize: "15",
			fontWeight: "600",
			fill: "#1c1d18",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			x: x + 16,
			y: y + 50,
			t: inv ? "GND-Pin des IC liegt auf der negativen Schiene" : "klassischer Tiefsetzsteller"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			x: x + 16,
			y: y + 90,
			t: bus
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${x + 70} ${y + 86} H${x + 130}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IcBox, {
			id,
			x: x + 130,
			y: y + 70,
			w: 170,
			h: 130,
			name: "TPS5430",
			pinsL: [
				"VIN",
				"ENA",
				"GND"
			],
			pinsR: [
				"PH",
				"VSENSE",
				"BOOT"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${x + 316} ${y + 102} H${x + 360}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndH, {
			x: x + 360,
			y: y + 102,
			id,
			ref: "L",
			val: l
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${x + 400} ${y + 102} H${x + 560}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			x: x + 570,
			y: y + 106,
			t: out
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapV, {
			x: x + 470,
			y: y + 102,
			id,
			ref: "Cout",
			val: "220 µF",
			polar: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${x + 470} ${y + 110} V${y + 230}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gnd, {
			x: x + 200,
			y: y + 230
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${x + 146} ${y + 218} V${y + 230} H${x + 470}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResV, {
			x: x + 520,
			y: y + 118,
			id,
			ref: "Rtop",
			val: rtop
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResV, {
			x: x + 520,
			y: y + 168,
			id,
			ref: "Rbot",
			val: "10 kΩ"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiodeH, {
			x: x + 340,
			y: y + 180,
			id,
			ref: "D",
			val: "MBRS340"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${x + 316} ${y + 102} V${y + 180} H${x + 340}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${x + 356} ${y + 180} H${x + 200} V${y + 230}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			x: x + 16,
			y: y + 280,
			t: "Thermal Pad + 8 Vias auf ≥ 4 cm² Kupfer"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			x: x + 16,
			y: y + 300,
			t: inv ? "Inverting Buck-Boost, Ausgang negativ gegen GND_SEK" : "η Ziel 90–94 %, Ripple < 100 mVss"
		})
	] });
}
function SheetLab() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Paper, {
		no: "04",
		title: "Universal 1…30 V / 3 A · Vorregler + Längsregler",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "1432",
				height: "26",
				fill: "#f3ead8",
				stroke: "#8a6230"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: "36",
				y: "46",
				t: "KRITISCH  ·  ohne Vorregler Pv = (35 − Uout) · I  →  Worst Case 102 W bei 1 V / 3 A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 40,
				y: 100,
				t: "+35 V Bus"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M120 96 H190" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IcBox, {
				id: "prereg",
				x: 190,
				y: 60,
				w: 190,
				h: 120,
				name: "IC7 Tracking-Vorregler",
				pinsL: ["VIN", "ENA"],
				pinsR: ["PH", "VSENSE"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M396 98 H460" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndH, {
				x: 460,
				y: 98,
				id: "prereg",
				ref: "L8",
				val: "15 µH"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M500 98 H680" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 690,
				y: 102,
				t: "Uvor = Uout + 3,5 V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapV, {
				x: 580,
				y: 98,
				id: "prereg",
				ref: "C8",
				val: "470 µF / 50 V",
				polar: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M580 106 V200" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gnd, {
				x: 580,
				y: 200
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Npn, {
				x: 700,
				y: 200,
				id: "q2",
				ref: "Q2",
				val: "TIP35C"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Npn, {
				x: 880,
				y: 200,
				id: "q2",
				ref: "Q3",
				val: "TIP35C"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M680 98 H728 V172" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M680 98 H908 V172" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResV, {
				x: 728,
				y: 228,
				id: "re",
				ref: "Re1",
				val: "0,1 Ω / 5 W"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResV, {
				x: 908,
				y: 228,
				id: "re",
				ref: "Re2",
				val: "0,1 Ω / 5 W"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M728 264 H908" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: "M818 264 V320" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: 830,
				y: 320,
				t: "Ausgang 1…30 V / 3 A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
				id: "hs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "1120",
						y: "60",
						width: "300",
						height: "220"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "1270",
						y: "92",
						textAnchor: "middle",
						fontFamily: "IBM Plex Sans, sans-serif",
						fontSize: "14",
						fontWeight: "600",
						fill: "#1c1d18",
						children: "K1 Kühlung"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "1270",
						y: "122",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "12",
						fill: "#4a4c44",
						children: "Fischer SK 85"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "1270",
						y: "146",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "12",
						fill: "#4a4c44",
						children: "12-V-Lüfter + Klixon"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "1270",
						y: "178",
						textAnchor: "middle",
						fontFamily: "IBM Plex Sans, sans-serif",
						fontSize: "12",
						fill: "#1c1d18",
						children: "Q2 und Q3 isoliert montiert"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "1270",
						y: "204",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "11",
						fill: "#4a4c44",
						children: "Wärmeleitpaste, isolierte Pads"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "1270",
						y: "228",
						textAnchor: "middle",
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: "11",
						fill: "#4a4c44",
						children: "Rth,K-A ≈ 0,45 K/W erzwungen"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "380",
				width: "1380",
				height: "200",
				fill: "#fbf7ee",
				stroke: "#1c1d18"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "410",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "15",
				fontWeight: "600",
				fill: "#1c1d18",
				children: "Conrad- / H-Tronic-Regelkarte bleibt"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "440",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Die Original-Endstufe (ein Transistor, kleiner Kühlkörper) wird ersetzt. Regelkarte (typ. LM723), Stromgrenze und"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "464",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "OVP bleiben. Neu: Tracking-Vorregler + zwei parallele TIP35C mit Emitter-Symmetrierung."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "500",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Pv,lin mit Vorregler = 3,5 V · 3 A = 10,5 W. Ohne: (35 − 1) · 3 = 102 W — ein Transistor kann das thermisch nicht."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "536",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Analogausgang bleibt rauscharm (kein Schalt-Ripple). Deshalb Hybrid: Schaltregler für Festspannungen, Längsregler für Labor."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "40",
				y: "640",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Formel:  Tj = Tu + Pv,je · (Rth,J-C + Rth,C-K) + Pv,ges · Rth,K-A  ≤ 125 °C"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "40",
				y: "668",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Rechenblatt und Lastpunkt-Schieber stehen unter Thermik. Worst Case der Prüfung ist 1 V / 3 A, nicht 30 V."
			})
		]
	});
}
function SheetMeter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Paper, {
		no: "05",
		title: "Messtechnik, Shunts und Laborbuchsen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "1432",
				height: "26",
				fill: "#e5efe8",
				stroke: "#3d6b4f"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				x: "36",
				y: "46",
				t: "Shunt in der Rückleitung  ·  Voltmeter-Sense an der Buchse  ·  fünf Kanäle"
			}),
			[
				{
					x: 70,
					name: "+12 V"
				},
				{
					x: 350,
					name: "−12 V"
				},
				{
					x: 630,
					name: "+5 V"
				},
				{
					x: 910,
					name: "−5 V"
				},
				{
					x: 1190,
					name: "1…30 V"
				}
			].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					x: c.x,
					y: 90,
					t: `vom Regler ${c.name}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${c.x + 50} 104 V155` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jack, {
					x: c.x + 50,
					y: 166,
					label: `${c.name} +`,
					id: "disp"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${c.x + 50} 176 V230 H${c.x + 110}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jack, {
					x: c.x + 110,
					y: 240,
					label: "GND",
					id: "sh12"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
					id: "sh12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: c.x + 94,
							y: 258,
							width: "32",
							height: "16"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ref, {
							x: c.x + 110,
							y: 252,
							t: "Rsh"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
							x: c.x + 110,
							y: 290,
							t: "10 mΩ",
							anchor: "middle",
							small: true
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wire, { d: `M${c.x + 110} 274 V320` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gnd, {
					x: c.x + 110,
					y: 320
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hit, {
					id: "disp",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: c.x,
							y: 380,
							width: "210",
							height: "72"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: c.x + 105,
							y: 410,
							textAnchor: "middle",
							fontFamily: "IBM Plex Sans, sans-serif",
							fontSize: "13",
							fontWeight: "600",
							fill: "#1c1d18",
							children: "DSN-VC288"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: c.x + 105,
							y: 432,
							textAnchor: "middle",
							fontFamily: "IBM Plex Mono, monospace",
							fontSize: "11",
							fill: "#4a4c44",
							children: "V an +Buchse · A über Rsh"
						})
					]
				})
			] }, c.name)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "40",
				y: "520",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Displays intern aus der jeweiligen Schiene oder aus +12 V speisen. Eigenstrom nicht durch den Last-Shunt führen."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "40",
				y: "548",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Kelvin-Sinn: Spannungsmessung nach dem Shunt, direkt an der Buchse. Sonst liegt der 10-mΩ-Abfall in der Anzeige."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "40",
				y: "576",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fill: "#1c1d18",
				children: "Kurzschlussfest: TPS5430 intern begrenzt, Längsregler über die Regelkarte. Alle Buchsen SELV, PE nur am Gehäuse."
			})
		]
	});
}
function ThermalView() {
	const labU = useStudio((s) => s.labU);
	const labI = useStudio((s) => s.labI);
	const setLab = useStudio((s) => s.setLab);
	const usePrereg = useStudio((s) => s.usePrereg);
	const setPrereg = useStudio((s) => s.setPrereg);
	const nQ = useStudio((s) => s.nQ);
	const setNq = useStudio((s) => s.setNq);
	const rthKA = useStudio((s) => s.rthKA);
	const setRth = useStudio((s) => s.setRth);
	const tAmb = useStudio((s) => s.tAmb);
	const setTamb = useStudio((s) => s.setTamb);
	const t = thermal({
		uIn: usePrereg ? labU + 3.5 : 35,
		uOut: labU,
		i: labI,
		nQ,
		rthKA,
		rthJC: 1.1,
		rthCK: .2,
		tAmb
	});
	const naive = labPower(labU, labI, false);
	const withPre = labPower(labU, labI, true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-widest text-muted uppercase",
					children: "Pflichtaufgabe Kühlkörper"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-medium tracking-tight",
					children: "Thermische Auslegung"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-3xl text-sm leading-relaxed text-muted",
					children: "Der Längsregler ist der Fallstrick der Prüfung. Bei 1 V / 3 A und 35-V-Bus entstehen 102 W. Ein TIP35C kann das wegen Rth,J-C nicht abführen — auch nicht an einem unendlich großen Kühlkörper. Deshalb Tracking-Vorregler und zwei parallele Transistoren."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Ohne Vorregler",
						value: `${naive.pLin.toFixed(1)} W`,
						hint: `ΔU = ${(35 - labU).toFixed(1)} V`,
						hot: naive.pLin > 40
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Mit Vorregler",
						value: `${withPre.pLin.toFixed(1)} W`,
						hint: `ΔU ≈ ${withPre.uDrop.toFixed(1)} V`,
						hot: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Sperrschicht Tj",
						value: `${t.tj.toFixed(0)} °C`,
						hint: "Grenze 125 °C",
						hot: !t.ok
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Je Transistor",
						value: `${t.pvEach.toFixed(1)} W`,
						hint: `${nQ} × TIP35C`,
						hot: t.pvEach > 25
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-medium",
							children: "Arbeitspunkt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setLab(1, 3);
									setPrereg(false);
								},
								className: "min-h-11 rounded-md bg-raised px-3 text-sm",
								children: "Worst Case 1 V / 3 A"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPrereg(!usePrereg),
								className: "min-h-11 rounded-md bg-raised px-3 text-sm",
								children: ["Vorregler: ", usePrereg ? "ein" : "aus"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Ausgangsspannung",
						value: `${labU.toFixed(1)} V`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 1,
							max: 30,
							step: .5,
							value: [labU],
							onValueChange: ([v]) => setLab(v ?? 1, labI)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Laststrom",
						value: `${labI.toFixed(2)} A`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 3,
							step: .05,
							value: [labI],
							onValueChange: ([v]) => setLab(labU, v ?? 0)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Transistoren parallel",
						value: `${nQ}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 1,
							max: 4,
							step: 1,
							value: [nQ],
							onValueChange: ([v]) => setNq(v ?? 1)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Rth Kühlkörper–Luft",
						value: `${rthKA.toFixed(2)} K/W`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: .08,
							max: 2,
							step: .01,
							value: [rthKA],
							onValueChange: ([v]) => setRth(v ?? .45)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Gehäusetemperatur",
						value: `${tAmb.toFixed(0)} °C`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 25,
							max: 60,
							step: 1,
							value: [tAmb],
							onValueChange: ([v]) => setTamb(v ?? 45)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-medium",
						children: "Formel für die Dokumentation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-mono text-sm leading-relaxed",
						children: "Tj = Tu + Pv,je · (Rth,J-C + Rth,C-K) + Pv,ges · Rth,K-A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: t.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "ok",
							children: "Tj unter 125 °C — 1-Stunden-Test tragbar"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "hot",
							children: "Tj über 125 °C — Auslegung unzulässig"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Worst Case der Prüfung: 1 V / 3 A, nicht 30 V." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ein Transistor: innerer Rth,J-C ≈ 1,1 K/W macht 102 W unmöglich." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Zwei TIP35C ohne Vorregler brauchen fast Flüssigkeitskühlung." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Vorregler auf Uout+3,5 V senkt Pv auf etwa 10,5 W — das ist die Meisterlösung." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Weitere Wärme: Q1 ≈ 4 W, Schottkys ≈ 2 W, TPS5430 ≈ 1,3 W je Kanal." })
						]
					})
				]
			})
		]
	});
}
function Card({ title, value, hint, hot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs text-faint",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-1 font-mono text-2xl tabular-nums ${hot ? "text-hot" : "text-fg"}`,
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			})
		]
	});
}
function Field({ label, value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-5 block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono tabular-nums text-muted",
				children: value
			})]
		}), children]
	});
}
var NAV = [
	{
		id: "auftrag",
		label: "Auftrag",
		hint: "Vorgaben",
		icon: ClipboardList
	},
	{
		id: "block",
		label: "Blockbild",
		hint: "Topologie",
		icon: LayoutPanelTop
	},
	{
		id: "plan",
		label: "Schaltplan",
		hint: "5 Blätter",
		icon: CircuitBoard
	},
	{
		id: "thermik",
		label: "Thermik",
		hint: "Kühlung",
		icon: Flame
	},
	{
		id: "eta",
		label: "Wirkungsgrad",
		hint: "80 PLUS",
		icon: Gauge
	},
	{
		id: "bom",
		label: "Stückliste",
		hint: "BOM",
		icon: SquareDashed
	}
];
function Studio() {
	const view = useStudio((s) => s.view);
	const setView = useStudio((s) => s.setView);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "no-print flex items-center gap-3 border-b border-line px-4 py-3 md:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs tracking-widest text-muted uppercase",
						children: [
							PROJECT.code,
							" · ",
							PROJECT.exam
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-base font-medium tracking-tight md:text-lg",
						children: PROJECT.title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "no-print border-b border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 overflow-x-auto px-2 py-2 md:px-4",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const on = view === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setView(item.id),
							className: cn("flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150", on ? "bg-raised text-fg" : "text-muted hover:bg-raised hover:text-fg"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: item.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden font-mono text-xs text-faint sm:inline",
									children: item.hint
								})
							]
						}, item.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col lg:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "min-w-0 flex-1 p-3 md:p-6",
					children: [
						view === "auftrag" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuftragView, {}),
						view === "block" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockView, {}),
						view === "plan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanView, {}),
						view === "thermik" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermalView, {}),
						view === "eta" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EfficiencyView, {}),
						view === "bom" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BomView, {})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, {})]
			})
		]
	});
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-pulse rounded-full bg-raised" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: "/login",
		className: "hidden h-10 items-center rounded-md px-3 text-sm text-muted hover:text-fg sm:inline-flex",
		children: "Anmelden"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden text-sm text-muted sm:inline",
			children: user?.displayName
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
	}) })] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
