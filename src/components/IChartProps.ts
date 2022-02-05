import React from "react";
import { IBreadcrumbProps } from "./IBreadcrumbProps";
import { IndicatorPropsFold } from "./IIndicatorProps";
import { IInstantProps } from "./IInstantProps";

/**
 * properties for configuring a single chart
 * 
 * @author
 * @since 03.02.2022
 */
export interface IChartProps extends IInstantProps {

    /**
     * unique id that should not change over time
     */
    id: string;

    name: string;

    desc: string;

    copy: string;

    /**
     * path pointing into the dataset
     */
    path: string;

    breadcrumbProps: IBreadcrumbProps[];

    /**
     * the state that the parent component passes to the indicator
     */
    fold: IndicatorPropsFold;

    /**
     * callback to be triggered when an instant change is requested
     */
    onInstantChange: (instant: number) => void;

    /**
     * callback to be triggered when an the instant range changes
     */
    onInstantRangeChange: (instantMin: number, instantMax: number) => void;

    seriesVisibilities: { [K in string]: boolean };

    onSeriesVisibilityChange: (name: string, visibility: boolean) => void;

    /**
     * if set to true the chart shall trigger an export directly after being fully rendered
     */
    doExport: boolean;

    /**
     * is the chart to be shown logarithmic
     */
    logarithmic: boolean;

    onLogarithmicChange: (logarithmic: boolean) => void;

    style?: React.CSSProperties;

}