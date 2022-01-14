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
        canvas.style.width = '120px';
        canvas.style.height = '67px';
        this.frames.push({
            canvas,
            delay: 200
        });
        this.screenshotOptions.done();
        this.screenshotOptions = undefined;

    }

    exportToGif() {

        const gifEncoder = new GIFEncoder(1200, 675, 'neuquant', false);
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