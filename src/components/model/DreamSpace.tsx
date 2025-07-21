import { Color, Vector3 } from "three";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { EffectComposer, SSAO } from "@react-three/postprocessing";

import { Bubbles } from "./Bubbles";
import { Canvas } from "@react-three/fiber";
import Lights from "./Lights";
import { Suspense } from "react";

/**
 * モデル.
 *
 * @returns {JSX.Element} モデル.
 */
const Model = () => {
  const roomModel = useGLTF("./models/clock.glb");
  return <primitive object={roomModel.scene} />;
};

/**
 * 夢の空間.
 *
 * @returns {JSX.Element} 夢の空間.
 */
const DreamSpace = () => {
  return (
    <Canvas shadows camera={{ fov: 45, position: [-7, 0, -7] }}>
      <Lights />
      <Suspense>
        <Bubbles count={200} position={new Vector3(0, 10, 0)} />
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

export default DreamSpace;
