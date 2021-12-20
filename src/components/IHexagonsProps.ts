import { IColor } from "../util/IColor";
import { IHexagon } from "./IHexagon";

export interface IHexagonsProps {

    source: string;

    name: string;

    keys: string[];

    path: string;

    stamp: string;

    onPathChange: (source: string, name: string, path: string) => void;

    getHeight: (values: IHexagon) => number;

    getColor: (values: IHexagon) => IColor;

    /**
     * get the currently used portion of the gkz number 
     */
    getPath: (values: IHexagon) => string;

}