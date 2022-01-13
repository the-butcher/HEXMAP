export type SCREENSHOT_TYPE = 'png_image' | 'gif_frame' | 'gif_image';
export interface IScreenshotOptions {
    type: SCREENSHOT_TYPE;
    done: () => void;
}