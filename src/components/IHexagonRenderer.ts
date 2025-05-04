import { IHexagon } from "./IHexagon";

/**
 * @deprecated
 */
export interface IHexagonRendererSchedule {
    instantA: number,
    instantB: number
}

/**
 * @deprecated
 */
 export interface IHexagonRenderer {

    id: string;

    getSchedule: () => IHexagonRendererSchedule;

    getHeight: (values: IHexagon) => number;

    getColor: (values: IHexagon, target: number[]) => number[];

}