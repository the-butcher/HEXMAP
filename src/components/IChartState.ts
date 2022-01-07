import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

/**
 * definition for state in the chart-component
 * 
 * @author/ h.fleischer
 * @since 06.01.2021
. */
export class IChartState {

    /**
     * the chart itself
     */
    chart: am5xy.XYChart;

    /**
     * the series in the chart
     */
    series: am5xy.LineSeries[];

    /**
     * the renderers of the respective axes
     */
    xAxisVal: am5xy.DateAxis<am5xy.AxisRendererX>;
    yAxisVal: am5xy.ValueAxis<am5xy.AxisRendererY>;

    /**
     * label of the respective axes
     */
    xAxisLabel: am5.Label;
    yAxisLabel: am5.Label;

}