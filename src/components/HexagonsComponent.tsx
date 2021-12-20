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

        console.log('HexagonRepository.getInstance().getHexagons()', HexagonRepository.getInstance().getHexagons());
        HexagonRepository.getInstance().getHexagons().forEach(hexagon => {

          // place at 0 (height will be handled though scaling)
          tempObject.position.set(hexagonValue.x, -SpatialUtil.HEXAGON_OFFSET_Y, hexagonValue.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
          tempObject.scale.set(1, (SpatialUtil.HEXAGON_OFFSET_Y + hexagonValue.y) /  SpatialUtil.HEXAGON_OFFSET_Y, 1);
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(hexagon.i, tempObject.matrix);
  

        });
        meshRef.current.instanceMatrix.needsUpdate = true
      
      });

      // new PbfHexagonsLoader().load('./hexagons.pbf').then(pbfHexagons => {
  
      //   // console.log('loading hexagons');
  
      //   let values: number[];
      //   let yOffset: number;
      //   let color: number[];
  
      //   pbfHexagons.getHexagons().forEach(pbfHexagon => {
  
      //     // color = ColorUtil.getCorineColor(values[valueIndexCode]);
      //     values = pbfHexagon.getValues();
      //     yOffset = values[valueIndexX] % 2 === 0 ? 0 : SpatialUtil.HEXAGON_SPACING_X / 2;
  
      //     /**
      //      * intial values
      //      */
      //      hexagonValue = {
      //       i: -1,
      //       x: values[valueIndexX] * SpatialUtil.HEXAGON_SPACING_Y + SpatialUtil.HEXAGON_ORIGIN_X,
      //       y: 0,
      //       z: values[valueIndexY] * SpatialUtil.HEXAGON_SPACING_X - yOffset - SpatialUtil.HEXAGON_ORIGIN_Y,
      //       r: 0,
      //       g: 0,
      //       b: 0,
      //       col: values[valueIndexX],
      //       row: values[valueIndexY],
      //       gkz: values[valueIndexGkz] >= 0 ? values[valueIndexGkz].toString() : undefined,
      //       luc: values[valueIndexLuc],
      //       ele: SpatialUtil.toZ(values[valueIndexZ] / SpatialUtil.SCALE_PRECISION)
      //     };
      //     hexagonValues.current.push(hexagonValue);
      //     hexagonValue.y = hexagonValue.ele; // props.renderer.getHeight(hexagonValue);
        
      //   });

      //   hexagonValues.current.sort((a, b) => b.z - a.z);

      //   let counter = 0;
      //   hexagonValues.current.forEach(hexagonValue => {
  
      //     // FirstPersonControls
      //     hexagonValue.i = counter;

      //     // place at 0 (height will be handled though scaling)
      //     tempObject.position.set(hexagonValue.x, -SpatialUtil.HEXAGON_OFFSET_Y, hexagonValue.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
      //     tempObject.scale.set(1, (SpatialUtil.HEXAGON_OFFSET_Y + hexagonValue.y) /  SpatialUtil.HEXAGON_OFFSET_Y, 1);
      //     tempObject.updateMatrix();
      //     meshRef.current.setMatrixAt(counter, tempObject.matrix);
  
      //     // ColorUtil.getCorineColor(values[valueIndexLuc]).map((value, index) => colorArray[counter * 3 + index] = value);
  
      //     counter++;
    
      //   });

      //   /**
      //    * sorting is crucial for perfomance
      //    * if the front-most hexagons draw last it will be expensive
      //    * if the front-most hexagons draw first it will be fast
      //    */
      //   // hexagonValues.current.sort((a, b) => b.z - a.z)

      //   meshRef.current.instanceMatrix.needsUpdate = true

      // });

    }

  }, []);      



  useEffect(() => {

    // console.log('props.id changed', props);

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

    invalidate();

  }, [props.stamp]);    

  let handlePointerUp = (e:ThreeEvent<PointerEvent>) => { // 

    e.stopPropagation();
    if (e.instanceId) {

      // should issue a callback which would then toggle the chart and the map

      const borderHexagons = HexagonRepository.getInstance().getBorder(e.instanceId, props);
      borderHexagons.forEach(borderHexagon => {
          let rgb = props.getColor(borderHexagon).outline().getRgb();
          colorArray[borderHexagon.i * 3 + 0] = rgb[0];
          colorArray[borderHexagon.i * 3 + 1] = rgb[1];
          colorArray[borderHexagon.i * 3 + 2] = rgb[2];
          meshRef.current.geometry.attributes.color.needsUpdate = true;
      });
      invalidate();

    }

  }

  // const hovered = useRef();
  // const handleHover = (e:ThreeEvent<PointerEvent>) => {
  //   console.log(e.object);
  //   //@ts-ignore
  //   hovered.current = e.object;
  //   props.onHover(hovered);
    
  // }

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

