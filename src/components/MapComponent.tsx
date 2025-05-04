import { Environment } from '@react-three/drei';
import { Canvas, RootState } from "@react-three/fiber";
import { createRef, useRef } from 'react';
import { PCFSoftShadowMap } from "three";
import { ObjectUtil } from '../util/ObjectUtil';
import BoundaryComponent from "./BoundaryComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import { IMapProps } from "./IMapProps";

/**
 * functional react component describing the entire map / scene
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
function MapComponent(props: IMapProps) {

    const { controlsProps } = props;
    const canvasRef = createRef<HTMLCanvasElement>();
    const canvasCallbackRef = (canvasElement: HTMLCanvasElement) => {

        if (canvasElement && !canvasRef.current) {

            // console.log('canvasElement', canvasElement);
            canvasRef.current = canvasElement;

            document.addEventListener('keydown', e => {
                if (e.key === 'p') {
                    window.clearTimeout(exportPngRef.current);
                    exportPngRef.current = window.setTimeout(() => {
                        exportToPng(canvasRef.current!);
                    }, 100);
                }
            });

        }
    };
    const exportPngRef = useRef<number>(-1);

    // const planegeomref = useRef<PlaneGeometry>(new PlaneGeometry(400, 500));

    function onCreated(state: RootState): void {
        state.gl.setClearColor("#42423a");
    }

    const exportToPng = (canvasElement: HTMLCanvasElement) => {

        const pngDataUrl = canvasElement.toDataURL();
        const pngDownloadLink = document.createElement('a');
        pngDownloadLink.setAttribute('href', pngDataUrl);
        pngDownloadLink.setAttribute('download', `testpng_${ObjectUtil.createId()}`); // TODO format with dates
        pngDownloadLink.click();

    }

    return (

        <Canvas
            style={{
                position: 'absolute',
                height: '100%',
                width: '100%'
            }}
            ref={canvasCallbackRef}
            frameloop='demand'
            gl={{ antialias: true, localClippingEnabled: false, preserveDrawingBuffer: true }}
            shadows={{ type: PCFSoftShadowMap, enabled: true, autoUpdate: false }}
            onCreated={onCreated}
            camera={{ position: [0, 300, 0], fov: 40, far: 10000 }}
        >
            <Environment preset="sunset" environmentIntensity={0.50} backgroundBlurriness={0.1} resolution={64} />
            <ControlsComponent key={controlsProps.id} {...controlsProps} />
            {/* <Stats /> */}
            {/* <SunCompoment {...TimeUtil.getSunProps()} /> */}
            {/* <ambientLight intensity={0.20} /> */}
            {/* <gridHelper args={[1000, 10, '#ff0000', '#666666']} /> */}
            <BoundaryComponent />
            <HexagonsComponent {...props} />
            {/* {[0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.8, -0.9, -1.0].map(v => <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, v, 0]} receiveShadow>
                        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
                        <meshStandardMaterial color={[0.02, 0.02, 0.015]} wireframe={false} transparent opacity={0.25} />
                    </mesh>)} */}

        </Canvas>

    );

}

export default MapComponent;