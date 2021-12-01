import { useRef, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import * as three from "three";
import { PbfHexagonsLoader } from "../protobuf/PbfHexagonsLoader";


const BoxComponent = () => {

  const cube = useRef<three.Mesh>();

  useFrame(() => {
    if (cube.current) {
      cube.current.rotation.x -= 0.001;
      cube.current.rotation.y += 0.01; 
    }
  });

  return (
    <mesh ref={cube}>
      <boxBufferGeometry args={[0.2, 1, 1]} />
      <meshStandardMaterial color="#FF91BA" />
    </mesh>
  );
  
};

export default () => {
    return (
        <BoxComponent />
    );
};