export interface IRasterData {
    name: string;
    data: Float32Array;
    width: number;
    height: number;
    cellsize: number;
    xOrigin: number;
    yOrigin: number;
}