import { ThreeEvent, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as three from 'three';
import { ShapeUtils, Vector2 } from 'three';
import { PbfBoundaryLoader } from '../protobuf/PbfBoundaryLoader';
import { SpatialUtil } from '../util/SpatialUtil';
/**
 * functional react component responsible for drawing the boundary around austria
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
function BoundaryComponent() {

  const { invalidate } = useThree();

  /**
   * vertical part of the boundary - standard material, so the hexagon boundary has structure
   */
  // const meshWall = useRef<three.Mesh>();
  // const geomWall = useRef<three.BufferGeometry>();

  /**
   * flat part of the boundary - basic material so it blends into page background
   * likely saves performance as well
   */
  const geomRef = useRef<three.BufferGeometry>(new three.BufferGeometry());
  const mtrlRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshRef = useRef<three.Mesh>(new three.Mesh(geomRef.current, mtrlRef.current));

  const [vertexCount, setVertexCount] = useState<number>(0);

  const posCount = 184572;
  const posCurr = useMemo(() => new Float32Array(posCount), []);
  const nrmCurr = useMemo(() => new Float32Array(posCount), []);

  const directionDim = SpatialUtil.HEXAGON_SPACING_X * 0.5 / Math.cos(Math.PI / 6);
  const directionMultsX: number[] = [];
  const directionMultsY: number[] = [];
  for (let i = -2; i < 4; i++) {
    directionMultsX.push(Math.cos(Math.PI * i / 3) * directionDim);
    directionMultsY.push(- Math.sin(Math.PI * i / 3) * directionDim);
  }

  const boundaryMaxZ = SpatialUtil.toZ(0); // 3500
  const boundaryMinZ = SpatialUtil.toZ(-7000);

  useEffect(() => {

    console.log('✨ building boundaries component');

    new PbfBoundaryLoader().load('./hexagons_outer.pbf').then(pbfBoundaries => {

      const hoodVertices: number[] = [];
      const hoodNormals: number[] = [];

      // const wallVertices: number[] = [];
      // const wallNormals: number[] = [];

      pbfBoundaries.getBoundaries().forEach(pbfBoundary => {

        const coords2d: Vector2[] = [];
        const normal2d: Vector2[] = [];

        const directionSums: number[] = [0, 0, 0, 0, 0, 0];
        let lastX: number;
        let lastY: number;

        pbfBoundary.getCoordinates().forEach(coordinate => {
          lastX = coordinate.getX() * SpatialUtil.SCALE_SCENE / SpatialUtil.SCALE_PRECISION + SpatialUtil.BOUNDARY_ORIGIN_X;
          lastY = SpatialUtil.BOUNDARY_ORIGIN_Y - coordinate.getY() * SpatialUtil.SCALE_SCENE / SpatialUtil.SCALE_PRECISION;
          coords2d.push(new Vector2(lastX, lastY));
          normal2d.push(new Vector2(0, 0));
        });
        const firstWallIndex = coords2d.length;

        let directionSumX: number;
        let directionSumY: number;
        pbfBoundary.getDirections().forEach(direction => {
          directionSums[direction] = directionSums[direction] + 1; // increment direction for the given angle
          directionSumX = lastX;
          directionSumY = lastY;
          for (let i = 0; i < directionSums.length; i++) {
            directionSumX += directionSums[i] * directionMultsX[i];
            directionSumY += directionSums[i] * directionMultsY[i];
          }
          coords2d.push(new Vector2(directionSumX, directionSumY));
          normal2d.push(new Vector2(directionMultsY[direction], -directionMultsX[direction]))
        });

        const triangulationResult = ShapeUtils.triangulateShape(coords2d, []);
        triangulationResult.forEach(vertices => {
          hoodVertices.push(coords2d[vertices[2]].x, boundaryMaxZ, coords2d[vertices[2]].y);
          hoodVertices.push(coords2d[vertices[1]].x, boundaryMaxZ, coords2d[vertices[1]].y);
          hoodVertices.push(coords2d[vertices[0]].x, boundaryMaxZ, coords2d[vertices[0]].y);
          hoodNormals.push(0, 1, 0);
          hoodNormals.push(0, 1, 0);
          hoodNormals.push(0, 1, 0);
        });

        for (let i = 1; i < firstWallIndex; i++) {

          // hoodVertices.push(coords2d[i - 1].x, boundaryMaxZ, coords2d[i - 1].y);
          // hoodVertices.push(coords2d[i].x, boundaryMaxZ, coords2d[i].y);
          // hoodVertices.push(coords2d[i].x, boundaryMinZ, coords2d[i].y);
          // hoodNormals.push(0, 1, 0);
          // hoodNormals.push(0, 1, 0);
          // hoodNormals.push(0, 1, 0);

          // hoodVertices.push(coords2d[i].x, boundaryMinZ, coords2d[i].y);
          // hoodVertices.push(coords2d[i - 1].x, boundaryMinZ, coords2d[i - 1].y);
          // hoodVertices.push(coords2d[i - 1].x, boundaryMaxZ, coords2d[i - 1].y);
          // hoodNormals.push(0, 1, 0);
          // hoodNormals.push(0, 1, 0);
          // hoodNormals.push(0, 1, 0);

        }
        for (let i = firstWallIndex + 2; i <= coords2d.length; i++) {

          const idxM1 = (i - 1) % coords2d.length;
          const idxM0 = (i) % coords2d.length;

          hoodVertices.push(coords2d[idxM1].x, boundaryMaxZ, coords2d[idxM1].y);
          hoodVertices.push(coords2d[idxM0].x, boundaryMaxZ, coords2d[idxM0].y);
          hoodVertices.push(coords2d[idxM0].x, boundaryMinZ, coords2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);

          hoodVertices.push(coords2d[idxM0].x, boundaryMinZ, coords2d[idxM0].y);
          hoodVertices.push(coords2d[idxM1].x, boundaryMinZ, coords2d[idxM1].y);
          hoodVertices.push(coords2d[idxM1].x, boundaryMaxZ, coords2d[idxM1].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);

        }

      });

      for (let i = 0; i < posCount; i++) {
        posCurr[i] = hoodVertices[i];
        nrmCurr[i] = hoodNormals[i];
      }
      setVertexCount(posCount);
      // meshRef.current.geometry.attributes.position.needsUpdate = true;
      // meshRef.current.geometry.attributes.normal.needsUpdate = true;
      // invalidate();

    }).catch(e => {
      console.error(e)
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {


    console.log('🔄 updating boundaries component (vertexCount)', vertexCount);

    if (vertexCount > 0) {

      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.geometry.attributes.normal.needsUpdate = true;
      invalidate();

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertexCount]);

  // /**
  //  * stop propagation of events to prevent object selection when the ray intersects the boundary geometry
  //  * @param e
  //  */
  // const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
  //   // e.stopPropagation();
  // }

  // 0.02, 0.02, 0.015
  // onPointerUp={handlePointerUp}

  const handleClick = (e: ThreeEvent<PointerEvent>) => { //

    console.log('boundary', e);
    // e.stopPropagation();
    // if (e.instanceId && e.delta < 5) {
    //   const hexagonValue = HexagonRepository.getInstance().getHexagon(e.instanceId);
    //   hexagonsProps.onHexagonClicked(hexagonValue);
    // }

  }


  return (
    <mesh ref={meshRef} frustumCulled={false} castShadow receiveShadow onClick={handleClick}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach={'attributes-position'} count={vertexCount}
          array={posCurr} args={[posCurr, 3]}
          itemSize={3} />
        <bufferAttribute attach={'attributes-normal'} count={vertexCount}
          array={nrmCurr} args={[nrmCurr, 3]}
          itemSize={3} />
      </bufferGeometry>
      <meshStandardMaterial
        ref={mtrlRef}
        color={[0.02, 0.02, 0.015]}
        wireframe={false}
      // metalness={0.25}
      // roughness={0.75}
      />
    </mesh>
  );

};

export default BoundaryComponent;