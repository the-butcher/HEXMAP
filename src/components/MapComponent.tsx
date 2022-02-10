import { Canvas, RootState } from "@react-three/fiber";
import { PCFSoftShadowMap } from "three";
import BoundariesComponent from "./BoundariesComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import HyperlinkComponent from "./HyperlinkComponent";
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

    const { lightProps, hexagonProps, controlsProps, labelProps, legendLabelProps, courseLabelProps, hyperlinkProps } = props;

    // const planegeomref = useRef<PlaneGeometry>(new PlaneGeometry(400, 500));

    function onCreated(state: RootState): void {
        state.gl.setClearColor("#42423a");
    }

    return (
        <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
            <Canvas frameloop='demand' shadows={{ type: PCFSoftShadowMap, enabled: true }} onCreated={onCreated} camera={{ position: [0, 300, 0], fov: 40, far: 10000 }}>
                <ControlsComponent key={controlsProps.id} {...controlsProps} />
                {/* demand | always */}
                {/* <Stats /> */}
                {lightProps.map(props => <LightCompoment key={props.id} {...props} />)}
                <ambientLight intensity={0.07} />
                {/* <gridHelper args={[1000, 10, '#ff0000', '#666666']} /> */}
                <group name={'root'}>
                    <BoundariesComponent />
                    <HexagonsComponent {...hexagonProps} />

                    {labelProps.map(props => <LabelComponent key={props.id} {...props} />)}
                    <LabelComponent key={legendLabelProps.title.id} {...legendLabelProps.title} />
                    <LabelComponent key={legendLabelProps.min.id} {...legendLabelProps.min} />
                    <LabelComponent key={legendLabelProps.max.id} {...legendLabelProps.max} />
                    <LabelComponent key={courseLabelProps.title.id} {...courseLabelProps.title} />
                    <LabelComponent key={courseLabelProps.min.id} {...courseLabelProps.min} />
                    <LabelComponent key={courseLabelProps.max.id} {...courseLabelProps.max} />
                    {hyperlinkProps.map(props => <HyperlinkComponent key={props.id} {...props} />)}
                    {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
                        <meshStandardMaterial color={[0.02, 0.02, 0.015]} wireframe={false} transparent opacity={0.75} />
                    </mesh> */}
                    {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 11.25, 0]}>
                        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
                        <meshStandardMaterial color={[0.02, 0.02, 0.015]} wireframe={false} transparent opacity={0.25} />
                    </mesh> */}
                </group>
            </Canvas>
        </div>
    );

}