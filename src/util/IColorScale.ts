import { IRange } from "./IRange";

export interface IColorScale {
    sampleRange: IRange;
    legendRange: {
        min: string;
        max: string;
    };
    toRgbaMap: (sample: number) => number[];
    toRgbaLegend: (sample: number) => number[];
}