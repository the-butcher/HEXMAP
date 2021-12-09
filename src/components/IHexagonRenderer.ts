import { IHexagonValues } from "./IHexagonValues";

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

    getHeight: (values: IHexagonValues) => number;

    getColor: (values: IHexagonValues, target: number[]) => number[];

}