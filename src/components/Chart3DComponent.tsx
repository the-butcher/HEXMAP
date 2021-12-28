import { color } from '@amcharts/amcharts5';
import { extend, ReactThreeFiber, useThree } from '@react-three/fiber';
import zhCN from 'date-fns/locale/zh-CN/index.js';
import React, { useEffect, useRef, useState } from 'react';
import * as three from 'three';
import { ShapeUtils, Vector2, Vector3 } from 'three';
import { DataRepository } from '../data/DataRepository';
import { ObjectUtil } from '../util/ObjectUtil';
import { TimeUtil } from '../util/TimeUtil';
import { IChart3DProps } from './IChart3DProps';
import { ILegendProps } from './ILegendProps';
import LabelComponent from './LabelComponent';

extend({ Line_: three.Line })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof three.Line>
    }
  }
}


/**
 * functional react component placing a 3d-text into the scene
 * 
 * @author h.fleischer
 * @since 28.12.2021
 */
export default (props: IChart3DProps) => {

  // console.log('entering chart 3D component', props);

  const { min, max, source, path, indx, instant, getColor, valueFormatter } = props;

  const { invalidate, gl, scene, camera } = useThree();

  const geomLineRef = useRef<three.ShapeGeometry>();
  const mtrlLineRef = useRef<three.LineBasicMaterial>(new three.LineBasicMaterial());
  const lineLineRef = useRef<three.Line>();

  const geomAreaRef = useRef<three.BufferGeometry>();
  const mtrlAreaRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshAreaRef = useRef<three.Mesh>();

  
  const [font, setFont] = useState<three.Font>();
  const [legendProps, setLegendProps] = useState<ILegendProps>({
    min: {
      id: ObjectUtil.createId(),
      label: '0',
      size: 6,
      position: {
        x: -247,
        y: 0.3,
        z: -50
      },
      rotationY: 0
    },
    max: {
      id: ObjectUtil.createId(),
      label: '0',
      size: 6,
      position: {
        x: -80,
        y: 0.3,
        z: -50
      },
      rotationY: 0
    }
  });

  useEffect(() => {

    console.log('✨ building chart 3D component');

    geomLineRef.current = new three.BufferGeometry().setFromPoints([
      new Vector2(min.x, min.y),
      new Vector2(min.x, max.y),
      new Vector2(max.x, max.y),
      new Vector2(max.x, min.y),
      new Vector2(min.x, min.y),
    ]);
    geomLineRef.current.computeBoundingBox();

    geomLineRef.current.rotateX(-Math.PI / 2);
    geomLineRef.current.rotateY(props.rotationY);
    geomLineRef.current.translate(0, 0.5, 0);
    lineLineRef.current!.geometry = geomLineRef.current;

  }, []);

  useEffect(() => {

    console.log('🔧 updating chart 3D component (misc)', props);
    if (instant < 0) {
      return;
    }

    DataRepository.getInstance().getOrBuild(source, instant - TimeUtil.MILLISECONDS_PER___WEEK, instant).then(chartData => {

      const multX = (max.x - min.x) / (chartData.maxX - chartData.minX);
      const multY = (max.y - min.y) / (chartData.maxY - chartData.minY);

      const toChartX = (valueX: number) => {
        return (valueX - chartData.minX) * multX + min.x;
      };
      const toChartY = (valueY: number) => {
        return max.y + (valueY - chartData.minY) * multY;
      };

      const valuePointer = `value_${indx}`;

      // console.log('chartData', chartData, multX, multY);

      let z: number;

      const vertices: number[] = [];
      const normals: number[] = [];
      const colors: number[] = [];

      const legendPropsMin = { ...legendProps.min };
      const legendPropsMax = { ...legendProps.max };

      z = 0.3;
      for (let i = 1; i < chartData.entries.length; i++) {

        const entryA = chartData.entries[i - 1];
        const entryB = chartData.entries[i];
        const chartXA = toChartX(entryA.date);
        const chartXB = toChartX(entryB.date);
        const chartYA = toChartY(entryA[valuePointer]);
        const chartYB = toChartY(entryB[valuePointer]);
        const rgbA = getColor(entryA[valuePointer]).getRgb().map(v => v * 0.33);
        const rgbB = getColor(entryB[valuePointer]).getRgb().map(v => v * 0.33);

        if (i === 1) {
          // console.log('legendPropsMin.label (1)', legendPropsMin.label);
          legendPropsMin.label = valueFormatter.format(entryA[valuePointer]).padStart(8, ' '); // right align by padding monospaced text
          legendPropsMin.position.z = chartYA + 4;
          // console.log('legendPropsMin.label (2)', legendPropsMin.label);
        }
        if (i === chartData.entries.length - 1) {
          legendPropsMax.label = valueFormatter.format(entryB[valuePointer]);
          legendPropsMax.position.z = chartYB + 4;
        }


        vertices.push(chartXA, z, chartYA);
        vertices.push(chartXB, z, -max.y);
        vertices.push(chartXB, z, chartYB);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        colors.push(rgbA[0], rgbA[1], rgbA[2]);
        colors.push(rgbB[0], rgbB[1], rgbB[2]);
        colors.push(rgbB[0], rgbB[1], rgbB[2]);

        vertices.push(chartXA, z, chartYA);
        vertices.push(chartXA, z, -max.y);
        vertices.push(chartXB, z, -max.y);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        colors.push(rgbA[0], rgbA[1], rgbA[2]);
        colors.push(rgbA[0], rgbA[1], rgbA[2]);
        colors.push(rgbB[0], rgbB[1], rgbB[2]);

      }

      const vertices32 = new Float32Array(vertices);
      const normals32 = new Float32Array(normals);
      const colors32 = new Float32Array(colors);

      geomAreaRef.current.setAttribute('position', new three.BufferAttribute(vertices32, 3));
      geomAreaRef.current.setAttribute('normal', new three.BufferAttribute(normals32, 3));
      geomAreaRef.current.setAttribute('color', new three.BufferAttribute(colors32, 3));

      setLegendProps({
        min: legendPropsMin,
        max: legendPropsMax
      });

      requestAnimationFrame(() => {
        invalidate();
      })
      

    }).catch(e => {
      console.warn('failed to get data due to', e);
    });

  }, [source, path, indx, instant]);

  // /**
  //  * legend is updated during use effect
  //  * any map update is already finished when the legend is calculated, therefore another frame is requested here
  //  */
  // useEffect(() => {

  //   console.log('updating chart 3D component (legend)', legendProps);
  //   invalidate();

  // }, [legendProps]);

  return (
    <group>
      <line_ ref={lineLineRef}>
        <bufferGeometry ref={geomLineRef} />
        <lineBasicMaterial ref={mtrlLineRef} color={[0.076 * 0.4, 0.076 * 0.4, 0.050 * 0.4]} />
      </line_>
      <mesh ref={meshAreaRef}>
        <bufferGeometry ref={geomAreaRef} />
        <meshStandardMaterial vertexColors={true} ref={mtrlAreaRef} wireframe={false} />
      </mesh>
      <LabelComponent key={legendProps.min.id} {...legendProps.min} />
      <LabelComponent key={legendProps.max.id} {...legendProps.max} />
    </group>
  );

};

/**
 *  vertexColors={ true }
 */


