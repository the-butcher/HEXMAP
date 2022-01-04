/**
 * definition for types that describe a single entry (date-wise) in the chart
 * 
 * @author h.fleischer
 * @since 03.01.2021
 */
export interface IChartEntry {

    instant: number;

    value_0?: number;
    value_1?: number;
    value_2?: number;

    label_0?: number;
    label_1?: number;
    label_2?: number;

}