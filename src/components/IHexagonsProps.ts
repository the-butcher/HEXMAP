import { IHexagon } from "./IHexagon";

// export type ViewOrientation = 'northwards' | 'southwards';

/**
 * definition of the hexagon-component properties
 *
 * @author h.fleischer
 * @since 05.02.2022
 */
export interface IHexagonsProps {

    /**
     * color getter for any hexagon
     * @param hexagon
     * @returns a rgba color value
     */
    getRgba: (hexagon: IHexagon) => number[];

    getZVal: (hexagon: IHexagon) => number;

    hasTransparency: boolean;

    onHexagonClicked: (hexagon: IHexagon) => void;

}