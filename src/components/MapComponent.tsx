import { Canvas, RootState, useFrame } from "@react-three/fiber";
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { useEffect, useRef, useState } from "react";
import * as three from 'three';
import { PCFSoftShadowMap } from "three";
import BoundariesComponent from "./BoundariesComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import { IMapProps } from "./IMapProps";
import LabelComponent from "./LabelComponent";
import LightCompoment from "./LightCompoment";


// function Box({ handleHover1, ...props }) {
//     const ref = useRef<three.Mesh>()
//     useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta))
//     return (
//       <mesh ref={ref} {...props} onPointerOver={(e) => handleHover1(ref)} onPointerOut={(e) => handleHover1(null)}>
//         <boxGeometry />
//         <meshStandardMaterial color="orange" />
//       </mesh>
//     )
//   }    

/**
 * functional react component describing the entire map / scene
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: IMapProps) => {

    const { lightProps, hexagonProps, controlsProps, labelProps } = props; // , selected

    // console.log('selectedM', selected);

    function onCreated(state: RootState): void {
        state.gl.setClearColor("#42423a");
    }

    const handlePointerUp = () => {
        // console.log('pointer up in document');
    }

    


    // const [hovered, setHovered] = useState()
    // const selected = hovered ? [hovered] : undefined

    // const handleHover0 = (ref1) => {
    //     console.log('ref1', ref1, ref1.current);
    //     setHovered(ref1);
    // }

    // useEffect(() => {
    //     console.log('hovered', hovered);
    //     selected = hovered ? hovered : undefined;
    // }, [hovered]);       


    return (
        <div style={{ position:'absolute', height: '100%', width: '100%' }} onPointerUp={ handlePointerUp }>
            <Canvas frameloop='demand' shadows={{ type: PCFSoftShadowMap, enabled: true }} onCreated={ onCreated } camera={{position: [0, 300, 0], fov: 40, far: 1000000}}> 
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
                {/* <Box handleHover1={ hexagonProps.onHover } position={[1, 0, 0]} /> */}
                {/* <EffectComposer multisampling={8} autoClear={false}>
                    <Outline blur selection={ props.selected } visibleEdgeColor={ 0xFFFFFF } hiddenEdgeColor={ 0x333333 } xRay={ true } edgeStrength={1} width={5000} />
                </EffectComposer>                 */}
            </Canvas>
        </div>
    );

}