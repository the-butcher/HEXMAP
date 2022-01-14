/**
 * definition for a container type that holds a canvas with a screenshot rendered to it and a delay
 * for when the canvas is used as content in a single gif frame
 * 
 * @author h.fleischer
 * @since 13.01.2021
 */
export interface IScreenshot {

    canvas: HTMLCanvasElement,

    delay: number;

}