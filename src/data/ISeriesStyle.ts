import { SERIES_TYPE } from "../components/ChartComponent";

export interface ISeriesStyle {

    type: SERIES_TYPE;

    color: number;

    fill: number;

    strokeWidth: number;

    stacked: boolean;

    strokeDasharray?: number[];

    fillOpacity: number;

    strokeOpacity: number;

}