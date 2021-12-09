import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { ILightProps } from './ILightProps';


export default (props: ILightProps) => {

    const directionalLight = useRef<three.DirectionalLight>();
    // const directionalLightHelper = useHelper(directionalLight, three.DirectionalLightHelper, 1)

    useEffect(() => {

        directionalLight.current!.position.set(props.position.x, props.position.y, props.position.z); 
        directionalLight.current!.lookAt(0, 0, 0);
        directionalLight.current!.castShadow = true;
        // directionalLight.current!.shadow.autoUpdate = true;
        directionalLight.current!.shadowMapWidth = 4096;
        directionalLight.current!.shadowMapHeight = 4096

        

    }, []);      

    useFrame((state) => {
        // console.log('state', state);
    });

    return (
        <pointLight intensity={ 1 } ref={ directionalLight } castShadow shadowCameraFar={ 1000 } shadowMapWidth={ 4096 } shadowMapHeight={ 4096 } />
    );

};
