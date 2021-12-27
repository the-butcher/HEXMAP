import React, { useEffect, useRef, useState } from 'react';
import * as three from 'three';
import { Font, FontLoader } from 'three';
import { IHyperlinkProps } from './IHyperlinkProps';

/**
 * functional react component placing a 3d-text into the scene
 * unfinished, would require placement, ... 
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: IHyperlinkProps) => {

  const { size, position } = props;

  const geomTextRef = useRef<three.ShapeGeometry>();
  const mtrlTextRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshTextRef = useRef<three.Mesh>();

  const geomRectRef = useRef<three.ShapeGeometry>();
  const mtrlRectRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshRectRef = useRef<three.Mesh>();


  const [font, setFont] = useState<three.Font>();

  useEffect(() => {

    const loader = new FontLoader();
    loader.load('./droid_sans_mono_regular.typeface.json', (response: Font) => {
      setFont(new three.Font(response.data));
    });

  }, []);

  useEffect(() => {

    if (font) {

      // console.log('props.label', props.label, font);

      const shapes = font!.generateShapes(props.label, size);
      geomTextRef.current = new three.ShapeGeometry(shapes);
      geomTextRef.current.computeBoundingBox();

      const boundingBox = geomTextRef.current.boundingBox;
      const rectShape = new three.Shape()
      rectShape.moveTo(boundingBox.min.x - 2, boundingBox.min.y - 2);
      rectShape.lineTo(boundingBox.min.x - 2, boundingBox.max.y + 2);
      rectShape.lineTo(boundingBox.max.x + 2, boundingBox.max.y + 2);
      rectShape.lineTo(boundingBox.max.x + 2, boundingBox.min.y - 2);
      rectShape.lineTo(boundingBox.min.x - 2, boundingBox.min.y - 2);
      geomRectRef.current = new three.ShapeGeometry(rectShape);

      geomTextRef.current.rotateX(-Math.PI / 2);
      geomTextRef.current.translate(position.x, position.y, position.z);
      geomTextRef.current.rotateY(props.rotationY);
      meshTextRef.current!.geometry = geomTextRef.current;

      geomRectRef.current.rotateX(-Math.PI / 2);
      geomRectRef.current.translate(position.x, position.y - 0.1, position.z);
      geomRectRef.current.rotateY(props.rotationY);
      meshRectRef.current!.geometry = geomRectRef.current;

    }

  }, [props.label, font]);

  return (
    <group onClick={e => window.open(props.href)} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
      <mesh ref={meshTextRef}>
        <textGeometry ref={geomTextRef} />
        <meshStandardMaterial ref={mtrlTextRef} color={[0.02 * 1.7, 0.02 * 1.7, 0.015 * 1.7]} />
      </mesh>
      <mesh ref={meshRectRef}>
        <textGeometry ref={geomRectRef} />
        <meshStandardMaterial ref={mtrlRectRef} color={[0.0, 0.0, 0.0]} transparent={true} opacity={0.0} />
      </mesh>
    </group>
  );

};


