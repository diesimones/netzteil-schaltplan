import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { type Group } from "three";
import type { Footprint, PcbPart } from "@/lib/pcb";
import { thermalEmissive, thermalHex } from "./heat";

const FR4 = "#1b4a32";
const FR4_EDGE = "#c4b48a";
const KIT_FR4 = "#163828";
const PLASTIC = "#1c1c1f";
const CREAM = "#d4cbb0";
const BLUE = "#1c2e48";
const ALU = "#8c9088";
const FERRITE = "#2a2a30";
const LED_RED = "#9a3030";

export function PcbBody({
  w,
  d,
  t,
  color,
  slot,
}: {
  w: number;
  d: number;
  t: number;
  color: string;
  slot?: boolean;
}) {
  return (
    <group>
      <mesh position={[0, t / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, t, d]} />
        <meshStandardMaterial color={color} roughness={0.82} metalness={0.05} />
      </mesh>
      <mesh position={[0, t / 2, d / 2 + 0.15]} receiveShadow>
        <boxGeometry args={[w, t, 0.3]} />
        <meshStandardMaterial color={FR4_EDGE} roughness={0.7} />
      </mesh>
      <mesh position={[0, t / 2, -d / 2 - 0.15]} receiveShadow>
        <boxGeometry args={[w, t, 0.3]} />
        <meshStandardMaterial color={FR4_EDGE} roughness={0.7} />
      </mesh>
      {slot && (
        <mesh position={[-14, t / 2 + 0.05, 0]}>
          <boxGeometry args={[3.2, t + 0.4, d * 0.82]} />
          <meshStandardMaterial color="#0e0f12" roughness={1} />
        </mesh>
      )}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} position={[(w / 2 - 5) * sx, t + 0.05, (d / 2 - 5) * sz]}>
          <cylinderGeometry args={[1.6, 1.6, 0.3, 12]} />
          <meshStandardMaterial color={ALU} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export function ZonePaint() {
  return (
    <group position={[0, 1.65, 0]}>
      <mesh position={[-78, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[88, 148]} />
        <meshStandardMaterial color="#5a2a28" transparent opacity={0.18} roughness={1} />
      </mesh>
      <mesh position={[52, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 148]} />
        <meshStandardMaterial color="#2a4a62" transparent opacity={0.12} roughness={1} />
      </mesh>
    </group>
  );
}

export function PartMesh({
  part,
  selected,
  hovered,
  heatMode,
  temp,
  tAmb,
  fanOn,
  onHover,
  onSelect,
}: {
  part: PcbPart;
  selected: boolean;
  hovered: boolean;
  heatMode: boolean;
  temp: number;
  tAmb: number;
  fanOn: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const limit = part.heat === "hs" ? 90 : 125;
  const base = baseColor(part.kind);
  const color = heatMode && part.heat ? thermalHex(temp, tAmb, limit, base) : base;
  const glow = heatMode && part.heat ? thermalEmissive(temp, tAmb) : 0;
  const emissive = hovered || selected ? "#d8d4c8" : heatMode && glow > 0 ? color : "#000000";
  const eInt = hovered || selected ? 0.22 : glow;

  return (
    <group
      position={[part.x, part.y, part.z]}
      rotation={[0, (part.rot * Math.PI) / 180, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(part.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(part.id);
      }}
    >
      <Body kind={part.kind} color={color} emissive={emissive} eInt={eInt} fanOn={fanOn} />
      {hovered && (
        <mesh position={[0, 18, 0]}>
          <sphereGeometry args={[1.1, 8, 8]} />
          <meshBasicMaterial color="#eceae4" />
        </mesh>
      )}
    </group>
  );
}

function baseColor(kind: Footprint) {
  if (kind === "elko" || kind === "elkoTall") return BLUE;
  if (kind === "heatsink" || kind === "fan") return ALU;
  if (kind === "efd30" || kind === "choke" || kind === "inductor") return FERRITE;
  if (kind === "ceramic" || kind === "res") return CREAM;
  if (kind === "resPwr") return "#6a5a40";
  if (kind === "led") return LED_RED;
  if (kind === "pot") return "#3a342c";
  if (kind === "iec" || kind === "terminal") return "#2a2a2c";
  return PLASTIC;
}

function Body({
  kind,
  color,
  emissive,
  eInt,
  fanOn,
}: {
  kind: Footprint;
  color: string;
  emissive: string;
  eInt: number;
  fanOn: boolean;
}) {
  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={eInt}
      roughness={0.55}
      metalness={kind === "heatsink" ? 0.55 : 0.08}
    />
  );

  switch (kind) {
    case "iec":
      return (
        <group>
          <mesh position={[0, 8, 0]} castShadow>
            <boxGeometry args={[18, 16, 22]} />
            {mat}
          </mesh>
          {[ -5, 0, 5 ].map((x) => (
            <mesh key={x} position={[x, 8, 8]}>
              <cylinderGeometry args={[1.4, 1.4, 4, 10]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          ))}
        </group>
      );
    case "fuse":
      return (
        <group>
          <mesh position={[-6, 3, 0]}>
            <boxGeometry args={[3, 4, 5]} />
            {mat}
          </mesh>
          <mesh position={[6, 3, 0]}>
            <boxGeometry args={[3, 4, 5]} />
            {mat}
          </mesh>
          <mesh position={[0, 4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.6, 1.6, 12, 12]} />
            <meshStandardMaterial color="#c9cdc4" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      );
    case "choke":
      return (
        <group>
          <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[7, 2.4, 10, 20]} />
            {mat}
          </mesh>
          <mesh position={[-4, 7, 0]}>
            <boxGeometry args={[5, 6, 6]} />
            <meshStandardMaterial color={CREAM} />
          </mesh>
          <mesh position={[4, 7, 0]}>
            <boxGeometry args={[5, 6, 6]} />
            <meshStandardMaterial color={CREAM} />
          </mesh>
        </group>
      );
    case "bridge":
      return (
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[10, 10, 10]} />
          {mat}
        </mesh>
      );
    case "elko":
      return <Elko h={14} r={5} color={color} emissive={emissive} eInt={eInt} />;
    case "elkoTall":
      return <Elko h={22} r={7.5} color={color} emissive={emissive} eInt={eInt} />;
    case "res":
      return (
        <mesh position={[0, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.1, 1.1, 7, 10]} />
          {mat}
        </mesh>
      );
    case "resPwr":
      return (
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[10, 5, 4.5]} />
          {mat}
        </mesh>
      );
    case "ceramic":
      return (
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[5, 3.2, 3.2]} />
          {mat}
        </mesh>
      );
    case "to220":
      return <ToPack w={10} h={15} d={4.2} tab={true} color={color} emissive={emissive} eInt={eInt} />;
    case "to218":
      return <ToPack w={14} h={18} d={5} tab={true} color={color} emissive={emissive} eInt={eInt} />;
    case "to126":
      return <ToPack w={8} h={8} d={3.2} tab={true} color={color} emissive={emissive} eInt={eInt} />;
    case "efd30":
      return (
        <group>
          <mesh position={[0, 10, 0]} castShadow>
            <boxGeometry args={[16, 8, 30]} />
            {mat}
          </mesh>
          <mesh position={[0, 10, 0]}>
            <boxGeometry args={[22, 14, 8]} />
            {mat}
          </mesh>
          <mesh position={[0, 10, 0]}>
            <boxGeometry args={[12, 16, 18]} />
            <meshStandardMaterial color="#c4b07a" roughness={0.7} />
          </mesh>
        </group>
      );
    case "dip8":
      return <Dip pins={8} color={color} emissive={emissive} eInt={eInt} />;
    case "dip14":
      return <Dip pins={14} color={color} emissive={emissive} eInt={eInt} />;
    case "soic":
      return (
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[6, 1.6, 5]} />
          {mat}
        </mesh>
      );
    case "inductor":
      return (
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[4.2, 4.2, 8, 14]} />
          {mat}
        </mesh>
      );
    case "pot":
      return (
        <group>
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[7, 5, 8]} />
            {mat}
          </mesh>
          <mesh position={[0, 7, 0]}>
            <cylinderGeometry args={[1.4, 1.4, 4, 10]} />
            <meshStandardMaterial color="#c9cdc4" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      );
    case "terminal":
      return (
        <mesh position={[0, 6, 0]} castShadow>
          <boxGeometry args={[16, 10, 8]} />
          {mat}
        </mesh>
      );
    case "led":
      return (
        <group>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[2.4, 2.4, 5, 12]} />
            <meshStandardMaterial color={color} emissive={LED_RED} emissiveIntensity={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[0, 6.6, 0]}>
            <sphereGeometry args={[2.4, 12, 10]} />
            <meshStandardMaterial color={color} emissive={LED_RED} emissiveIntensity={0.55} roughness={0.3} />
          </mesh>
        </group>
      );
    case "opto":
      return (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[6.5, 3.4, 4.5]} />
          {mat}
        </mesh>
      );
    case "heatsink":
      return <Heatsink color={color} emissive={emissive} eInt={eInt} />;
    case "fan":
      return <Fan color={color} spin={fanOn} />;
    case "klixon":
      return (
        <group>
          <mesh position={[0, -2.4, 0]}>
            <boxGeometry args={[18, 1.4, 12]} />
            <meshStandardMaterial color="#8c9088" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, 4.6, 0]} castShadow>
            <cylinderGeometry args={[7.2, 7.2, 5.4, 20]} />
            <meshStandardMaterial
              color="#6b3a24"
              emissive={emissive}
              emissiveIntensity={Math.max(eInt, 0.08)}
              metalness={0.18}
              roughness={0.5}
            />
          </mesh>
          <mesh position={[0, 7.5, 0]}>
            <cylinderGeometry args={[5.4, 5.4, 1.1, 20]} />
            <meshStandardMaterial color="#d8d4c8" metalness={0.55} roughness={0.28} />
          </mesh>
          <mesh position={[-4.4, 3.2, 8.2]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[2.2, 2.4, 5]} />
            <meshStandardMaterial color="#c4b07a" metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh position={[4.4, 3.2, 8.2]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[2.2, 2.4, 5]} />
            <meshStandardMaterial color="#c4b07a" metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh position={[0, 12.5, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 8, 8]} />
            <meshStandardMaterial color="#c43c2c" />
          </mesh>
          <mesh position={[0, 17, 0]}>
            <sphereGeometry args={[1.5, 10, 10]} />
            <meshStandardMaterial color="#c43c2c" emissive="#c43c2c" emissiveIntensity={0.55} />
          </mesh>
        </group>
      );
    case "header":
      return (
        <group>
          {[-16, -8, 0, 8, 16].map((x) => (
            <mesh key={x} position={[x, 3, 0]}>
              <boxGeometry args={[5, 5, 6]} />
              <meshStandardMaterial color="#1a1a1c" />
            </mesh>
          ))}
        </group>
      );
    default:
      return (
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[6, 4, 6]} />
          {mat}
        </mesh>
      );
  }
}

function Elko({
  h,
  r,
  color,
  emissive,
  eInt,
}: {
  h: number;
  r: number;
  color: string;
  emissive: string;
  eInt: number;
}) {
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r, h, 18]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={eInt} roughness={0.4} />
      </mesh>
      <mesh position={[0, h + 0.3, 0]}>
        <cylinderGeometry args={[r - 0.2, r - 0.2, 0.6, 18]} />
        <meshStandardMaterial color="#c9cdc4" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[r - 0.4, h / 2, 0]}>
        <boxGeometry args={[0.6, h * 0.7, 1.2]} />
        <meshStandardMaterial color="#c9cdc4" />
      </mesh>
    </group>
  );
}

function ToPack({
  w,
  h,
  d,
  tab,
  color,
  emissive,
  eInt,
}: {
  w: number;
  h: number;
  d: number;
  tab: boolean;
  color: string;
  emissive: string;
  eInt: number;
}) {
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={eInt} roughness={0.5} />
      </mesh>
      {tab && (
        <mesh position={[0, h + 2, -0.4]}>
          <boxGeometry args={[w * 0.7, 4, 0.6]} />
          <meshStandardMaterial color={ALU} metalness={0.65} roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}

function Dip({
  pins,
  color,
  emissive,
  eInt,
}: {
  pins: number;
  color: string;
  emissive: string;
  eInt: number;
}) {
  const rows = pins / 2;
  return (
    <mesh position={[0, 2, 0]}>
      <boxGeometry args={[6.4, 3.2, rows * 2.54 + 1]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={eInt} roughness={0.55} />
    </mesh>
  );
}

function Heatsink({ color, emissive, eInt }: { color: string; emissive: string; eInt: number }) {
  const fins = useMemo(() => Array.from({ length: 9 }, (_, i) => i), []);
  return (
    <group>
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[78, 3, 16]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={eInt} metalness={0.55} roughness={0.35} />
      </mesh>
      {fins.map((i) => (
        <mesh key={i} position={[-32 + i * 8, 16, 0]} castShadow>
          <boxGeometry args={[1.4, 24, 16]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={eInt} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Fan({ color, spin }: { color: string; spin: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current && spin) ref.current.rotation.z += Math.min(dt, 0.05) * 18;
  });
  return (
    <group>
      <mesh position={[0, 16, 0]} castShadow>
        <boxGeometry args={[32, 32, 12]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.5} />
      </mesh>
      <group ref={ref} position={[0, 16, 7]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            <boxGeometry args={[4, 22, 1.2]} />
            <meshStandardMaterial color="#2a2a2c" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export { FR4, KIT_FR4 };
