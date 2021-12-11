import React, { useEffect, useRef, useState } from 'react';
import * as three from 'three';
import { Font, FontLoader, Material, Mesh, Shape, ShapeGeometry, TextGeometry } from 'three';
import { ILabelProps } from './ILabelProps';

export default (props: ILabelProps) => {

  const geomRef = useRef<three.TextGeometry>();
  const mtrlRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshRef = useRef<three.Mesh>();

  const [font, setFont] = useState<three.Font>();

  useEffect(() => {
    const loader = new FontLoader();
    loader.load( './droid_sans_mono_regular.typeface.json', (response:Font) => {
      setFont(new three.Font(response.data));
    });
  }, []);      
  
  useEffect(() => {

    geomRef.current = new TextGeometry( props.label, {

      font: font!,

      size: 18,
      height: 0.2,
      curveSegments: 10,

      bevelThickness: 0.5,
      bevelSize: 0.5,
      bevelEnabled: true

    });

    geomRef.current.computeBoundingBox();      
    // geomRef.current.rotateX(-Math.PI / 2);
    geomRef.current.translate(-200, 1.1, -50);
    
    meshRef.current!.geometry = geomRef.current;
    // meshRef.current!.position.set(-20, 0, -3);
    // meshRef.current!.updateMatrix();
    // meshRef.current!.matrix.needsUpdate = true

  }, [props.label]);      

  

  return (
    <mesh ref={ meshRef } castShadow > 
      <textGeometry ref={ geomRef } />
      <meshStandardMaterial ref={ mtrlRef } color={[0.01, 0.01, 0.01]} />
    </mesh>
  );

  
  
};



