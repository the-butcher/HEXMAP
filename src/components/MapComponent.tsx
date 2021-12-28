import { ThreeDRotation } from "@mui/icons-material";
import { Canvas, RootState } from "@react-three/fiber";
import { PCFSoftShadowMap, ReinhardToneMapping } from "three";
import { ObjectUtil } from "../util/ObjectUtil";
import BoundariesComponent from "./BoundariesComponent";
import Chart3DComponent from "./Chart3DComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import HyperlinkComponent from "./HyperlinkComponent";
import { IHyperlinkProps } from "./IHyperlinkProps";
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

    const { lightProps, hexagonProps, controlsProps, labelProps, legendLabelProps, chart3DProps } = props; // , selected

    function onCreated(state: RootState): void {
        state.gl.setClearColor("#42423a");
    }

    const handlePointerUp = () => {
        // console.log('pointer up in document');
    }

    const twitterLinkProps: IHyperlinkProps = {
        id: ObjectUtil.createId(),
        label: '@FleischerHannes',
        size: 6,
        position: {
            x: 140,
            y: 0.2,
            z: 150
        },
        rotationY: 0,
        href: 'https://twitter.com/FleischerHannes'
    }

    return (
        <div style={{ position: 'absolute', height: '100%', width: '100%' }} onPointerUp={handlePointerUp}>
            <Canvas frameloop='demand' shadows={{ type: PCFSoftShadowMap, enabled: true }} onCreated={onCreated} camera={{ position: [0, 300, 0], fov: 40, far: 10000 }}>
                <ControlsComponent {...controlsProps} />
                {/* <Stats /> */}
                {lightProps.map(props => <LightCompoment key={props.id} {...props} />)}
                <ambientLight intensity={0.20} />
                {/* <gridHelper args={[1000, 10, '#ff0000', '#666666']}  /> */}
                <group name={'root'}>
                    <HexagonsComponent {...hexagonProps} />
                    <BoundariesComponent />
                    {labelProps.map(props => <LabelComponent key={props.id} {...props} />)}
                    <LabelComponent key={legendLabelProps.min.id} {...legendLabelProps.min} />
                    <LabelComponent key={legendLabelProps.max.id} {...legendLabelProps.max} />
                    {chart3DProps.map(props => <Chart3DComponent key={props.id} {...props} />)}
                    <HyperlinkComponent {...twitterLinkProps} />
                </group>
            </Canvas>
        </div>
    );

}