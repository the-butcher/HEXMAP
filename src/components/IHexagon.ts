/**
 * hexagon data-structure once the pbf has loaded
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */

export interface IHexagon {

    /**
     * the index of this hexagon
     */
    i: number;

    /**
     * positions of the hexagon
     */
    x: number;
    y: number;
    z: number;

    col: number;
    row: number;

    /**
     * color of the hexagon
     */
    r: number;
    g: number;
    b: number;

    /**
     * gemeindekennziffer
     */
    gkz: string | undefined;

    /**
     * land-use-code - corine land use code
     */
    luc: number;

    /**
     * elevation at the center of the hexagon Math.round(meters * 4)
     */
    ele: number;

}