import { ThreeEvent, useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import { PbfHexagonsLoader } from '../protobuf/PbfHexagonsLoader';
import { SpatialUtil } from '../util/SpatialUtil';
import { IHexagonsComponentProps } from './IHexagonsComponentProps';
import { IHexagonValues } from './IHexagonValues';

export default (props: IHexagonsComponentProps) => {

  const valueIndexGkz = 0;
  const valueIndexLuc = 1;
  const valueIndexX = 2;
  const valueIndexY = 3;
  const valueIndexZ = 4;

  const meshRef = useRef<three.InstancedMesh>();
  const geomRef = useRef<three.BufferGeometry>(new three.BufferGeometry());



  /**
   * hack to avoid errors further down
   */
  const dg = new three.BufferGeometry();
  const dm = new three.Material();
  
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

  // TODO maybe reduce to a lighter data structure (values only)
  // let pbfHexagonArray: PbfHexagon[];
  let hexagonValues: IHexagonValues[] = [];
  let hexagonValue: IHexagonValues;

  useEffect(() => {

    console.log('use effect', geomRef.current.getAttribute('position'));
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

      //vertical triangle A
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

    const instant = Date.now();
    new PbfHexagonsLoader().load('./hexagons.pbf').then(pbfHexagons => {

      let counter = 0;
      let values: number[];
      let yOffset: number;
      let color: number[];

      pbfHexagons.getHexagons().forEach(pbfHexagon => {

        // color = ColorUtil.getCorineColor(values[valueIndexCode]);
        values = pbfHexagon.getValues();
        yOffset = values[valueIndexX] % 2 === 0 ? 0 : SpatialUtil.HEXAGON_SPACING_X / 2;

        /**
         * intial values
         */
         hexagonValue = {
          x: values[valueIndexX] * SpatialUtil.HEXAGON_SPACING_Y + SpatialUtil.HEXAGON_ORIGIN_X,
          y: 0,
          z: values[valueIndexY] * SpatialUtil.HEXAGON_SPACING_X - yOffset - SpatialUtil.HEXAGON_ORIGIN_Y,
          r: 0,
          g: 0,
          b: 0,
          gkz: values[valueIndexGkz],
          luc: values[valueIndexLuc],
          ele: SpatialUtil.toZ(values[valueIndexZ] / SpatialUtil.SCALE_PRECISION)
        };
        hexagonValues.push(hexagonValue);
        hexagonValue.y = props.renderer.getHeight(hexagonValue);

        // place at 0 (height will be handled though scaling)
        tempObject.position.set(hexagonValue.x, -SpatialUtil.HEXAGON_OFFSET_Y, hexagonValue.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
        tempObject.scale.set(1, (SpatialUtil.HEXAGON_OFFSET_Y + hexagonValue.y) /  SpatialUtil.HEXAGON_OFFSET_Y, 1);
        tempObject.updateMatrix();
        meshRef.current?.setMatrixAt(counter, tempObject.matrix);

        // ColorUtil.getCorineColor(values[valueIndexLuc]).map((value, index) => colorArray[counter * 3 + index] = value);

        counter++;
  
      });

      if (meshRef.current) {
        meshRef.current.instanceMatrix.needsUpdate = true
      //   hexagons.current.geometry.attributes.color.needsUpdate = true;
      }

    });

  }, []);      

  let handlePointerMove = (e:ThreeEvent<PointerEvent>) => { // 
    e.stopPropagation();
    if (e.instanceId) {
      // const hexagonValue = hexagonValues[e.instanceId];
      // console.log('hexagonValue', hexagonValue.gkz);
    }
    // if (e.instanceId) {
    //   console.log(e.instanceId);
    //   colorArray[e.instanceId * 3] = 100;
    //   colorArray[e.instanceId * 3 + 1] = 0;
    //   colorArray[e.instanceId * 3 + 2] = 0;
    //   if (hexagons.current) {
    //     hexagons.current.instanceMatrix.needsUpdate = true
    //     hexagons.current.geometry.attributes.color.needsUpdate = true;
    //   }      
    // }
  }

  useFrame(() => {

    
    const schedule = props.renderer.getSchedule();

    // any schedule in place => need to apply
    if (schedule.instantA >= 0 && schedule.instantB >= 0) {

      console.log('handling schedule');

      const instant = Date.now();
      const fraction = three.MathUtils.smootherstep(instant, schedule.instantA, schedule.instantB);

      let color = [0, 0, 0];
      let yDest;
      let yCurr;
      let done = instant > schedule.instantB;
      let counter = 0;

      hexagonValues.forEach(hexagonValue => {

          yDest = props.renderer.getHeight(hexagonValue);

          if (yDest != hexagonValue.y) {
            yCurr = hexagonValue.y + (yDest - hexagonValue.y) * fraction;
            // tempObject.position.set(hexagonValue.x, 0, hexagonValue.z); // yCurr - SpatialUtil.HEXAGON_SEMIHEIGHT
            tempObject.scale.set(1, (SpatialUtil.HEXAGON_OFFSET_Y + yCurr) /  SpatialUtil.HEXAGON_OFFSET_Y, 1);
            tempObject.updateMatrix();
            meshRef.current!.setMatrixAt(counter, tempObject.matrix);
            meshRef.current!.instanceMatrix.needsUpdate = true            
            if (done) {
              hexagonValue.y = yDest;
            }
          }

          color = props.renderer.getColor(hexagonValue, color);
          if (color[0] !== hexagonValue.r || color[1] !== hexagonValue.g || color[2] !== hexagonValue.b) {
            hexagonValue.y = hexagonValue.y + (yDest - hexagonValue.y) * fraction;
            colorArray[counter * 3 + 0] = hexagonValue.r + (color[0] - hexagonValue.r) * fraction;
            colorArray[counter * 3 + 1] = hexagonValue.g + (color[1] - hexagonValue.g) * fraction;
            colorArray[counter * 3 + 2] = hexagonValue.b + (color[2] - hexagonValue.b) * fraction;
            meshRef.current!.geometry.attributes.color.needsUpdate = true;
            if (done) {
              hexagonValue.r = color[0];
              hexagonValue.g = color[1];
              hexagonValue.b = color[2];
            }
          }

          counter++;
    
      });

      if (done) {
        console.log('clearing schedule', schedule.instantB, Date.now());
        schedule.instantA = -1;
        schedule.instantB = -1;
      }

    } else {
      // no need to change anything
    }

  });

  return (
    <instancedMesh ref={ meshRef } args={[dg, dm, 168858]}> 
      <bufferGeometry ref={ geomRef }>
        <instancedBufferAttribute attachObject={['attributes', 'color']}  args={[colorArray, 3]}></instancedBufferAttribute>
      </bufferGeometry>
      <meshStandardMaterial vertexColors={ true } color={[0.5, 0.5, 0.5]} flatShading={ true }  />
    </instancedMesh>
  );
  
};

/**
 *   onPointerMove={ handlePointerMove }
 *       <cylinderBufferGeometry args={[440 * SpatialUtil.SCALE_SCENE, 440 * SpatialUtil.SCALE_SCENE, SpatialUtil.HEXAGON_SEMIHEIGHT * 2, 6, 1, false, 0, Math.PI * 2]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']}  args={[colorArray, 3]}></instancedBufferAttribute>
      </cylinderBufferGeometry>

 */

