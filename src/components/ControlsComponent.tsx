// import { OrbitControls, OrbitControlsProps } from '@react-three/drei';
import { Key } from '@mui/icons-material';
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
        controls.current.enableKeys = true;
        controls.current.keys = {
            LEFT: 'ArrowLeft', //left arrow
            UP: 'ArrowUp', // up arrow
            RIGHT: 'ArrowRight', // right arrow
            BOTTOM: 'ArrowDown' // down arrow
        }
        // controls.current.minPolarAngle = 0; // Math.PI / 4; // how far above ground the map can be tilted
        // controls.current.maxPolarAngle = Math.PI / 2.05;
        // controls.current.minAzimuthAngle = -Math.PI / 4,
        // controls.current.maxAzimuthAngle = Math.PI / 8;

        controls.current.addEventListener('change', e => {
            // console.log('polar angle', controls.current.getPolarAngle(), camera.position,  controls.current.target, controls.current.getPolarAngle(), controls.current.getAzimuthalAngle());
        });

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
            if (e.code === 'ArrowLeft') {

            }
            if (e.key === 'c') {

                controls.current.minAzimuthAngle = 0,
                controls.current.maxAzimuthAngle = 0;
                controls.current.minPolarAngle = 0.43; // Math.PI / 4; // how far above ground the map can be tilted
                controls.current.maxPolarAngle = 0.43;
                // camera.position.set(6.78513577491969, 443.84028283902745, 186.7686468436712);
                // controls.current.target.set(6.78513577491969, 0, 34.74231275973837);
                camera.position.set(-16.907294646056016, 411.01271753556387, 260.12818711663294);
                controls.current.target.set(3.6580133669590973, -1.0771583963911797e-17, 34.84654770500994);
                controls.current.update();

                controls.current.minAzimuthAngle = -Math.PI / 4,
                controls.current.maxAzimuthAngle = Math.PI / 8;
                controls.current.minPolarAngle = 0; // Math.PI / 4; // how far above ground the map can be tilted
                controls.current.maxPolarAngle = Math.PI / 2.05;
                controls.current.update();                    

            }            
            if (e.key === 'k') {

                setSreenshotRequested(true);
                invalidate();

                // controls.current.minAzimuthAngle = controls.current.getAzimuthalAngle() + Math.PI / 36,
                // controls.current.maxAzimuthAngle = controls.current.getAzimuthalAngle() + Math.PI / 36;
                // controls.current.update();

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
