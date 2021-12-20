import { IColor } from "../util/IColor";
import { IHexagon } from "./IHexagon";

export interface IHexagonsProps {

    // onHover: (hovered) => void;

    stamp: string;

    getHeight: (values: IHexagon) => number;

    getColor: (values: IHexagon) => IColor;

    /**
     * get the currently used portion of the gkz number 
     */
    getKey: (values: IHexagon) => string;

}