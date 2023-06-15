import { OrbitControls, useGLTF } from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

/**
 * 照明.
 *
 * @returns {JSX.Element} 照明.
 */
const Lights = () => {
  return (
    <>
      <directionalLight castShadow intensity={1.5} />
      <ambientLight intensity={0.5} />
    </>
  );
};

/**
 * モデル.
 *
 * @returns {JSX.Element} モデル.
 */
const Model = () => {
  // TODO: Bakedしたモデルをインポート
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
    <>
      {/* TODO: カメラ・背景の調整が必要 */}
      <Canvas shadows camera={{ fov: 45, position: [-7, 0, -7] }}>
        <Lights />
        <Suspense>
          <Model />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default DreamSpace;