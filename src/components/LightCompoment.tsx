
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { ILightProps } from './ILightProps';


function LightCompoment(props: ILightProps) {

    const lightRef = useRef<three.DirectionalLight>(new three.DirectionalLight());
    const { gl, invalidate } = useThree();

    const { stamp, intensity } = props;

    const configureLight = (light: three.DirectionalLight, textureFraction: number) => {

        light.position.set(props.position.x, props.position.y, props.position.z);
        light.lookAt(0, 0, 0);
        light.castShadow = true;
        light.shadow.autoUpdate = false;

        light.shadow.camera.top = 140;
        light.shadow.camera.bottom = -120;
        light.shadow.camera.left = -260;
        light.shadow.camera.right = 260;
        light.shadow.camera.far = 1000;
        light.shadow.camera.lookAt(0, 0, 0);
        light.shadow.bias = -0.00000000000000000000000000000000005;

        const maxTextureSize = gl.capabilities.maxTextureSize;

        light.shadow.mapSize.width = maxTextureSize / textureFraction;
        light.shadow.mapSize.height = maxTextureSize / textureFraction / 2;

    }
    useEffect(() => {

        console.debug('✨ building light component', props);

        configureLight(lightRef.current, 1);

        lightRef.current.shadow.needsUpdate = true;
        gl.shadowMap.needsUpdate = true;

        invalidate();

        // scene.add(new three.DirectionalLightHelper(lightRef.current));
        // scene.add(new three.CameraHelper(lightRef.current.shadow.camera));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {


        console.log('🔄 updating light component (stamp)', stamp);

        lightRef.current.shadow.needsUpdate = true;
        gl.shadowMap.needsUpdate = true;

        invalidate();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stamp]);

    return (
        <directionalLight intensity={intensity} ref={lightRef} castShadow />
    );

};

export default LightCompoment;
