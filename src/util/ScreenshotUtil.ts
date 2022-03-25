import { Camera, Scene, WebGLRenderer } from "three";
import GIFEncoder from 'gif-encoder-2';
import { IScreenshotOptions } from "./IScreenshotOptions";
import concat from 'concat-stream';
import { IScreenshot } from "./IScreenshot";

/**
 * utility type for taking snapshots of the current scene and exporting it to either PNG or GIF
 * 
 * @author h.fleischer
 * @since 13.01.2021
 */
export class ScreenshotUtil {

    static readonly OUTPUT_DIM_X = 1200;
    static readonly OUTPUT_DIM_Y = 675; // 675

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
    private screenshotOptions: IScreenshotOptions;
    private readonly frames: IScreenshot[];

    private constructor(invalidate: () => void) {
        this.invalidate = invalidate;
        this.frames = [];
    }

    setDelay(frameIndex: number, delay: number): void {
        this.frames[frameIndex].delay = delay;
    }

    setScreenshotOptions(screenshotOptions: IScreenshotOptions): void {
        this.screenshotOptions = screenshotOptions;
        this.invalidate();
    }

    getScreenshotOptions(): IScreenshotOptions {
        return this.screenshotOptions;
    }

    getFrameCount(): number {
        return this.frames.length;
    }

    getFrame(frameIndex: number): IScreenshot {
        return this.frames[frameIndex];
    }

    removeFrame(frameIndex: number): void {
        this.frames.splice(frameIndex, 1);
    }

    renderToFrame(gl: WebGLRenderer, scene: Scene, camera: Camera) {

        let canvas = this.renderToCanvas(gl, scene, camera);
        canvas.style.width = `${ScreenshotUtil.OUTPUT_DIM_X / 10}px`;
        canvas.style.height = `${ScreenshotUtil.OUTPUT_DIM_Y / 10}px`;
        this.frames.push({
            canvas,
            delay: 100
        });
        this.screenshotOptions.done();
        this.screenshotOptions = undefined;

    }

    exportToGif() {

        const gifEncoder = new GIFEncoder(ScreenshotUtil.OUTPUT_DIM_X, ScreenshotUtil.OUTPUT_DIM_Y, 'neuquant', false);
        gifEncoder.setDelay(200);
        gifEncoder.createReadStream().pipe(concat((buffer: Uint8Array) => {

            const blob = new Blob([buffer], {
                type: 'image/gif'
            });

            var anchor = document.createElement('a');
            anchor.href = URL.createObjectURL(blob);
            anchor.download = `canvas_3d_${Date.now()}.gif`;
            anchor.click();

        }));

        gifEncoder.start();
        this.frames.forEach(gifFrame => {
            gifEncoder.setDelay(gifFrame.delay);
            gifEncoder.addFrame(gifFrame.canvas.getContext('2d'));
        });
        gifEncoder.finish();

    }

    exportToPng() {

        this.frames[0].canvas.toBlob(
            blob => {
                var a = document.createElement('a');
                var url = URL.createObjectURL(blob);
                a.href = url;
                a.download = `canvas_3d_${Date.now()}`;
                a.click();
            },
            'image/png',
            1.0
        )

    }

    renderToCanvas(gl: WebGLRenderer, scene: Scene, camera: Camera): HTMLCanvasElement {

        gl.domElement.getContext('webgl', { preserveDrawingBuffer: true });
        gl.render(scene, camera);

        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = ScreenshotUtil.OUTPUT_DIM_X;
        outputCanvas.height = ScreenshotUtil.OUTPUT_DIM_Y;
        const outputContext = outputCanvas.getContext('2d');

        const scaleY = outputCanvas.height / gl.domElement.height;
        const dimX = gl.domElement.width * scaleY;
        const dimY = gl.domElement.height * scaleY;
        const offX = (ScreenshotUtil.OUTPUT_DIM_X - dimX) / 2;
        const offY = (ScreenshotUtil.OUTPUT_DIM_Y - dimY) / 2;

        outputContext.drawImage(gl.domElement, offX, offY, dimX, dimY);

        return outputCanvas;

    }

}