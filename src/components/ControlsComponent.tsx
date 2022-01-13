import { Camera, useFrame, useThree } from '@react-three/fiber';
import concat from 'concat-stream';
import GIFEncoder from 'gif-encoder-2';
import { useEffect, useRef, useState } from 'react';
import { Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ScreenshotUtil } from '../util/ScreenshotUtil';
import { TimeUtil } from '../util/TimeUtil';
import { IControlsProps } from './IControlsProps';
import { IScreenshotOptions } from '../util/IScreenshotOptions';

export default (props: IControlsProps) => {

    const { invalidate, gl, camera } = useThree(); // camera, gl, scene
    // const [screenshotRequested, setSreenshotRequested] = useState<IScreenshotOptions>();

    let controls = useRef<OrbitControls>();
    // let cinstant = useRef<number>();
    // let gifEncoder = useRef<GIFEncoder>();

    const { instant, stamp } = props;

    // /**
    //  * triggered from keypress, calling the callback specified in props
    //  * @param event 
    //  * @param value 
    //  */
    // const incrementInstant = () => {
    //     onInstantChange(cinstant.current + TimeUtil.MILLISECONDS_PER____DAY);
    // }

    const resetAngleConstraints = () => {

        controls.current.minAzimuthAngle = -Math.PI / 4;
        controls.current.maxAzimuthAngle = Math.PI / 8;
        controls.current.minPolarAngle = 0; // Math.PI / 4; // how far above ground the map can be tilted
        controls.current.maxPolarAngle = Math.PI / 2.05;
        controls.current.update();

    }

    useEffect(() => {

        console.log('✨ building controls component', props);

        ScreenshotUtil.createInstance(invalidate);

        controls.current = new OrbitControls(camera, gl.domElement);
        controls.current.screenSpacePanning = false; // https://threejs.org/docs/#examples/en/controls/OrbitControls.screenSpacePanning
        // controls.enableZoom = false;
        controls.current.addEventListener('change', invalidate)
        controls.current.rotateSpeed = 0.25;

        controls.current.enableDamping = false;
        controls.current.dampingFactor = 0.05;
        controls.current.enableKeys = true;
        // controls.current.keys = {
        //     LEFT: 'ArrowLeft', //left arrow
        //     UP: 'ArrowUp', // up arrow
        //     RIGHT: 'ArrowRight', // right arrow
        //     BOTTOM: 'ArrowDown' // down arrow
        // }
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

            // else if (e.key === 'p') {

            //     setSreenshotRequested({
            //         type: 'png_image'
            //     });
            //     invalidate();
            //     // incrementInstant();

            // } else if (e.key === 'f') {

            //     setSreenshotRequested({
            //         type: 'gif_frame',
            //         time: 200
            //     });
            //     invalidate();

            // } else if (e.key === 'F') {

            //     setSreenshotRequested({
            //         type: 'gif_frame',
            //         time: 1000
            //     });
            //     invalidate();

            // } else if (e.key === 'g') {

            //     setSreenshotRequested({
            //         type: 'gif_image'
            //     });
            //     invalidate();

            // }


        });

        return () => {
            // controls!.dispose();
        };

        // controls.current?.addEventListener('end', () => {
        //     console.log('interaction ended');
        // });

    }, []);

    // useEffect(() => {

    //     console.log('🔧 updating controls component (stamp)', props);
    //     // cinstant.current = instant;

    // }, [stamp]);

    // function renderToGIFFrame(gl: WebGLRenderer, scene: Scene, camera: Camera) {


    //     if (!gifEncoder.current) {

    //         gifEncoder.current = new GIFEncoder(1200, 675, 'neuquant', false);
    //         gifEncoder.current.setDelay(200);
    //         gifEncoder.current.createReadStream().pipe(concat((buffer: Uint8Array) => {

    //             const blob = new Blob([buffer], {
    //                 type: 'image/gif'
    //             });

    //             var anchor = document.createElement('a');
    //             anchor.href = URL.createObjectURL(blob);
    //             anchor.download = `canvas_3d_${Date.now()}.gif`;
    //             anchor.click();

    //             gifEncoder.current = undefined;
    //             setSreenshotRequested(undefined);

    //         }));
    //         gifEncoder.current.start();

    //     }

    //     let outputCanvas = renderToCanvas(gl, scene, camera);
    //     gifEncoder.current.setDelay(screenshotRequested.time);
    //     gifEncoder.current.addFrame(outputCanvas.getContext('2d'));

    //     setSreenshotRequested(undefined);

    // }

    // function renderToGIFImage() {

    //     if (gifEncoder.current) {
    //         gifEncoder.current.finish();
    //     }
    //     setSreenshotRequested(undefined);

    // }

    // function renderToPngImage(gl: WebGLRenderer, scene: Scene, camera: Camera) {

    //     gl.domElement.getContext('webgl', { preserveDrawingBuffer: true });
    //     gl.render(scene, camera);

    //     let outputCanvas = renderToCanvas(gl, scene, camera);
    //     outputCanvas.toBlob(
    //         blob => {
    //             var a = document.createElement('a');
    //             var url = URL.createObjectURL(blob);
    //             a.href = url;
    //             a.download = `canvas_3d_${Date.now()}`;
    //             a.click();

    //             console.log('url', blob, url);

    //         },
    //         'image/png',
    //         1.0
    //     )

    //     gl.domElement.getContext('webgl', { preserveDrawingBuffer: false });
    //     setSreenshotRequested(undefined);

    // }

    // function renderToCanvas(gl: WebGLRenderer, scene: Scene, camera: Camera): HTMLCanvasElement {

    //     gl.domElement.getContext('webgl', { preserveDrawingBuffer: true });
    //     gl.render(scene, camera);

    //     const outputCanvas = document.createElement('canvas');
    //     outputCanvas.width = 1200;
    //     outputCanvas.height = 675;
    //     const outputContext = outputCanvas.getContext('2d');

    //     const scaleY = outputCanvas.height / gl.domElement.height;
    //     const dimX = gl.domElement.width * scaleY;
    //     const dimY = gl.domElement.height * scaleY;
    //     const offX = (1200 - dimX) / 2;
    //     const offY = (675 - dimY) / 2;

    //     outputContext.drawImage(gl.domElement, offX, offY, dimX, dimY);

    //     return outputCanvas;

    // }

    useFrame(({ gl, scene, camera }) => {

        const screenshotOptions = ScreenshotUtil.getInstance().getScreenshotOptions();
        if (screenshotOptions) {
            // TODO move to screenshot options altogether
            if (screenshotOptions.type === 'png_image') {
                ScreenshotUtil.getInstance().renderToPngImage(gl, scene, camera)
            } else if (screenshotOptions.type === 'gif_frame') {
                ScreenshotUtil.getInstance().renderToGIFFrame(gl, scene, camera)
            } else if (screenshotOptions.type === 'gif_image') {
                ScreenshotUtil.getInstance().renderToGIFImage()
            }
        } else {
            gl.render(scene, camera);
        }

    }, 10);

    // useEffect(() => {
    //     console.log('🔧 updating controls component', props);   
    // }, [props.stamp]);

    return null;

};
