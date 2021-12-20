import { ThreeEvent, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import { BufferGeometry, Material } from 'three';
import { HexagonRepository } from '../data/HexagonRepository';
import { PbfHexagonsLoader } from '../protobuf/PbfHexagonsLoader';
import { SpatialUtil } from '../util/SpatialUtil';
import { IHexagon } from './IHexagon';
import { IHexagonBorders } from './IHexagonBorders';
import { IHexagonsProps } from './IHexagonsProps';

/**
 * functional react component responsible for drawing the hexagons
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: IHexagonsProps) => {

  const { invalidate, gl, scene, camera } = useThree();
  const { onPathChange } = props;

  const geomRef = useRef<three.BufferGeometry>(new three.BufferGeometry());
  const mtrlRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshRef = useRef<three.InstancedMesh>(new three.InstancedMesh(geomRef.current, mtrlRef.current, 168858));
  // console.log('hex compoment default (1)', meshRef.current.id, geomRef.current.id, mtrlRef.current.id);
  
  /**
   * helper objects for setting up position and color before applying to indexed instances
   */
  const tempObject = new three.Object3D();
  const tempColor = new three.Color();

  /**
   * helpers for updating color
   */
  const data = Array.from({ length: 168858 }, () => ({ color: '#FF0000', scale: 1 }))
  const colorArray = useMemo(() => new Float32Array(168858 * 3), []);
  
  let hexagonValue: IHexagon;
  useEffect(() => {

    if (meshRef.current && geomRef.current) {

      // console.log('use effect', meshRef.current.id, geomRef.current.id, meshRef.current.geometry.id);

      // const offsetHeight = 20000 * SpatialUtil.SCALE_SCENE;
      const vertices: number[] = [];
      const normals: number[] = [];
      const radius = 440 * SpatialUtil.SCALE_SCENE; // 440
      let radians = 0;
      let cosLast = 1;
      let sinLast = 0;
      let cosCurr: number;
      let sinCurr: number;
      for (let degrees=60; degrees<=360; degrees+=60) {
  
        radians = degrees * Math.PI / 180;
        cosCurr = Math.cos(radians);
        sinCurr = Math.sin(radians);
  
        // upper triangle
        vertices.push(cosCurr * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinCurr * radius);
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);
        vertices.push(0, SpatialUtil.HEXAGON_OFFSET_Y, 0); // center
  
        // 3 normals pointing upwards
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
  
        //vertical triangle A
        vertices.push(cosCurr * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinCurr * radius);
        vertices.push(cosCurr * radius, 0, sinCurr * radius);
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);
  
        normals.push((sinLast + sinCurr) / 2, 0, (cosLast + cosCurr) / -2);
        normals.push((sinLast + sinCurr) / 2, 0, (cosLast + cosCurr) / -2);
        normals.push((sinLast + sinCurr) / 2, 0, (cosLast + cosCurr) / -2);
  
        //vertical triangle B
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);
        vertices.push(cosCurr * radius, 0, sinCurr * radius);
        vertices.push(cosLast * radius, 0, sinLast * radius);
  
        normals.push((sinLast + sinCurr) / 2, 0, (cosLast + cosCurr) / -2);
        normals.push((sinLast + sinCurr) / 2, 0, (cosLast + cosCurr) / -2);
        normals.push((sinLast + sinCurr) / 2, 0, (cosLast + cosCurr) / -2);
  
        cosLast = cosCurr;
        sinLast = sinCurr;
  
      }
      const vertices32 = new Float32Array(vertices);
      const normals32 = new Float32Array(normals);
  
      geomRef.current.setAttribute('position', new three.BufferAttribute(vertices32, 3));    
      geomRef.current.setAttribute('normal', new three.BufferAttribute(normals32, 3));    
  
      // const instant = Date.now();

      HexagonRepository.getInstance().load().then(() => {

        // console.log('HexagonRepository.getInstance().getHexagons()', HexagonRepository.getInstance().getHexagons());
        HexagonRepository.getInstance().getHexagons().forEach(hexagon => {

          // place at 0 (height will be handled though scaling)
          tempObject.position.set(hexagonValue.x, -SpatialUtil.HEXAGON_OFFSET_Y, hexagonValue.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
          tempObject.scale.set(1, (SpatialUtil.HEXAGON_OFFSET_Y + hexagonValue.y) /  SpatialUtil.HEXAGON_OFFSET_Y, 1);
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(hexagon.i, tempObject.matrix);
  

        });
        meshRef.current.instanceMatrix.needsUpdate = true
      
      });

    }

  }, []);      



  useEffect(() => {

    console.log('stamp changed, updating hexagons');

    let yDest: number;
    let counter = 0;
    let rgb: number[];

    /**
     * reposition each hexagon as if property callbacks for height and color
     */
    HexagonRepository.getInstance().getHexagons().forEach(hexagon => {
  
      yDest = props.getHeight(hexagon);
      tempObject.position.set(hexagon.x, -SpatialUtil.HEXAGON_OFFSET_Y + yDest, hexagon.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
      // tempObject.rotateY(Math.PI);
      // tempObject.scale.set(1, (SpatialUtil.HEXAGON_OFFSET_Y + yDest) /  SpatialUtil.HEXAGON_OFFSET_Y, 1);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(counter, tempObject.matrix);
      meshRef.current.instanceMatrix.needsUpdate = true     
      
      rgb = props.getColor(hexagon).getRgb();
      colorArray[counter * 3 + 0] = rgb[0];
      colorArray[counter * 3 + 1] = rgb[1];
      colorArray[counter * 3 + 2] = rgb[2];
      meshRef.current.geometry.attributes.color.needsUpdate = true;

      counter++;

    });   
    
    // console.log('props.path', props.path, props.keys);
    props.keys.forEach(path => {
      const borderHexagons = HexagonRepository.getInstance().getBorder(path, props);
      borderHexagons.forEach(borderHexagon => {
          let color = props.getColor(borderHexagon);
          let rgb = path === props.path ? color.hilight().getRgb() : color.outline().getRgb();
          colorArray[borderHexagon.i * 3 + 0] = rgb[0]; 
          colorArray[borderHexagon.i * 3 + 1] = rgb[1];
          colorArray[borderHexagon.i * 3 + 2] = rgb[2];
          meshRef.current.geometry.attributes.color.needsUpdate = true;
      });
    });

    invalidate();

  }, [props.stamp]);    

  let handlePointerUp = (e:ThreeEvent<PointerEvent>) => { // 

    e.stopPropagation();
    if (e.instanceId) {
      const hexagonValue = HexagonRepository.getInstance().getHexagon(e.instanceId);
      const path = props.getPath(hexagonValue);
      if (path !== props.path) {
        // console.log('firing path change event');
        onPathChange(props.source, props.name, path);  
      }

    }

  }

  return (
    <instancedMesh ref={ meshRef } args={[null as unknown as BufferGeometry, null as unknown as Material, 168858]} castShadow receiveShadow onPointerUp={ handlePointerUp }> 
      <bufferGeometry ref={ geomRef }>
        <instancedBufferAttribute attachObject={['attributes', 'color']}  args={[colorArray, 3]}></instancedBufferAttribute>
      </bufferGeometry>
      <meshStandardMaterial ref={ mtrlRef } vertexColors={ true } color={[0.5, 0.5, 0.5]} flatShading={ true }/>
    </instancedMesh>
  );
  
};

/**
 *  onPointerOver={ handleHover }
 *   transparent={ true } opacity={ 0.1 }
 *   onPointerMove={ handlePointerMove }
 *       <cylinderBufferGeometry args={[440 * SpatialUtil.SCALE_SCENE, 440 * SpatialUtil.SCALE_SCENE, SpatialUtil.HEXAGON_SEMIHEIGHT * 2, 6, 1, false, 0, Math.PI * 2]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']}  args={[colorArray, 3]}></instancedBufferAttribute>
      </cylinderBufferGeometry>

 */

