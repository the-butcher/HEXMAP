import { ThreeEvent, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import { BufferGeometry, Material } from 'three';
import { HexagonRepository } from '../data/HexagonRepository';
import { SpatialUtil } from '../util/SpatialUtil';
import { IHexagon } from './IHexagon';
import { IHexagonsProps } from './IHexagonsProps';
import { IHexagonState } from './IHexagonState';

/**
 * functional react component responsible for drawing the hexagons
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: IHexagonsProps) => {

  const { invalidate, gl, scene, camera } = useThree();
  const { stamp, fraction, onPathChange, onHexagonsLoaded } = props;

  const hexagonCount = 174414;

  const geomRef = useRef<three.BufferGeometry>(new three.BufferGeometry());
  const mtrlRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshRef = useRef<three.InstancedMesh>(new three.InstancedMesh(geomRef.current, mtrlRef.current, hexagonCount));


  /**
   * helper objects for setting up position and color before applying to indexed instances
   */
  const tempObject = new three.Object3D();
  // const tempColor = new three.Color();

  /**
   * helpers for updating color
   */
  // const data = Array.from({ length: hexagonCount }, () => ({ color: '#FF0000', scale: 1 }))
  const colorCurr = useMemo(() => new Float32Array(hexagonCount * 3), []);
  const colorDest = useMemo(() => new Float32Array(hexagonCount * 3), []);

  const heightCurr = useMemo(() => new Float32Array(hexagonCount), []);
  const heightDest = useMemo(() => new Float32Array(hexagonCount), []);

  let hexagonValue: IHexagon;
  useEffect(() => {

    console.debug('✨ building hexagons component', props);

    if (meshRef.current && geomRef.current) {

      // const offsetHeight = 20000 * SpatialUtil.SCALE_SCENE;
      const vertices: number[] = [];
      const normals: number[] = [];
      const radius = 440 * SpatialUtil.SCALE_SCENE; // 440
      let radians = 0;
      let cosLast = 1;
      let sinLast = 0;
      let cosCurr: number;
      let sinCurr: number;
      for (let degrees = 60; degrees <= 360; degrees += 60) {

        radians = degrees * Math.PI / 180;
        cosCurr = Math.cos(radians);
        sinCurr = Math.sin(radians);

        // upper triangle
        vertices.push(cosCurr * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinCurr * radius);
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);
        vertices.push(0, SpatialUtil.HEXAGON_OFFSET_Y, 0); // center

        // 3 normals pointing upwards
        normals.push(cosCurr * radius, 1, sinCurr * radius);
        normals.push(cosLast * radius, 1, sinLast * radius);
        normals.push(0, 1, 0);

        //vertical triangle A
        vertices.push(cosCurr * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinCurr * radius);
        vertices.push(cosCurr * radius, 0, sinCurr * radius);
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);

        normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);

        //vertical triangle B
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);
        vertices.push(cosCurr * radius, 0, sinCurr * radius);
        vertices.push(cosLast * radius, 0, sinLast * radius);

        normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);
        normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);

        cosLast = cosCurr;
        sinLast = sinCurr;

      }
      const vertices32 = new Float32Array(vertices);
      const normals32 = new Float32Array(normals);

      geomRef.current.setAttribute('position', new three.BufferAttribute(vertices32, 3));
      geomRef.current.setAttribute('normal', new three.BufferAttribute(normals32, 3));

      HexagonRepository.getInstance().load().then(() => {
        onHexagonsLoaded();
      });

    }

  }, []);



  useEffect(() => {

    console.debug('🔧 updating hexagons component (stamp)', props);
    const tsA = Date.now();

    let counter = 0;
    let rgb: number[];
    let state: IHexagonState;

    /**
     * reposition each hexagon as if property callbacks for height and color
     */
    HexagonRepository.getInstance().getHexagons().forEach(hexagon => {

      state = props.getState(hexagon);
      heightDest[counter] = state.height;

      // tempObject.position.set(hexagon.x, -SpatialUtil.HEXAGON_OFFSET_Y + state.height, hexagon.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
      // tempObject.updateMatrix();
      // meshRef.current.setMatrixAt(counter, tempObject.matrix);
      // meshRef.current.instanceMatrix.needsUpdate = true

      rgb = state.color.getRgb();
      colorDest[counter * 3 + 0] = rgb[0];
      colorDest[counter * 3 + 1] = rgb[1];
      colorDest[counter * 3 + 2] = rgb[2];
      // meshRef.current.geometry.attributes.color.needsUpdate = true;

      counter++;

    });

    props.keys.forEach(path => {
      HexagonRepository.getInstance().getBorder(path, props).then(borderHexagons => {
        borderHexagons.forEach(borderHexagon => {
          state = props.getState(borderHexagon);
          let color = state.color;
          let rgb = path === props.path ? color.hilight().getRgb() : color.outline().getRgb();
          colorDest[borderHexagon.i * 3 + 0] = rgb[0];
          colorDest[borderHexagon.i * 3 + 1] = rgb[1];
          colorDest[borderHexagon.i * 3 + 2] = rgb[2];
          // meshRef.current.geometry.attributes.color.needsUpdate = true;
        });
      });
    });

    console.debug('🕓 updating hexagons component (stamp, done)', Date.now() - tsA);

    invalidate();

  }, [stamp]);

  useEffect(() => {

    console.debug('🔧 updating hexagons component (fraction)', fraction);
    const tsA = Date.now();

    let counter = 0;
    HexagonRepository.getInstance().getHexagons().forEach(hexagon => {

      heightCurr[counter] = heightCurr[counter] + (heightDest[counter] - heightCurr[counter]) * fraction;
      tempObject.position.set(hexagon.x, -SpatialUtil.HEXAGON_OFFSET_Y + heightCurr[counter], hexagon.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
      // tempObject.rotateY(Math.PI);
      // tempObject.scale.set(1, (SpatialUtil.HEXAGON_OFFSET_Y + yDest) /  SpatialUtil.HEXAGON_OFFSET_Y, 1);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(counter, tempObject.matrix);
      meshRef.current.instanceMatrix.needsUpdate = true

      counter++;

    });

    // console.log('frame', Date.now());
    for (let i = 0; i < colorDest.length; i++) {
      colorCurr[i] = colorCurr[i] + (colorDest[i] - colorCurr[i]) * fraction;
    }
    meshRef.current.geometry.attributes.color.needsUpdate = true;

    console.debug('🕓 updating hexagons component (fraction, done)', Date.now() - tsA);

  }, [fraction]);


  let handleClick = (e: ThreeEvent<PointerEvent>) => { // 

    e.stopPropagation();
    if (e.instanceId && e.delta < 5) {
      const hexagonValue = HexagonRepository.getInstance().getHexagon(e.instanceId);
      if (hexagonValue.luc >= 100) {
        const path = props.getPath(hexagonValue);
        if (path !== props.path) {
          onPathChange(props.source, props.name, path);
        }
      }
    }

  }

  return (
    <instancedMesh ref={meshRef} args={[null as unknown as BufferGeometry, null as unknown as Material, hexagonCount]} castShadow receiveShadow onClick={handleClick}>
      <bufferGeometry ref={geomRef}>
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorCurr, 3]}></instancedBufferAttribute>
      </bufferGeometry>
      <meshStandardMaterial ref={mtrlRef} vertexColors={true} color={[0.5, 0.5, 0.5]} />
    </instancedMesh>
  );

};
