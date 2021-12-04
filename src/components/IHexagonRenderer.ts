import { IHexagonValues } from "./IHexagonValues";

export interface IHexagonRendererSchedule {
    instantA: number,
    instantB: number
}

export interface IHexagonRenderer {

    getSchedule: () => IHexagonRendererSchedule;

    getHeight: (values: IHexagonValues) => number;

    getColor: (values: IHexagonValues, target: number[]) => number[];

}