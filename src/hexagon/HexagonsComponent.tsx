import { useRef, useEffect, useMemo } from "react";
import { PointerEvent, useFrame } from "react-three-fiber";
import * as three from "three";
import { PbfHexagon } from "../protobuf/hexagons/PbfHexagon";
import { PbfHexagonsLoader } from "../protobuf/PbfHexagonsLoader";

const HexagonsComponent = () => {

  const hexagons = useRef<three.InstancedMesh>();
  const dg = new three.BufferGeometry();
  const dm = new three.Material();
  const tempObject = new three.Object3D();
  const tempColor = new three.Color();

  const scale = 100000;

  const hexagonOriginX = -320535.3734;
  const hexagonOriginY = 512166.0648;

  const hexagonSpacingY = 759.8356857 / scale;
  const hexagonSpacingX = Math.cos(Math.PI / 6) * hexagonSpacingY;

  const data = Array.from({ length: 168858 }, () => ({ color: '#FF0000', scale: 1 }))
  const colorArray = useMemo(() => new Float32Array(168858 * 3), []);

  let pbfHexagonArray: PbfHexagon[];

  let colors: { [K in string]: number[] } = {};
  colors[111] = [230,0,77];
  colors[112] = [255,0,0];
  colors[121] = [204,77,242];
  colors[122] = [204,0,0];
  colors[123] = [230,204,204];
  colors[124] = [230,204,230];
  colors[131] = [166,0,204];
  colors[132] = [166,77,0];
  colors[133] = [255,77,255];
  colors[141] = [255,166,255];
  colors[142] = [255,230,255];
  colors[211] = [255,255,168];
  colors[212] = [255,255,0];
  colors[213] = [230,230,0];
  colors[221] = [230,128,0];
  colors[222] = [242,166,77];
  colors[223] = [230,166,0];
  colors[231] = [230,230,77];
  colors[241] = [255,230,166];
  colors[242] = [255,230,77];
  colors[243] = [230,204,77];
  colors[244] = [242,204,166];
  colors[311] = [128,255,0];
  colors[312] = [0,166,0];
  colors[313] = [77,255,0];
  colors[321] = [204,242,77];
  colors[322] = [166,255,128];
  colors[323] = [166,230,77];
  colors[324] = [166,242,0];
  colors[331] = [230,230,230];
  colors[332] = [204,204,204];
  colors[333] = [204,255,204];
  colors[334] = [0,0,0];
  colors[335] = [166,230,204];
  colors[411] = [166,166,255];
  colors[412] = [77,77,255];
  colors[421] = [204,204,255];
  colors[422] = [230,230,255];
  colors[423] = [166,166,230];
  colors[511] = [0,204,242];
  colors[512] = [128,242,230];
  colors[521] = [0,255,166];
  colors[522] = [166,255,230];
  colors[523] = [230,242,255];

  useEffect(() => {

    console.log('hexagonSpacingX', hexagonSpacingX);
    console.log('hexagonSpacingY', hexagonSpacingY);

    let counter = 0;
    new PbfHexagonsLoader().load('./hexagons.pbf').then(pbfHexagons => {

      let coordinates: number[];
      let codes: number[];
      let yOffset: number;

      pbfHexagonArray = pbfHexagons.getHexagons();
      pbfHexagonArray.forEach(pbfHexagon => {

        coordinates = pbfHexagon.getCoordinates();
        codes = pbfHexagon.getCodes();
        yOffset = coordinates[0] % 2 === 0 ? 0 : hexagonSpacingY / 2;

        tempObject.position.set(coordinates[0] * hexagonSpacingX - 3, coordinates[2] / (2 * scale), coordinates[1] * hexagonSpacingY - yOffset - 2.5); // coordinates[2] / 4
        tempObject.rotation.set(0, Math.PI / 6, 0);
        tempObject.updateMatrix();
        hexagons.current?.setMatrixAt(counter, tempObject.matrix);

        if (colors[codes[1]]) {
          colorArray[counter * 3] = colors[codes[1]][0] / 2048;
          colorArray[counter * 3 + 1] = colors[codes[1]][1] / 2048;
          colorArray[counter * 3 + 2] = colors[codes[1]][2] / 2048;
        }

        counter++;
  
      });

      if (hexagons.current) {
        hexagons.current.instanceMatrix.needsUpdate = true
        hexagons.current.geometry.attributes.color.needsUpdate = true;
      }

    });

  }, []);      

  useFrame(() => {
    // do something with hexagons


  });

  function onPointerUp(e: PointerEvent): void {
    
    let counter = 0;
    let codes: number[];
    let coordinates: number[];
    let yOffset: number;

    pbfHexagonArray.forEach(pbfHexagon => {

      codes = pbfHexagon.getCodes();
      coordinates = pbfHexagon.getCoordinates();
      yOffset = coordinates[0] % 2 === 0 ? 0 : hexagonSpacingY / 2;

      if (codes[0].toString().startsWith('5')) {

        tempObject.position.set(coordinates[0] * hexagonSpacingX - 3, 1000 / (2 * scale), coordinates[1] * hexagonSpacingY - yOffset - 2.5); // coordinates[2] / 4
        tempObject.updateMatrix();
        hexagons.current?.setMatrixAt(counter, tempObject.matrix);

        tempColor.set('#00FF00').toArray(colorArray, counter * 3)


      }
      
      counter++;

    });

    if (hexagons.current) {
      hexagons.current.instanceMatrix.needsUpdate = true
      hexagons.current.geometry.attributes.color.needsUpdate = true;
    }
    
  }  

  return (
    <instancedMesh ref={ hexagons } args={[dg, dm, 168858]} castShadow receiveShadow> 
      <cylinderBufferGeometry args={[0.0042, 0.0042, 0.1, 6, 1, false, 0, Math.PI * 2]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']}  args={[colorArray, 3]}></instancedBufferAttribute>
      </cylinderBufferGeometry>
      <meshPhongMaterial vertexColors={ true } />
    </instancedMesh>
  );

  // <instancedMesh ref={ hexagons } >

  // </instancedMesh>

  
};

export default () => {
  return (
    <HexagonsComponent />
  );
};