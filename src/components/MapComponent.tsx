import { Stats } from "@react-three/drei";
import { Canvas, RootState } from "@react-three/fiber";
import { PCFSoftShadowMap } from "three";
import { ObjectUtil } from "../util/ObjectUtil";
import BoundariesComponent from "./BoundariesComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import HyperlinkComponent from "./HyperlinkComponent";
import { IHyperlinkProps } from "./IHyperlinkProps";
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

    function onCreated(state: RootState): void {
        state.gl.setClearColor("#42423a");
        // @ts-ignore
        // console.log('state.gl.capabilities.maxTextureSize', state.gl.capabilities.maxTextureSize);
    }

    const handlePointerUp = () => {
        // console.log('pointer up in document');
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
                    <LabelComponent key={legendLabelProps.title.id} {...legendLabelProps.title} />
                    <LabelComponent key={legendLabelProps.min.id} {...legendLabelProps.min} />
                    <LabelComponent key={legendLabelProps.max.id} {...legendLabelProps.max} />
                    <LabelComponent key={courseLabelProps.title.id} {...courseLabelProps.title} />
                    <LabelComponent key={courseLabelProps.min.id} {...courseLabelProps.min} />
                    <LabelComponent key={courseLabelProps.max.id} {...courseLabelProps.max} />
                    {hyperlinkProps.map(props => <HyperlinkComponent key={props.id} {...props} />)} 
                </group>
            </Canvas>
        </div>
    );

}