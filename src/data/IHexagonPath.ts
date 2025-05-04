import { IHexagon } from "../components/IHexagon";

export interface IHexagonPath {
    /**
     * get the currently used portion of the gkz number
     */
    getPath: (values: IHexagon) => string;
}