import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { ILightProps } from './ILightProps';

/**
 * functional react component managing a single directional light
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: ILightProps) => {

    const pointLight = useRef<three.DirectionalLight>();
    const { scene } = useThree();

    useEffect(() => {

        pointLight.current!.position.set(props.position.x, props.position.y, props.position.z);
        pointLight.current!.lookAt(0, 0, 0);
        pointLight.current!.castShadow = true;
        pointLight.current!.shadow.autoUpdate = false;

        // pointLight.current!.shadow.camera.left = 200;
        pointLight.current!.shadow.camera.top = 140;
        pointLight.current!.shadow.camera.bottom = -120;
        pointLight.current!.shadow.camera.left = -260;
        pointLight.current!.shadow.camera.right = 260;
        pointLight.current!.shadow.camera.far = 1000;
        pointLight.current!.shadow.camera.lookAt(0, 0, 0);

        pointLight.current!.shadow.mapSize.width = 1024; // 4096;
        pointLight.current!.shadow.mapSize.height = 4096; // 2048;

        // const helper = new three.CameraHelper( pointLight.current!.shadow.camera );
        // scene.add( helper );

    }, []);

    useEffect(() => {
        console.log('updating light', pointLight.current.position);
        pointLight.current!.shadow.needsUpdate = true;
    }, [props.stamp]);

    useFrame((state) => {
        // console.log('state', state);
    });

    return (
        <directionalLight intensity={1.25} ref={pointLight} castShadow />
    );

};
