// import { OrbitControls, OrbitControlsProps } from '@react-three/drei';
import { FormControlLabel } from '@mui/material';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as three from 'three';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ControlsComponent = () => {



    // camera.position.set(-120, 150, 350);
    // Ref to the controls, so that we can update them on every frame using useFrame
    // const controls = useRef<OrbitControlsProps>({
    //     camera,
    //     domElement,
    //     enableZoom: true,
    // });

    const { camera, gl } = useThree();

    useEffect(() => {

        const controls = new OrbitControls(camera, gl.domElement);
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 2.2;
        controls.minAzimuthAngle = -Math.PI / 4,
        controls.maxAzimuthAngle = Math.PI / 8;

        camera.position.set(-132, 190, 385);
        controls.target.set(0, 0, 0);
        controls.update();
        return () => {
            controls!.dispose();
        };        

    }, []);         

    useFrame((state) => {
        // console.log('state', state);
    });

    return null;
        // <OrbitControls
        //     // ref={controls}
        //     args={ [camera, domElement] }
        //     camera={ camera }
        //     enableZoom={ true }
        //     screenSpacePanning={ false }
        // />


    // minPolarAngle={ -Math.PI }
    // maxPolarAngle={ Math.PI / 2.2 }


};

export default () => {
    return (
        <ControlsComponent />
    );
};