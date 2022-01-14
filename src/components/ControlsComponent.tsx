import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ScreenshotUtil } from '../util/ScreenshotUtil';
import { IControlsProps } from './IControlsProps';

export default (props: IControlsProps) => {

    const { invalidate, gl, camera } = useThree(); // camera, gl, scene
    let controls = useRef<OrbitControls>();

    const resetAngleConstraints = () => {

        controls.current.minAzimuthAngle = -Math.PI / 4;
        controls.current.maxAzimuthAngle = Math.PI / 8;
        controls.current.minPolarAngle = 0; // Math.PI / 4; // how far above ground the map can be tilted
        controls.current.maxPolarAngle = Math.PI / 2.05;
        controls.current.update();

    }

    useEffect(() => {

        console.debug('✨ building controls component', props);

        ScreenshotUtil.createInstance(invalidate);

        controls.current = new OrbitControls(camera, gl.domElement);
        controls.current.screenSpacePanning = false; // https://threejs.org/docs/#examples/en/controls/OrbitControls.screenSpacePanning
        // controls.enableZoom = false;
        controls.current.addEventListener('change', invalidate)
        controls.current.rotateSpeed = 0.25;

        controls.current.enableDamping = false;
        controls.current.dampingFactor = 0.05;
        controls.current.enableKeys = true;

        controls.current.addEventListener('change', e => {
            // console.log('polar angle', controls.current.getPolarAngle(), camera.position,  controls.current.target, controls.current.getPolarAngle(), controls.current.getAzimuthalAngle());
        });

        camera.position.set(-198, 450, 577);
        controls.current.target.set(0, 0, 0);
        controls.current.update();

        const angleIncrement = 0.005;
        window.addEventListener('keyup', e => {

            if (e.key === 'a') {

                const azimuthAngle = controls.current.getAzimuthalAngle() - angleIncrement;
                controls.current.minAzimuthAngle = azimuthAngle;
                controls.current.maxAzimuthAngle = azimuthAngle;
                controls.current.update();
                resetAngleConstraints();

            } else if (e.key === 'd') {

                const azimuthAngle = controls.current.getAzimuthalAngle() + angleIncrement;
                controls.current.minAzimuthAngle = azimuthAngle;
                controls.current.maxAzimuthAngle = azimuthAngle;
                controls.current.update();
                resetAngleConstraints();

            } else if (e.key === 'c') {

                controls.current.minAzimuthAngle = 0;
                controls.current.maxAzimuthAngle = 0;
                controls.current.minPolarAngle = 0.43; // Math.PI / 4; // how far above ground the map can be tilted
                controls.current.maxPolarAngle = 0.43;
                // camera.position.set(6.78513577491969, 443.84028283902745, 186.7686468436712);
                // controls.current.target.set(6.78513577491969, 0, 34.74231275973837);
                camera.position.set(-16.907294646056016, 411.01271753556387, 260.12818711663294);
                controls.current.target.set(3.6580133669590973, -1.0771583963911797e-17, 34.84654770500994);
                controls.current.update();

                resetAngleConstraints();

            }

        });


    }, []);

    useFrame(({ gl, scene, camera }) => {

        const screenshotOptions = ScreenshotUtil.getInstance().getScreenshotOptions();
        if (screenshotOptions) {
            ScreenshotUtil.getInstance().renderToFrame(gl, scene, camera)
        } else {
            gl.render(scene, camera);
        }

    }, 10);

    return null;

};
