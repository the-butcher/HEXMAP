import { IChartEntry } from "./IChartEntry";

export interface IChartData {

    entries: IChartEntry[];

    valueCount: number;
    
    minX: number;
    maxX: number;

    minY: number;
    maxY: number;
    
}