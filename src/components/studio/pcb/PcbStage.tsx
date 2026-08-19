import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { HeatId } from "@/lib/design";
import { KIT, KIT_POS, MAIN, PCB_PARTS, pcbById } from "@/lib/pcb";
import { FR4, KIT_FR4, PartMesh, PcbBody, ZonePaint } from "./meshes";
import { HeatHalos, TraceLayer } from "./traces";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type PcbStageProps = {
  mode: "inspect" | "heat";
  selected: string | null;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  temps?: Record<HeatId, number>;
  tAmb?: number;
  fanOn?: boolean;
  focusId?: string | null;
};

export default function PcbStage({
  mode,
  selected,
  hovered,
  onHover,
  onSelect,
  temps,
  tAmb = 45,
  fanOn = false,
  focusId,
}: PcbStageProps) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const klx = pcbById("klx");

  useEffect(() => {
    const id = focusId || (selected === "klx" ? "klx" : null);
    const p = id ? pcbById(id) : null;
    if (!p || !controls.current) return;
    controls.current.target.set(p.x, p.y + 6, p.z);
    controls.current.update();
  }, [focusId, selected]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [140, 160, 210], fov: 38, near: 2, far: 1200 }}
      gl={{ antialias: true }}
      onPointerMissed={() => onSelect("")}
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={["#101114"]} />
      <ambientLight intensity={0.42} />
      <directionalLight
        position={[90, 180, 70]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={500}
        shadow-camera-left={-180}
        shadow-camera-right={180}
        shadow-camera-top={180}
        shadow-camera-bottom={-180}
      />
      <directionalLight position={[-80, 60, -40]} intensity={0.28} />
      <hemisphereLight args={["#eceae4", "#1a1c18", 0.22]} />

      <Suspense fallback={null}>
        <group>
          <PcbBody w={MAIN.w} d={MAIN.d} t={MAIN.t} color={FR4} slot />
          <ZonePaint />
          <group position={[KIT_POS.x, KIT_POS.y, KIT_POS.z]}>
            <PcbBody w={KIT.w} d={KIT.d} t={KIT.t} color={KIT_FR4} />
          </group>
          <TraceLayer heatMode={mode === "heat"} temps={temps} tAmb={tAmb} />
          {mode === "heat" && <HeatHalos temps={temps} tAmb={tAmb} />}
          {[
            [KIT_POS.x - 68, KIT_POS.y / 2, KIT_POS.z - 38],
            [KIT_POS.x + 68, KIT_POS.y / 2, KIT_POS.z - 38],
            [KIT_POS.x - 68, KIT_POS.y / 2, KIT_POS.z + 38],
            [KIT_POS.x + 68, KIT_POS.y / 2, KIT_POS.z + 38],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <cylinderGeometry args={[1.4, 1.4, KIT_POS.y, 8]} />
              <meshStandardMaterial color="#8c9088" metalness={0.5} roughness={0.4} />
            </mesh>
          ))}

          {PCB_PARTS.map((part) => (
            <PartMesh
              key={part.id}
              part={part}
              selected={selected === part.id}
              hovered={hovered === part.id}
              heatMode={mode === "heat"}
              temp={part.heat && temps ? (temps[part.heat] ?? tAmb) : tAmb}
              tAmb={tAmb}
              fanOn={fanOn && part.kind === "fan"}
              onHover={onHover}
              onSelect={(id) => onSelect(id || "")}
            />
          ))}

          {klx && (
            <Html
              position={[klx.x, klx.y + 22, klx.z]}
              center
              distanceFactor={160}
              zIndexRange={[20, 0]}
              style={{ pointerEvents: "none" }}
            >
              <div
                style={{
                  background: "#18191e",
                  color: "#eceae4",
                  border: "1px solid #c43c2c",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  lineHeight: 1.35,
                  whiteSpace: "nowrap",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                }}
              >
                <div style={{ color: "#c43c2c", fontFamily: "IBM Plex Mono, monospace", fontSize: 10 }}>
                  Sth
                </div>
                Klixon auf K1 · 58 °C ein / 46 °C aus
              </div>
            </Html>
          )}
        </group>
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <circleGeometry args={[320, 48]} />
        <meshStandardMaterial color="#16171c" roughness={0.95} />
      </mesh>

      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={90}
        maxDistance={480}
        maxPolarAngle={Math.PI * 0.49}
        target={[20, 8, 0]}
      />
    </Canvas>
  );
}