import { IColor } from "../util/IColor";
import { IHexagonValues } from "./IHexagonValues";

export interface IHexagonsProps {

    id: string;

    // getSchedule: () => IHexagonRendererSchedule;

    getHeight: (values: IHexagonValues) => number;

    getColor: (values: IHexagonValues) => IColor;

}