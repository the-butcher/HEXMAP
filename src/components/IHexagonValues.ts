export interface IHexagonValues {

    /**
     * positions of the hexagon
     */
    x: number;
    y: number;
    z: number;

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
     * corine land use code
     */
    luc: number;

    /**
     * elevation at the center of the hexagon
     */
    ele: number;

}