import { SERIES_TYPE } from "../components/ChartComponent";
import { IKeyset } from "./IKeyset";
import { ISeriesStyle } from "./ISeriesStyle";

/**
 * definition for types that hold a set of keys, i.e. referring to specific data
 * 
 * @author h.fleischer
 * @since 01.01.2022
 */
export interface IKeysetIndex extends IKeyset {

    getSeriesStyle(key: number): ISeriesStyle;

}