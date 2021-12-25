// import { OrbitControls, OrbitControlsProps } from '@react-three/drei';
import { Camera, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as three from 'three';
import { Scene, WebGLRenderer } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IControlsProps } from './IControlsProps';

export default (props: IControlsProps) => {

    const { invalidate, gl, camera } = useThree(); // camera, gl, scene
    const [screenshotRequested, setSreenshotRequested] = useState<boolean>(false);

    let controls = useRef<OrbitControls>();
    let isLeftButtonPressed = useRef<boolean>(false);

    useEffect(() => {


        controls.current = new OrbitControls(camera, gl.domElement);
        controls.current.screenSpacePanning = false; // https://threejs.org/docs/#examples/en/controls/OrbitControls.screenSpacePanning
        // controls.enableZoom = false;
        controls.current.addEventListener('change', invalidate)
        controls.current.rotateSpeed = 0.25;


        controls.current.enableDamping = false;
        controls.current.dampingFactor = 0.05;
        controls.current.minPolarAngle = 0; // Math.PI / 4; // how far above ground the map can be tilted
        controls.current.maxPolarAngle = Math.PI / 2.05;
        controls.current.minAzimuthAngle = -Math.PI / 4,
            controls.current.maxAzimuthAngle = Math.PI / 8;

        camera.position.set(-198, 450, 577);
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
        window.addEventListener('keyup', e => {
            if (e.key === 'k') {
                console.log('set to true');
                setSreenshotRequested(true);
                invalidate();
            }
        });

        return () => {
            // controls!.dispose();
        };

        // controls.current?.addEventListener('end', () => {
        //     console.log('interaction ended');
        // });

    }, []);


    function renderToJPG(gl: WebGLRenderer, scene: Scene, camera: Camera) {

        gl.domElement.getContext('webgl', { preserveDrawingBuffer: true });
        gl.render(scene, camera);

        gl.domElement.toBlob(
            function (blob) {
                var a = document.createElement('a');
                var url = URL.createObjectURL(blob);
                a.href = url;
                a.download = 'canvas.jpg';
                a.click();
            },
            'image/jpg',
            1.0
        )
        gl.domElement.getContext('webgl', { preserveDrawingBuffer: false });
        console.log('set to false');
        setSreenshotRequested(false);

    }

    useFrame(({ gl, scene, camera }) => {

        if (screenshotRequested) {
            renderToJPG(gl, scene, camera)
        } else {
            gl.render(scene, camera);
        }

    }, 10);

    // useEffect(() => {

        

    // }, [props.stamp]);

    return null;

};
