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

  const { size, position, label } = props;

  const geomTextRef = useRef<three.ShapeGeometry>();
  const mtrlTextRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshTextRef = useRef<three.Mesh>();

  const [font, setFont] = useState<three.Font>();

  useEffect(() => {

    console.log('✨ building label component', props);

    const loader = new FontLoader();
    loader.load( './droid_sans_mono_regular.typeface.json', (response:Font) => {
      setFont(new three.Font(response.data));
    });

  }, []);      
  
  useEffect(() => {

    console.log('🔧 updating label component', props);

    if (font) {

      // console.log('props.label', props.label);
      
      const shapes = font!.generateShapes( label, size );
      geomTextRef.current = new three.ShapeGeometry( shapes );
      geomTextRef.current.computeBoundingBox();      

      geomTextRef.current.rotateX(-Math.PI / 2);
      geomTextRef.current.translate(position.x, position.y, position.z);
      geomTextRef.current.rotateY(props.rotationY);
      meshTextRef.current!.geometry = geomTextRef.current;

    }
    
  }, [props.label, font]);      

  return (
    <mesh ref={ meshTextRef }> 
      <textGeometry ref={ geomTextRef } />
      <meshStandardMaterial ref={ mtrlTextRef } color={ [0.076 * 2.2, 0.076 * 2.2, 0.050 * 2.2] } />
    </mesh>
  );
  
};



