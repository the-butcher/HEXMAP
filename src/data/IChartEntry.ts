/**
 * definition for types that describe a single entry (date-wise) in the chart
 * 
 * @author h.fleischer
 * @since 03.01.2021
 */
export interface IChartEntry {

    instant: number;

    [K: string]: number | string;

    // value_0?: number;
    // value_1?: number;
    // value_2?: number;

    // label_0?: string;
    // label_1?: string;
    // label_2?: string;

}