import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";

/**
 * definition for state in the chart-component
 * 
 * @author/ h.fleischer
 * @since 06.01.2021
. */
export class IChartState {

    root: am5.Root;

    /**
     * the chart itself
     */
    chart: am5xy.XYChart;

    legend: am5.Legend;

    cursor: am5xy.XYCursor;

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

    exporting: am5exporting.Exporting;

}