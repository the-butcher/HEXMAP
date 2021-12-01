import { Suspense, useRef } from "react";
import { Canvas, CanvasContext, useFrame } from "react-three-fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import * as three from "three";
import "./styles.css";
import BoxComponent from "./hexagon/BoxComponent";
import HexagonsComponent from "./hexagon/HexagonsComponent";

// const Cube = () => {

//   const cube = useRef<three.Mesh>();

//   useFrame(() => {
//     if (cube.current) {
//       cube.current.rotation.x += 0.01;
//       cube.current.rotation.y += 0.01;
//     }
//   });

//   return (
//     <mesh ref={cube}>
//       <boxBufferGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color="#0391BA" />
//     </mesh>
//   );
  
// };

const camera = {
  near: 0.1,
  far: 1000000,
  zoom: 1,
}

function onCreated(props: CanvasContext): void {
  props.gl.setClearColor("#252934");
}

export default () => {
  return (
    <div style={{ height: "100vh", width: "100vw", }}>
      {/* shadowMap */}
      <Canvas  concurrent camera={ camera } onCreated={ onCreated }>
        <Stats />
        <OrbitControls />
        <directionalLight intensity={1.0} />
        {/* <pointLight intensity={1.0} position={[0, 30, -20]} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} /> */}
        {/* <Suspense fallback={null}> */}
          {/* <gridHelper />
          <axesHelper /> */}
          <HexagonsComponent />
        {/* </Suspense> */}
      </Canvas>
    </div>
  );
};

// export default App;
