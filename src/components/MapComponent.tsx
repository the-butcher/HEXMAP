import { Stats } from "@react-three/drei";
import { Canvas, RootState } from "@react-three/fiber";
import { BasicShadowMap } from "three";
import BoundariesComponent from "./BoundariesComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import { IMapProps } from "./IMapProps";
import LightCompoment from "./LightCompoment";

export default (props: IMapProps) => {

    const { hexagonProps } = props;

    function onCreated(state: RootState): void {
        state.gl.setClearColor("#dfdfdf");
    }

    const handlePointerUp = () => {
        // console.log('pointer up in document');
    }

    return (
        <div style={{ position:'absolute', height: '100%', width: '100%' }} onPointerUp={ handlePointerUp }>
            <Canvas frameloop="demand" shadows={{ type: BasicShadowMap, enabled: true }} onCreated={ onCreated } camera={{position: [0, 300, 0], fov: 40, far: 1000000}}> 
                <ControlsComponent />
                <Stats />
                <LightCompoment position={{x: 100, y: 100, z: -100}} />
                <LightCompoment position={{x: -100, y: 100, z: -100}} />
                <ambientLight intensity={ 0.20 } />
                {/* <gridHelper args={[1000, 10, '#ff0000', '#cccccc']}  /> */}
                {/* <axesHelper /> */}
                <group name={'root'}>
                <HexagonsComponent {...hexagonProps} />
                <BoundariesComponent />
                </group>
            </Canvas>
        </div>
    );

}