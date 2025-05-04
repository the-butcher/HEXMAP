/**
 * hexagon data-structure once the pbf has loaded
 *
 * @author h.fleischer
 * @since 11.12.2021
 */

export interface IHexagon {

    id: number;

    /**
     * the index of this hexagon
     */
    sortkeyN: number;
    sortkeyS: number;

    /**
     * positions of the hexagon
     */
    x: number;
    y: number;
    z: number;

    col: number;
    row: number;

    /**
     * gemeindekennziffer
     */
    gkz: string;

    /**
     * land-use-code - corine land use code
     */
    luc: number;

    /**
     * elevation at the center of the hexagon Math.round(meters * 4)
     */
    ele: number;

}