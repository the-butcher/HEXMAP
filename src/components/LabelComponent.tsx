import React, { useEffect, useRef, useState } from 'react';
import * as three from 'three';
import { Font, FontLoader } from 'three';
import { ILabelProps } from './ILabelProps';

/**
 * functional react component placing a 3d-text into the scene
 * unfinished, would require placement, ... 
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: ILabelProps) => { 

  const { size, position } = props;

  const geomRef = useRef<three.ShapeGeometry>();
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

    if (font) {

      // console.log('props.label', props.label, font);
      
      const shapes = font!.generateShapes( props.label, size );
      geomRef.current = new three.ShapeGeometry( shapes );
      geomRef.current.computeBoundingBox();      
  
      geomRef.current.rotateX(-Math.PI / 2);
      geomRef.current.translate(position.x, position.y, position.z);
      geomRef.current.rotateY(props.rotationY);

      meshRef.current!.geometry = geomRef.current;

    }
    
  }, [props.label, font]);      

  return (
    <mesh ref={ meshRef }> 
      <textGeometry ref={ geomRef } />
      <meshStandardMaterial ref={ mtrlRef } color={ [0.076 * 2.2, 0.076 * 2.2, 0.050 * 2.2] } />
    </mesh>
  );
  
};



