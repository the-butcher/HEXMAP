import * as d3Array from 'd3-array';
import { IRasterData } from '../data/IRasterData';
import { IRange } from "../util/IRange";

/**
 * utility type for raster operations
 *
 * @author h.fleischer
 * @since 19.04.2025
 */
export class Raster {

    static RAD2DEG = 180 / Math.PI;
    static DEG2RAD = Math.PI / 180;

    static getSampleRange(rasterData: Pick<IRasterData, 'data' | 'width' | 'height'>): IRange {
        let pixelIndex: number;
        let valCur: number;
        let valMin = Number.MAX_VALUE;
        let valMax = Number.MIN_VALUE;
        for (let y = 0; y < rasterData.height; y++) {
            for (let x = 0; x < rasterData.width; x++) {
                pixelIndex = (y * rasterData.width + x);
                valCur = rasterData.data[pixelIndex];
                valMin = Math.min(valMin, valCur);
                valMax = Math.max(valMax, valCur);
            }
        }
        return {
            min: valMin,
            max: valMax
        };
    }

    static getRasterX(rasterData: IRasterData, worldX: number): number {
        return (worldX - rasterData.xOrigin) / rasterData.cellsize;
    }

    static getRasterY(rasterData: IRasterData, worldY: number): number {
        return (rasterData.yOrigin - worldY) / rasterData.cellsize;
    }

    static blurRasterData(rasterData: IRasterData, blurFactor: number): IRasterData {

        const data = new Float32Array(rasterData.data);
        d3Array.blur2({ data, width: rasterData.width }, blurFactor);

        return {
            ...rasterData,
            data
        };

    }

    static getRasterValue(rasterData: IRasterData, x: number, y: number) {

        const xA = Math.floor(x);
        const xB = Math.ceil(x);
        const xF = x - xA;

        const yA = Math.floor(y);
        const yB = Math.ceil(y);
        const yF = y - yA;

        const valXAYA = rasterData.data[yA * rasterData.width + xA];
        const valXAYB = rasterData.data[yB * rasterData.width + xA];
        const valXBYA = rasterData.data[yA * rasterData.width + xB];
        const valXBYB = rasterData.data[yB * rasterData.width + xB];

        const interpolateValue = (a: number, b: number, f: number) => {
            return a + (b - a) * f;
        };

        // between upper pixels
        const valFYA = interpolateValue(valXAYA, valXBYA, xF);
        // between lower pixels
        const valFYB = interpolateValue(valXAYB, valXBYB, xF);
        // final interpolation
        const valRes = interpolateValue(valFYA, valFYB, yF);

        return valRes;

    }

}