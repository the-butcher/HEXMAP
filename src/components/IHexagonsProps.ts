import { IColor } from "../util/IColor";
import { IHexagonValues } from "./IHexagonValues";

export interface IHexagonsProps {

    onHover: (hovered) => void;

    stamp: string;

    getHeight: (values: IHexagonValues) => number;

    getColor: (values: IHexagonValues) => IColor;

}