import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { easeInOut } from "motion";
import { useEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import { HexagonRepository } from '../data/HexagonRepository';
import { SpatialUtil } from '../util/SpatialUtil';
import { ILightProps } from './ILightProps';
import { IMapProps } from './IMapProps';

/**
 * functional react component responsible for drawing the hexagons
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
function HexagonsComponent(props: IMapProps) {

  const { invalidate, gl, scene } = useThree();

  const { hexagonsStamp, lightProps, hexagonsProps } = props;
  const lightsRef = useRef<{ [K: string]: three.DirectionalLight }>({});
  // const lightCallbackRef = (id: string, light: three.DirectionalLight) => {
  //   lightsRef.current[id] = light;
  // };

  const hexagonCount = 167934;

  const geomRef = useRef<three.BufferGeometry>(new three.BufferGeometry());
  const mtrlRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshRef = useRef<three.InstancedMesh>(new three.InstancedMesh(geomRef.current, mtrlRef.current, hexagonCount));

  /**
   * helper objects for setting up position and color before applying to indexed instances
   */
  const tempObject = new three.Object3D();

  /**
   * helpers for updating color
   */
  const colorComp = 4;

  /**
   * the colors currently displayed, at beginning of animation and the delta to be covered during animation
   */
  const colorCurr = useMemo(() => new Float32Array(hexagonCount * colorComp), []);
  const colorOrig = useMemo(() => new Float32Array(hexagonCount * colorComp), []);
  const colorDiff = useMemo(() => new Float32Array(hexagonCount * colorComp), []);

  /**
   * the heights currently displayed, at beginning of animation and the delta to be covered during animation
   */
  const heightCurr = useMemo(() => new Float32Array(hexagonCount), []);
  const heightOrig = useMemo(() => new Float32Array(hexagonCount), []);
  const heightDiff = useMemo(() => new Float32Array(hexagonCount), []);

  /**
   * the beginning millis of animation
   */
  const tsAnimOrig = useRef<number>(-1);
  /**
   * the ending millis of animation
   */
  const tsAnimDest = useRef<number>(-1);

  const configureLight = (props: ILightProps) => {

    const light = new three.DirectionalLight(); // lightsRef.current[props.id];

    light.position.set(props.position.x, props.position.y, props.position.z);
    light.lookAt(0, 0, 0);
    light.intensity = props.intensity;
    light.castShadow = true;
    light.shadow.autoUpdate = false;

    light.shadow.camera.top = 140;
    light.shadow.camera.bottom = -120;
    light.shadow.camera.left = -260;
    light.shadow.camera.right = 260;
    light.shadow.camera.far = 1000;
    light.shadow.camera.lookAt(0, 0, 0);
    // light.shadow.bias = -0.00000000000000000000000000000000005;
    light.shadow.bias = -0.00005;

    const maxTextureSize = gl.capabilities.maxTextureSize;

    light.shadow.mapSize.width = maxTextureSize / 16;
    light.shadow.mapSize.height = maxTextureSize / 16;

    scene.add(light);
    // scene.add(new three.DirectionalLightHelper(light));
    // scene.add(new three.CameraHelper(light.shadow.camera));

    lightsRef.current[props.id] = light;

  }

  useEffect(() => {

    console.log('✨ building hexagons component', props);

    if (meshRef.current && geomRef.current) {

      const vertices: number[] = [];
      const normals: number[] = [];

      const wallCurveRadHori = 0 * Math.PI / 180;
      const wallCurveRadVert = Math.sin(0 * Math.PI / 180);

      const capCurveRadians = 1 * Math.PI / 180;
      const capCurveTan = Math.tan(capCurveRadians);
      const capCurveCos = Math.cos(capCurveRadians);
      const capCurveSin = -Math.sin(capCurveRadians);

      let radCurr = 0;
      let cosLast = 1;
      let sinLast = 0;
      let cosCurr: number;
      let sinCurr: number;

      const createCap = (radius: number, degrees: number, offsetY: number) => {

        radCurr = degrees * Math.PI / 180;
        cosCurr = Math.cos(radCurr);
        sinCurr = Math.sin(radCurr);

        // upper triangle
        vertices.push(cosCurr * radius, offsetY, sinCurr * radius);
        vertices.push(cosLast * radius, offsetY, sinLast * radius);
        vertices.push(0, offsetY - capCurveTan * radius, 0); // center   - 0.025

        // 3 normals pointing upwards (or slightly inwards from vertical)
        // capCurveSin is the "shortening" from a top-down perspective
        // capCurveCos is the "shortening" from a side perspective
        const nrmCurr: three.Vector3 = new three.Vector3(cosCurr * capCurveSin, capCurveCos, sinCurr * capCurveSin).normalize();
        const nrmLast: three.Vector3 = new three.Vector3(cosLast * capCurveSin, capCurveCos, sinLast * capCurveSin).normalize();

        normals.push(nrmCurr.x, nrmCurr.y, nrmCurr.z);
        normals.push(nrmLast.x, nrmCurr.y, nrmLast.z);
        // normals.push(cosCurr * capCurveSin, capCurveCos, sinCurr * capCurveSin);
        // normals.push(cosLast * capCurveSin, capCurveCos, sinLast * capCurveSin);
        normals.push(0, 1, 0); // vertical at the center

        cosLast = cosCurr;
        sinLast = sinCurr;

      }

      const createWall = (radius: number, degrees: number, maxY: number, minY: number) => {

        radCurr = degrees * Math.PI / 180;
        cosCurr = Math.cos(radCurr);
        sinCurr = Math.sin(radCurr);

        // create the illusion of a slight outwards bend on the vertical faces of the hexagon
        const nrmCurr: three.Vector3 = new three.Vector3(Math.sin(radCurr + wallCurveRadHori), wallCurveRadVert, Math.cos(radCurr + wallCurveRadHori)).normalize();
        const nrmLast: three.Vector3 = new three.Vector3(Math.sin(radCurr - wallCurveRadHori), wallCurveRadVert, Math.cos(radCurr - wallCurveRadHori)).normalize();
        //vertical triangle A
        vertices.push(cosCurr * radius, maxY, sinCurr * radius);
        vertices.push(cosCurr * radius, minY, sinCurr * radius);
        vertices.push(cosLast * radius, maxY, sinLast * radius);

        normals.push(nrmCurr.x, nrmCurr.y, nrmCurr.z);
        normals.push(nrmCurr.x, -nrmCurr.y, nrmCurr.z);
        normals.push(nrmLast.x, nrmCurr.y, nrmLast.z);
        // normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        // normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        // normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);

        //vertical triangle B
        vertices.push(cosLast * radius, maxY, sinLast * radius);
        vertices.push(cosCurr * radius, minY, sinCurr * radius);
        vertices.push(cosLast * radius, minY, sinLast * radius);

        normals.push(nrmLast.x, nrmCurr.y, nrmLast.z);
        normals.push(nrmCurr.x, -nrmCurr.y, nrmCurr.z);
        normals.push(nrmLast.x, -nrmCurr.y, nrmLast.z);
        // normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);
        // normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        // normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);

        cosLast = cosCurr;
        sinLast = sinCurr;

      }

      const radius = 420 * SpatialUtil.SCALE_SCENE; // 440 :: no gap, 425 :: slight gap
      // console.log('radius', radius)

      for (let degrees = 60; degrees <= 360; degrees += 60) {
        createCap(radius * 0.95, degrees, -0.05);
      }
      for (let degrees = 60; degrees <= 360; degrees += 60) {
        createCap(radius, degrees, 0);
      }
      for (let degrees = 60; degrees <= 360; degrees += 60) {
        createWall(radius, degrees, 0, -6);
      }

      const vertices32 = new Float32Array(vertices);
      const normals32 = new Float32Array(normals);

      geomRef.current.setAttribute('position', new three.BufferAttribute(vertices32, 3));
      geomRef.current.setAttribute('normal', new three.BufferAttribute(normals32, 3));

      HexagonRepository.getInstance().load().then(() => {

        // appears that this needs to be actively done, so later the full bounding sphere can be calculated
        geomRef.current.computeBoundingSphere();

        applyHexagonsProps();

        // trigger first animation render
        invalidate();

      });

    }

    console.log('lightsRef', lightsRef);
    lightProps.forEach(p => {
      configureLight(p);
    });
    // invalidate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyHexagonsProps = () => {

    const hexagons = HexagonRepository.getInstance().getHexagons();
    if (hexagons.length > 0) {

      console.log('🔄 updating hexagons component (hexagonsStamp)', hexagonsStamp);

      const tsA = Date.now();

      let colrkey = 0;
      let rgba: number[];
      hexagons.forEach(hexagon => {

        rgba = hexagonsProps.getRgba(hexagon);
        colrkey = hexagon.sortkeyN * colorComp;

        heightOrig[hexagon.sortkeyN] = heightCurr[hexagon.sortkeyN];
        heightDiff[hexagon.sortkeyN] = hexagonsProps.getZVal(hexagon) - heightCurr[hexagon.sortkeyN];

        // store current color as begin values of animation
        colorOrig[colrkey + 0] = colorCurr[colrkey + 0];
        colorOrig[colrkey + 1] = colorCurr[colrkey + 1];
        colorOrig[colrkey + 2] = colorCurr[colrkey + 2];
        colorOrig[colrkey + 3] = colorCurr[colrkey + 3];

        // store the delta to be covered during animation
        colorDiff[colrkey + 0] = rgba[0] - colorCurr[colrkey + 0];
        colorDiff[colrkey + 1] = rgba[1] - colorCurr[colrkey + 1];
        colorDiff[colrkey + 2] = rgba[2] - colorCurr[colrkey + 2];
        colorDiff[colrkey + 3] = rgba[3] - colorCurr[colrkey + 3];

      });

      // const borders = HexagonRepository.getInstance().getBorders({
      //   getPath: ((h: IHexagon) => h.gkz.substring(0, 5))
      // });
      // borders.forEach(hexagon => {

      //   colrkey = hexagon.sortkeyN * colorComp;
      //   colorCurr[colrkey + 0] = colorCurr[colrkey + 0] * 0.5;
      //   colorCurr[colrkey + 1] = colorCurr[colrkey + 1] * 0.5;
      //   colorCurr[colrkey + 2] = colorCurr[colrkey + 2] * 0.5;
      // });

      // console.log('meshRef.current.instanceMatrix', meshRef.current.instanceMatrix);

      // meshRef.current.instanceMatrix.needsUpdate = true;
      // meshRef.current.geometry.attributes.color.needsUpdate = true;

      console.debug('🕓 updating hexagons component (stamp, done)', Date.now() - tsA);

      tsAnimOrig.current = Date.now();
      tsAnimDest.current = tsAnimOrig.current + 2500;

      // trigger first animation render
      // invalidate();

    }

  }

  useEffect(() => {

    if (meshRef.current && geomRef.current) {
      applyHexagonsProps();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hexagonsStamp]);

  // useEffect(() => {

  //   console.log('🔄 updating hexagons component (lightsStamp)', lightsStamp);

  //   lightProps.forEach(p => {
  //     lightsRef.current[p.id].shadow.needsUpdate = true;
  //   });
  //   gl.shadowMap.needsUpdate = true;

  //   invalidate();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lightsStamp]);

  const updateColorsAndHeight = (fraction: number) => {

    let colrkey = 0;

    const hexagons = HexagonRepository.getInstance().getHexagons();
    hexagons.forEach(hexagon => {

      heightCurr[hexagon.sortkeyN] = heightOrig[hexagon.sortkeyN] + heightDiff[hexagon.sortkeyN] * fraction;

      tempObject.position.set(hexagon.x, heightCurr[hexagon.sortkeyN], hexagon.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(hexagon.sortkeyN, tempObject.matrix);

      colrkey = hexagon.sortkeyN * colorComp;
      colorCurr[colrkey + 0] = colorOrig[colrkey + 0] + colorDiff[colrkey + 0] * fraction;
      colorCurr[colrkey + 1] = colorOrig[colrkey + 1] + colorDiff[colrkey + 1] * fraction;
      colorCurr[colrkey + 2] = colorOrig[colrkey + 2] + colorDiff[colrkey + 2] * fraction;
      colorCurr[colrkey + 3] = colorOrig[colrkey + 3] + colorDiff[colrkey + 3] * fraction;

    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;

  }

  useFrame(() => {

    // console.log('📷 rendering hexagons component');

    const tsAnimN = Date.now();
    if (tsAnimN < tsAnimDest.current) {

      const fraction = (tsAnimN - tsAnimOrig.current) / (tsAnimDest.current - tsAnimOrig.current);
      console.log('fraction', easeInOut(fraction));
      updateColorsAndHeight(easeInOut(fraction));

      lightProps.forEach(p => {
        lightsRef.current[p.id].shadow.needsUpdate = true;
      });
      gl.shadowMap.needsUpdate = true;

      invalidate();

    } else if (tsAnimDest.current > 0) { // final animation step pending

      console.log('fraction', 1);
      updateColorsAndHeight(1);

      lightProps.forEach(p => {
        lightsRef.current[p.id].shadow.needsUpdate = true;
      });
      gl.shadowMap.needsUpdate = true;

      tsAnimOrig.current = -1;
      tsAnimDest.current = -1;

      // appears to be necessary, or click events wont work
      meshRef.current.computeBoundingSphere();

      invalidate();

    }

  }, 11);

  const handleClick = (e: ThreeEvent<PointerEvent>) => { //

    e.stopPropagation();
    if (e.instanceId && e.delta < 5) {
      const hexagonValue = HexagonRepository.getInstance().getHexagon(e.instanceId);
      hexagonsProps.onHexagonClicked(hexagonValue);
    }

  }

  return (
    <instancedMesh
      scale={[1, 10, 1]}
      frustumCulled={false}
      ref={meshRef}
      args={[geomRef.current, mtrlRef.current, hexagonCount]}
      castShadow
      receiveShadow
      onClick={handleClick}
    >
      <bufferGeometry ref={geomRef}>
        <instancedBufferAttribute attach={'attributes-color'} count={colorCurr.length}
          array={colorCurr} args={[colorCurr, 4]}
          itemSize={4} />
      </bufferGeometry>
      <meshStandardMaterial
        side={three.FrontSide}
        ref={mtrlRef}
        vertexColors={true}
        metalness={0.25}
        roughness={0.75}
        wireframe={false}
        transparent={hexagonsProps.hasTransparency}
      />
    </instancedMesh>
  );

};

export default HexagonsComponent;
