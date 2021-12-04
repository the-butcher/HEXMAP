import { useFrame } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as three from 'three';
import { IHexagonsComponentProps } from './IHexagonsComponentProps';
import { ILightComponentProps } from './ILightComponentProps';


export default (props: ILightComponentProps) => {

    const directionalLight = useRef<three.DirectionalLight>();
    // const directionalLightHelper = useHelper(directionalLight, three.DirectionalLightHelper, 1)

    useEffect(() => {

        directionalLight.current!.position.set(props.position.x, props.position.y, props.position.z); 
        directionalLight.current!.lookAt(0, 0, 0);

    }, []);      

    useFrame((state) => {
        // console.log('state', state);
    });

    return (
        <directionalLight ref={ directionalLight } />
       
    );

};
