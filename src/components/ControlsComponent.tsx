// import { OrbitControls, OrbitControlsProps } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ControlsComponent = () => {

    const { invalidate, camera, gl } = useThree();

    let controls = useRef<OrbitControls>();
    let isLeftButtonPressed = useRef<boolean>(false);

    useEffect(() => {


        controls.current = new OrbitControls(camera, gl.domElement);
        controls.current.screenSpacePanning = false; // https://threejs.org/docs/#examples/en/controls/OrbitControls.screenSpacePanning
        // controls.enableZoom = false;
        controls.current.addEventListener('change', invalidate)


        controls.current.enableDamping = false;
        // controls.current.dampingFactor = 0.05;
        // controls.current.minPolarAngle = Math.PI / 4;
        // controls.current.maxPolarAngle = Math.PI / 2.05;
        // controls.current.minAzimuthAngle = -Math.PI / 4,
        // controls.current.maxAzimuthAngle = Math.PI / 8;

        camera.position.set(-132, 190, 385);
        controls.current.target.set(0, 0, 0);
        controls.current.update();

        window.addEventListener('pointerdown', e => {
            if (e.button === 0) {
                isLeftButtonPressed.current = true;
            }
        });
        window.addEventListener('pointerup', e => {
            if (e.button === 0) {
                isLeftButtonPressed.current = false;
            }
        });

        return () => {
            // controls!.dispose();
        };     
        
        controls.current?.addEventListener('end', () => {
            console.log('interaction ended');
        });

    }, []);         

    useFrame((state) => {

        controls.current!.update();

        // only do this while not orbiting
        // if (isLeftButtonPressed.current) {
        //     // do nothing, scene is orbiting, readjusting the target would cause flickering
        // } else {
        //     var raycaster = new three.Raycaster();
        //     raycaster.setFromCamera( new three.Vector3(0, 0, -0.5), camera );  
        //     var intersects = raycaster.intersectObjects( state.scene.children, true );
        //     if (intersects.length > 0) {
        //         controls.current!.target = intersects[0].point;
        //     }
        // }

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