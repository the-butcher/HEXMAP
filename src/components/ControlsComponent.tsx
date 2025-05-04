import { useFrame, useThree } from '@react-three/fiber';
import { createRef, useEffect, useRef } from 'react';
import * as three from 'three';
import { Plane } from 'three';
import { IControlsProps } from './IControlsProps';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/**
 * component handling map controls (no actualy contribution to the dom)
 *
 * @author h.fleischer
 * @since 05.02.2022
 */
function ControlsComponent(props: IControlsProps) {

    const MOUSE_COORD_INDEX_WHEEL = 2;

    const { invalidate, gl, camera } = useThree(); // camera, gl, scene

    const controls = createRef<OrbitControls>();
    const navplane = useRef<Plane>(new three.Plane(new three.Vector3(0, 1, 0), 0));
    const mousepos = useRef<[number, number, number]>([0, 0, 0]);


    const resetAngleConstraints = () => {

        // controls.current.minAzimuthAngle = -Math.PI / 4;
        // controls.current.maxAzimuthAngle = Math.PI / 8;
        controls.current!.minAzimuthAngle = Number.POSITIVE_INFINITY;
        controls.current!.maxAzimuthAngle = Number.POSITIVE_INFINITY;

        controls.current!.minPolarAngle = 0; // Math.PI / 4; // how far above ground the map can be tilted
        controls.current!.maxPolarAngle = Math.PI / 2.05;
        controls.current!.update();

    }

    useEffect(() => {

        console.debug('✨ building controls component', props);

        controls.current = new OrbitControls(camera, gl.domElement);
        controls.current.screenSpacePanning = false; // https://threejs.org/docs/#examples/en/controls/OrbitControls.screenSpacePanning
        // controls.current.enableZoom = false;

        controls.current.addEventListener('change', () => invalidate())
        controls.current.rotateSpeed = 0.25;

        controls.current.enableDamping = false;
        // controls.current.dampingFactor = 0.05;
        // controls.current.enableKeys = true;

        controls.current.addEventListener('change', () => {

            // console.log('polar angle', controls.current.getPolarAngle(), camera.position, controls.current.target, controls.current.getPolarAngle(), controls.current.getAzimuthalAngle());
            // console.log('pt', camera.position, controls.current.target);

        });

        camera.position.set(-198, 450, 577);
        controls.current.target.set(0, 0, 0);
        controls.current.update();

        // const helper = new three.CameraHelper(camera);
        // scene.add(helper);

        const angleIncrement = 0.005;
        window.addEventListener('keyup', e => {

            if (e.key === 'a') {

                const azimuthAngle = controls.current!.getAzimuthalAngle() - angleIncrement;
                controls.current!.minAzimuthAngle = azimuthAngle;
                controls.current!.maxAzimuthAngle = azimuthAngle;
                controls.current!.update();
                resetAngleConstraints();

            } else if (e.key === 'd') {

                const azimuthAngle = controls.current!.getAzimuthalAngle() + angleIncrement;
                controls.current!.minAzimuthAngle = azimuthAngle;
                controls.current!.maxAzimuthAngle = azimuthAngle;
                controls.current!.update();
                resetAngleConstraints();

            } else if (e.key === 'c') {

                // controls.current.minAzimuthAngle = 0;
                // controls.current.maxAzimuthAngle = 0;
                // controls.current.minPolarAngle = 0.43; // Math.PI / 4; // how far above ground the map can be tilted
                // controls.current.maxPolarAngle = 0.43;

                camera.position.set(-151.85595444996528, 277.67792249991356, 373.9841653317079);
                controls.current!.target.set(-29.677668550003357, -2.832274779813475e-15, 17.939362481818677);

                // camera.position.set(-16.907294646056016, 411.01271753556387, 260.12818711663294);
                // controls.current.target.set(3.6580133669590973, -1.0771583963911797e-17, 34.84654770500994);

                controls.current!.update();

                resetAngleConstraints();

            } else if (e.key === 'p') {

                console.log(`camera.position.set(${camera.position.x}, ${camera.position.y}, ${camera.position.z});`);
                console.log(`controls.current.target.set(${controls.current!.target.x}, ${controls.current!.target.y}, ${controls.current!.target.z});`);

            }

        });

        // window.addEventListener('mousemove', e => {
        //     const x = (e.clientX / window.innerWidth) * 2 - 1;
        //     const y = - (e.clientY / window.innerHeight) * 2 + 1;
        //     mousepos.current = [x, y, 0];
        // });

        gl.domElement.addEventListener('wheel', (e: WheelEvent) => {

            e.stopPropagation();
            // controls.current!.enableZoom = false;

            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = - (e.clientY / window.innerHeight) * 2 + 1;
            mousepos.current = [x, y, 0];
            mousepos.current[MOUSE_COORD_INDEX_WHEEL] = e.deltaY;
            invalidate();

        });


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useFrame(({ gl, scene, camera }) => {

        // console.log('📸 rendering controls component (gl.shadowMap.needsUpdate)', gl.shadowMap.needsUpdate);

        if (controls.current && mousepos.current[MOUSE_COORD_INDEX_WHEEL] !== 0) {

            const zoomFactor = mousepos.current[MOUSE_COORD_INDEX_WHEEL] / 1000;

            const raycaster = new three.Raycaster();

            raycaster.setFromCamera(new three.Vector2(mousepos.current[0], mousepos.current[1]), camera);
            const zoomCenterCurr = raycaster.ray.intersectPlane(navplane.current, new three.Vector3());

            raycaster.setFromCamera(new three.Vector2(0, 0), camera);
            const zoomTargetCurr = raycaster.ray.intersectPlane(navplane.current, new three.Vector3());

            const zoomCameraCurr = camera.position;

            const zoomTargetDiff = new three.Vector3().subVectors(zoomCenterCurr!, zoomTargetCurr!);
            const zoomCameraDiff = new three.Vector3().subVectors(zoomCameraCurr, zoomCenterCurr!);

            const zoomTargetDest = new three.Vector3().addVectors(zoomTargetCurr!, zoomTargetDiff.multiplyScalar(-zoomFactor));
            const zoomCameraDest = new three.Vector3().addVectors(zoomCameraCurr, zoomCameraDiff.multiplyScalar(zoomFactor));

            /**
             * angles need to be fixed for some reason when altering target and camera
             */
            const azimuthalAngle = controls.current!.getAzimuthalAngle();
            controls.current!.minAzimuthAngle = azimuthalAngle;
            controls.current!.maxAzimuthAngle = azimuthalAngle;
            const polarAngle = controls.current!.getPolarAngle()
            controls.current!.minPolarAngle = polarAngle;
            controls.current!.maxPolarAngle = polarAngle;

            controls.current!.target.set(zoomTargetDest.x, zoomTargetDest.y, zoomTargetDest.z);
            camera.position.set(zoomCameraDest.x, zoomCameraDest.y, zoomCameraDest.z);
            controls.current!.update();

            resetAngleConstraints();

            // reset so there is no further zooming
            mousepos.current[MOUSE_COORD_INDEX_WHEEL] = 0;

        }

        gl.render(scene, camera);

    }, 10);

    return null;

};

export default ControlsComponent;
