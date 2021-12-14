import { Canvas, RootState } from "@react-three/fiber";
import { BasicShadowMap } from "three";
import BoundariesComponent from "./BoundariesComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import { IMapProps } from "./IMapProps";
import LabelComponent from "./LabelComponent";
import LightCompoment from "./LightCompoment";

/**
 * functional react component describing the entire map / scene
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: IMapProps) => {

    const { lightProps, hexagonProps, controlsProps, labelProps } = props;

    function onCreated(state: RootState): void {
        state.gl.setClearColor("#dfdfdf");
    }

    const handlePointerUp = () => {
        // console.log('pointer up in document');
    }

    return (
        <div style={{ position:'absolute', height: '100%', width: '100%' }} onPointerUp={ handlePointerUp }>
            <Canvas frameloop='demand' shadows={{ type: BasicShadowMap, enabled: true }} onCreated={ onCreated } camera={{position: [0, 300, 0], fov: 40, far: 1000000}}> 
                <ControlsComponent {...controlsProps} />
                {/* <Stats /> */}
                { lightProps.map(props => <LightCompoment key={ props.id } {...props} />)}
                <ambientLight intensity={ 0.20 } />
                {/* <gridHelper args={[1000, 10, '#ff0000', '#666666']}  /> */}
                <group name={'root'}>
                <HexagonsComponent {...hexagonProps} />
                <BoundariesComponent />
                { labelProps.map(props => <LabelComponent key={ props.id } {...props} />)}
                </group>
            </Canvas>
        </div>
    );

}