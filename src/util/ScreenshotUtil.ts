import { Camera, Scene, WebGLRenderer } from "three";
import GIFEncoder from 'gif-encoder-2';
import { IScreenshotOptions } from "./IScreenshotOptions";
import concat from 'concat-stream';
import { IGifFrame } from "./IGifFrame";

export class ScreenshotUtil {

    static createInstance(invalidate: () => void): void {
        if (!this.instance) {
            this.instance = new ScreenshotUtil(invalidate);
        }
    }

    static getInstance(): ScreenshotUtil {
        return this.instance;
    }

    private static instance: ScreenshotUtil;

    private readonly invalidate: () => void;
    // private gifEncoder: GIFEncoder;
    private screenshotOptions: IScreenshotOptions;
    private readonly gifFrames: IGifFrame[];

    private constructor(invalidate: () => void) {
        this.invalidate = invalidate;
        this.gifFrames = [];
    }

    setScreenshotOptions(screenshotOptions: IScreenshotOptions): void {
        this.screenshotOptions = screenshotOptions;
        this.invalidate();
    }

    getScreenshotOptions(): IScreenshotOptions {
        return this.screenshotOptions;
    }

    getFrameCount(): number {
        return this.gifFrames.length;
    }

    getFrame(frameIndex: number): IGifFrame {
        return this.gifFrames[frameIndex];
    }

    renderToGIFFrame(gl: WebGLRenderer, scene: Scene, camera: Camera) {

        console.log('rendering to gif frame')
        // if (!this.gifEncoder) {

        //     this.gifEncoder = new GIFEncoder(1200, 675, 'neuquant', false);
        //     this.gifEncoder.setDelay(200);
        //     this.gifEncoder.createReadStream().pipe(concat((buffer: Uint8Array) => {

        //         const blob = new Blob([buffer], {
        //             type: 'image/gif'
        //         });

        //         var anchor = document.createElement('a');
        //         anchor.href = URL.createObjectURL(blob);
        //         anchor.download = `canvas_3d_${Date.now()}.gif`;
        //         anchor.click();

        //         this.gifEncoder = undefined;
        //         this.screenshotOptions = undefined;
        //         // setSreenshotRequested(undefined);

        //     }));
        //     this.gifEncoder.start();

        // }

        let canvas = this.renderToCanvas(gl, scene, camera);
        canvas.style.width = '120px',
            canvas.style.height = '67px';
        this.gifFrames.push({
            canvas,
            millis: 200
        });
        this.screenshotOptions.done();
        // this.gifEncoder.setDelay(this.screenshotOptions.time);
        // this.gifEncoder.addFrame(outputCanvas.getContext('2d'));

        this.screenshotOptions = undefined;

    }

    renderToGIFImage() {

        // if (this.gifEncoder) {
        //     this.gifEncoder.finish();
        // }
        this.screenshotOptions = undefined;

    }

    renderToPngImage(gl: WebGLRenderer, scene: Scene, camera: Camera) {

        gl.domElement.getContext('webgl', { preserveDrawingBuffer: true });
        gl.render(scene, camera);

        let outputCanvas = this.renderToCanvas(gl, scene, camera);
        outputCanvas.toBlob(
            blob => {
                var a = document.createElement('a');
                var url = URL.createObjectURL(blob);
                a.href = url;
                a.download = `canvas_3d_${Date.now()}`;
                a.click();

                console.log('url', blob, url);

            },
            'image/png',
            1.0
        )

        gl.domElement.getContext('webgl', { preserveDrawingBuffer: false });
        this.screenshotOptions = undefined;

    }

    renderToCanvas(gl: WebGLRenderer, scene: Scene, camera: Camera): HTMLCanvasElement {

        gl.domElement.getContext('webgl', { preserveDrawingBuffer: true });
        gl.render(scene, camera);

        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = 1200;
        outputCanvas.height = 675;
        const outputContext = outputCanvas.getContext('2d');

        const scaleY = outputCanvas.height / gl.domElement.height;
        const dimX = gl.domElement.width * scaleY;
        const dimY = gl.domElement.height * scaleY;
        const offX = (1200 - dimX) / 2;
        const offY = (675 - dimY) / 2;

        outputContext.drawImage(gl.domElement, offX, offY, dimX, dimY);

        return outputCanvas;

    }

}