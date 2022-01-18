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

    // /**
    //  * get the type of series suitable to display this index' data
    //  */
    // getSeriesType(key: number): SERIES_TYPE;


    // getSeriesColor(key: number): number;

    getSeriesStyle(key: number): ISeriesStyle;


    getBreadcrumbKeys(): string[];

}