import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { InstancedMesh, Object3D } from "three";
import type { HeatId } from "@/lib/design";
import { CASE, FRONT, REAR, meterCenterX, type CaseTemps, perfHoles } from "@/lib/enclosure";
import { KIT, KIT_POS, MAIN, PCB_PARTS } from "@/lib/pcb";
import { thermalCopper, thermalEmissive } from "../pcb/heat";
import { FR4, KIT_FR4, PartMesh, PcbBody, ZonePaint } from "../pcb/meshes";
import { HeatHalos, TraceLayer } from "../pcb/traces";

export type CaseStageProps = {
  lidOpen: boolean;
  explode: boolean;
  heatMode: boolean;
  temps?: Record<HeatId, number>;
  caseT: CaseTemps;
  tAmb: number;
  fanOn: boolean;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

const ALU = "#9aa09a";
const dummy = new Object3D();

export default function CaseStage({
  lidOpen,
  explode,
  heatMode,
  temps,
  caseT,
  tAmb,
  fanOn,
  hovered,
  onHover,
  onSelect,
}: CaseStageProps) {
  const wall = CASE.wall;
  const lift = explode ? 42 : lidOpen ? 56 : 0;
  const col = (t: number) => (heatMode ? thermalCopper(t, tAmb, 95) : ALU);
  const em = (t: number) => (heatMode ? thermalEmissive(t, tAmb) : 0);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [200, 145, 230], fov: 34, near: 2, far: 1600 }}
      gl={{ antialias: true }}
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={["#101114"]} />
      <ambientLight intensity={0.38} />
      <directionalLight position={[90, 170, 80]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-80, 40, -50]} intensity={0.28} />
      <hemisphereLight args={["#eceae4", "#1a1c18", 0.2]} />

      <Suspense fallback={null}>
        <group>
          <AluBox
            w={CASE.outerW}
            h={wall}
            d={CASE.outerD}
            x={0}
            y={-CASE.outerH / 2 + wall / 2}
            z={0}
            color={col(caseT.floor)}
            e={em(caseT.floor)}
          />
          <AluBox
            w={wall}
            h={CASE.outerH - wall}
            d={CASE.outerD}
            x={-CASE.outerW / 2 + wall / 2}
            y={0}
            z={0}
            color={col(caseT.inlet)}
            e={em(caseT.inlet)}
          />
          <AluBox
            w={wall}
            h={CASE.outerH - wall}
            d={CASE.outerD}
            x={CASE.outerW / 2 - wall / 2}
            y={0}
            z={0}
            color={col(caseT.inlet)}
            e={em(caseT.inlet)}
          />
          <Front z={CASE.outerD / 2 - wall / 2} color={col(caseT.front)} e={em(caseT.front)} />
          <Rear z={-CASE.outerD / 2 + wall / 2} color={col(caseT.exhaust)} e={em(caseT.exhaust)} fanOn={fanOn} />

          <group position={[0, CASE.outerH / 2 - wall / 2 + lift, 0]}>
            <AluBox
              w={CASE.outerW}
              h={wall}
              d={CASE.outerD}
              x={0}
              y={0}
              z={0}
              color={col(caseT.lid)}
              e={em(caseT.lid)}
              opacity={lidOpen ? 0.28 : 0.96}
            />
          </group>

          <Perf panel="left" />
          <Perf panel="right" />
          <Perf panel="rear" />

          {[-1, 1].map((sx) =>
            [-1, 1].map((sz) => (
              <mesh
                key={`${sx}${sz}`}
                position={[
                  (sx * CASE.boardW) / 2 - sx * 5,
                  -CASE.outerH / 2 + wall + CASE.standoff / 2,
                  (sz * CASE.boardD) / 2 - sz * 5,
                ]}
              >
                <cylinderGeometry args={[3, 3, CASE.standoff, 10]} />
                <meshStandardMaterial color="#c9cdc4" metalness={0.6} roughness={0.3} />
              </mesh>
            )),
          )}

          {[-1, 1].map((sx) =>
            [-1, 1].map((sz) => (
              <mesh
                key={`f${sx}${sz}`}
                position={[(sx * CASE.outerW) / 2 - sx * 14, -CASE.outerH / 2 - 4, (sz * CASE.outerD) / 2 - sz * 14]}
              >
                <cylinderGeometry args={[7, 7.4, 8, 16]} />
                <meshStandardMaterial color="#1c1d18" roughness={0.85} />
              </mesh>
            )),
          )}

          <PeBond />

          <group position={[0, -CASE.outerH / 2 + wall + CASE.standoff + 0.8, 0]}>
            <PcbBody w={MAIN.w} d={MAIN.d} t={MAIN.t} color={FR4} slot />
            <ZonePaint />
            <group position={[KIT_POS.x, KIT_POS.y, KIT_POS.z]}>
              <PcbBody w={KIT.w} d={KIT.d} t={KIT.t} color={KIT_FR4} />
            </group>
            <TraceLayer heatMode={heatMode} temps={temps} tAmb={tAmb} />
            {heatMode && <HeatHalos temps={temps} tAmb={tAmb} />}
            {PCB_PARTS.map((part) => (
              <PartMesh
                key={part.id}
                part={part}
                selected={false}
                hovered={hovered === part.id}
                heatMode={heatMode}
                temp={part.heat && temps ? (temps[part.heat] ?? tAmb) : tAmb}
                tAmb={tAmb}
                fanOn={fanOn && part.kind === "fan"}
                onHover={onHover}
                onSelect={onSelect}
              />
            ))}
          </group>
        </group>
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CASE.outerH / 2 - 8.2, 0]} receiveShadow>
        <circleGeometry args={[380, 48]} />
        <meshStandardMaterial color="#16171c" roughness={0.95} />
      </mesh>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={110}
        maxDistance={620}
        maxPolarAngle={Math.PI * 0.49}
        target={[0, -4, 8]}
      />
    </Canvas>
  );
}

function AluBox({
  w,
  h,
  d,
  x,
  y,
  z,
  color,
  e,
  opacity = 0.94,
}: {
  w: number;
  h: number;
  d: number;
  x: number;
  y: number;
  z: number;
  color: string;
  e: number;
  opacity?: number;
}) {
  return (
    <mesh position={[x, y, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial
        color={color}
        metalness={0.58}
        roughness={0.32}
        emissive={e > 0.02 ? color : "#000"}
        emissiveIntensity={e * 0.55}
        transparent={opacity < 0.98}
        opacity={opacity}
      />
    </mesh>
  );
}

function Front({ z, color, e }: { z: number; color: string; e: number }) {
  return (
    <group position={[0, 0, z]}>
      <AluBox w={CASE.outerW} h={CASE.outerH} d={CASE.wall} x={0} y={0} z={0} color={color} e={e} opacity={1} />
      {FRONT.labels.map((lab, i) => {
        const x = meterCenterX(i) - CASE.outerW / 2;
        const yM = FRONT.meterY + FRONT.meterH / 2 - CASE.outerH / 2;
        const yB = FRONT.bananaY - CASE.outerH / 2;
        return (
          <group key={lab}>
            <mesh position={[x, yM, CASE.wall]}>
              <boxGeometry args={[FRONT.meterW - 1.5, FRONT.meterH - 2, 3.2]} />
              <meshStandardMaterial color="#101114" roughness={0.55} />
            </mesh>
            <mesh position={[x, yM, CASE.wall + 1.8]}>
              <boxGeometry args={[38, 14, 0.4]} />
              <meshStandardMaterial color="#1a3324" emissive="#2a6b44" emissiveIntensity={0.35} />
            </mesh>
            <mesh position={[x - FRONT.bananaSpan / 2, yB, CASE.wall + 1.6]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[4, 4, 7, 16]} />
              <meshStandardMaterial color="#8a2828" metalness={0.4} roughness={0.4} />
            </mesh>
            <mesh position={[x + FRONT.bananaSpan / 2, yB, CASE.wall + 1.6]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[4, 4, 7, 16]} />
              <meshStandardMaterial color="#1c1c1f" metalness={0.4} roughness={0.4} />
            </mesh>
            <Html position={[x, yM + 18, 4]} center distanceFactor={240} style={{ pointerEvents: "none" }}>
              <div style={{ color: "#eceae4", fontSize: 10, fontFamily: "IBM Plex Mono, monospace", whiteSpace: "nowrap" }}>
                {lab}
              </div>
            </Html>
          </group>
        );
      })}
      <mesh position={[FRONT.potX - CASE.outerW / 2, FRONT.potUY - CASE.outerH / 2, CASE.wall + 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[5, 5, 6, 16]} />
        <meshStandardMaterial color="#2a2c28" />
      </mesh>
      <mesh position={[FRONT.potX - CASE.outerW / 2, FRONT.potIY - CASE.outerH / 2, CASE.wall + 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[5, 5, 6, 16]} />
        <meshStandardMaterial color="#2a2c28" />
      </mesh>
      <mesh position={[FRONT.ledX - CASE.outerW / 2, FRONT.ledY - CASE.outerH / 2, CASE.wall + 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3, 3, 4, 12]} />
        <meshStandardMaterial color="#8a2828" emissive="#c43c2c" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Rear({ z, color, e, fanOn }: { z: number; color: string; e: number; fanOn: boolean }) {
  const iecX = REAR.iecX + REAR.iecW / 2 - CASE.outerW / 2;
  const iecY = REAR.iecY + REAR.iecH / 2 - CASE.outerH / 2;
  const fanX = REAR.fanX - CASE.outerW / 2;
  const fanY = REAR.fanY - CASE.outerH / 2;
  const peX = REAR.peX - CASE.outerW / 2;
  const peY = REAR.peY - CASE.outerH / 2;
  return (
    <group position={[0, 0, z]}>
      <AluBox w={CASE.outerW} h={CASE.outerH} d={CASE.wall} x={0} y={0} z={0} color={color} e={e} opacity={1} />
      <mesh position={[iecX, iecY, -4]}>
        <boxGeometry args={[REAR.iecW, REAR.iecH, 10]} />
        <meshStandardMaterial color="#16171c" />
      </mesh>
      <mesh position={[iecX, iecY + 16, -3]}>
        <boxGeometry args={[22, 8, 6]} />
        <meshStandardMaterial color="#2a2c28" />
      </mesh>
      <mesh position={[peX, peY, -2]}>
        <cylinderGeometry args={[2.4, 2.4, 8, 12]} />
        <meshStandardMaterial color="#c9cdc4" metalness={0.65} />
      </mesh>
      <mesh position={[fanX, fanY, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[REAR.fanD / 2, REAR.fanD / 2, CASE.wall + 1.2, 28]} />
        <meshStandardMaterial color="#0c0d10" />
      </mesh>
      <mesh position={[fanX, fanY, -2.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[REAR.fanD / 2 - 1.2, 1.4, 8, 28]} />
        <meshStandardMaterial color="#2a2c28" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[fanX, fanY, -2.6]} rotation={[fanOn ? 0.8 : 0.15, 0, 0]}>
        <cylinderGeometry args={[2, 2, 1.2, 8]} />
        <meshStandardMaterial color="#2a2c28" />
      </mesh>
    </group>
  );
}

function Perf({ panel }: { panel: "left" | "right" | "rear" }) {
  const holes = useMemo(() => perfHoles().filter((h) => h.panel === panel), [panel]);
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    holes.forEach((h, i) => {
      if (panel === "left") {
        dummy.position.set(-CASE.outerW / 2 - 0.2, h.y - CASE.outerH / 2, h.x - CASE.outerD / 2);
        dummy.rotation.set(0, 0, Math.PI / 2);
      } else if (panel === "right") {
        dummy.position.set(CASE.outerW / 2 + 0.2, h.y - CASE.outerH / 2, h.x - CASE.outerD / 2);
        dummy.rotation.set(0, 0, Math.PI / 2);
      } else {
        dummy.position.set(h.x - CASE.outerW / 2, h.y - CASE.outerH / 2, -CASE.outerD / 2 - 0.2);
        dummy.rotation.set(Math.PI / 2, 0, 0);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [holes, panel]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, holes.length]}>
      <cylinderGeometry args={[CASE.holeD / 2, CASE.holeD / 2, 2.4, 8]} />
      <meshStandardMaterial color="#0c0d10" roughness={0.7} />
    </instancedMesh>
  );
}

function PeBond() {
  return (
    <group>
      <mesh position={[-92, -CASE.outerH / 2 + 10, -CASE.outerD / 2 + 8]}>
        <cylinderGeometry args={[2.4, 2.4, 8, 12]} />
        <meshStandardMaterial color="#c9cdc4" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[-80, -CASE.outerH / 2 + 6, -CASE.outerD / 2 + 18]} rotation={[0.4, 0.2, 0.1]}>
        <cylinderGeometry args={[0.9, 0.9, 36, 8]} />
        <meshStandardMaterial color="#6b8f3a" />
      </mesh>
      <Html
        position={[-92, -CASE.outerH / 2 + 22, -CASE.outerD / 2 + 8]}
        center
        distanceFactor={180}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            background: "#18191e",
            color: "#eceae4",
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 11,
            border: "1px solid #6b8f3a",
          }}
        >
          PE · M4 · unter 0,3 Ω
        </div>
      </Html>
    </group>
  );
}
