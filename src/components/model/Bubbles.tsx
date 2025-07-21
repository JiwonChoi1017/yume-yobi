import {
  BufferGeometry,
  Color,
  InstancedMesh,
  Material,
  Object3D,
  Vector3,
} from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";

import { ContactShadows } from "@react-three/drei";
import Lights from "./Lights";

/** Props. */
interface Props {
  /** 数. */
  count: number;
  /** 位置. */
  position: Vector3;
}

/**
 * 泡.
 *
 * @param {Props} props
 * @returns {JSX.Element} 泡.
 */
export const Bubbles = ({ count, ...props }: Props) => {
  const mesh =
    useRef<InstancedMesh<BufferGeometry, Material | Material[]>>(null);
  const [dummy] = useState(() => new Object3D());

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 50;
      const factor = 30 + Math.random() * 100;
      const speed = 0.0005 + Math.random() / 500;
      const xFactor = -40 + Math.random() * 80;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1, Math.cos(t) * 3);
      particle.mx +=
        (state.mouse.x * state.viewport.width - particle.mx) * 0.02;
      particle.my +=
        (state.mouse.y * state.viewport.height - particle.my) * 0.02;
      dummy.position.set(
        (particle.mx / 5) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 8) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 8) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });

    if (!mesh.current) {
      return;
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
      {...props}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial roughness={1} color="rgb(207, 216, 217)" />
    </instancedMesh>
  );
};

/**
 * 泡(背景用).
 *
 * @returns {JSX.Element} 泡(背景用).
 */
export const BackgroundBubbles = () => {
  return (
    <Canvas shadows camera={{ fov: 45, position: [-7, 0, -7] }}>
      <Lights />
      <Suspense>
        {/* <Bubbles count={200} position={new Vector3(0, 10, 0)} /> */}
        <ContactShadows
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -30, 0]}
          opacity={0.6}
          width={130}
          height={130}
          blur={1}
          far={40}
        />
        <EffectComposer multisampling={0}>
          <SSAO
            samples={20}
            radius={5}
            intensity={30}
            luminanceInfluence={0.05}
            // 暫定措置
            color={new Color(255, 237, 119)}
            worldDistanceThreshold={1}
            worldDistanceFalloff={0.01}
            worldProximityThreshold={0.1}
            worldProximityFalloff={0.1}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};
