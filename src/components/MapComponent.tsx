import { Canvas, RootState } from "@react-three/fiber";
import { useState } from "react";
import { ColorUtil } from "../util/ColorUtil";
import BoundariesComponent from "./BoundariesComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import { IHexagonRenderer, IHexagonRendererSchedule } from "./IHexagonRenderer";
import LightCompoment from "./LightCompoment";

export default () => {


    const noopSchedule: IHexagonRendererSchedule = {
        instantA: 0,
        instantB: 0
    }

    let [renderer, setRenderer] = useState<IHexagonRenderer>({
        id: (Math.random() * 1000).toString(16),
        getSchedule: () => noopSchedule,
        getColor: (values, target) => ColorUtil.getCorineColor(values.luc, target),
        getHeight: (values) => values.ele
    });
    
    function onCreated(state: RootState): void {
        state.gl.setClearColor("#dfdfdf");
    }

    const handlePointerUp = () => {
        // console.log('pointer up in document');
    }

    const handleChange = () => {

        const instantA = Date.now();
        const instantB = instantA + 1000;
        const schedule: IHexagonRendererSchedule = {
          instantA,
          instantB
        }
    
        renderer.getSchedule = () => schedule;
        renderer.getColor = (values, target) => {
          return ColorUtil.getCorineColor(values.luc, target);
          // if (values.gkz.toString().startsWith('502')) {
          //   return [0.5, 0, 0];
          // } else if (values.gkz.toString().startsWith('503')) {
          //   return [0, 0.5, 0];
          // } else {
          //   return [0, 0, 0];
          // }
        } 
        renderer.getHeight = (values) => {
          return values.ele;
          // if (values.gkz.toString().startsWith('502')) {
          //   return values.y + 2;
          // }else if (values.gkz.toString().startsWith('503')) {
          //   return values.y + 1;
          // } else {
          //   return values.y;
          // }
        }
    
      }

    return (
        <div style={{ position:'absolute', height: '100%', width: '100%' }} onPointerUp={ handlePointerUp }>
            <Canvas onCreated={ onCreated } camera={{position: [0, 300, 0], fov: 40, far: 1000000}}> 
                <ControlsComponent />
                {/* <Stats /> */}
                <LightCompoment position={{x: 100000, y: 500000, z: -1000000}} />
                <LightCompoment position={{x: 1000000, y: 500000, z: -1000000}} />
                <ambientLight intensity={ 0.25 } />
                {/* <gridHelper args={[1000, 10, '#ff0000', '#cccccc']}  /> */}
                {/* <axesHelper /> */}
                <group name={'root'}>
                <HexagonsComponent renderer={ renderer! } />
                <BoundariesComponent />
                </group>
            </Canvas>
        </div>
    );

}