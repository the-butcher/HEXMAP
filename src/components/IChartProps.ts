import React from "react";
import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { IBreadcrumbProps } from "./IBreadcrumbProps";
import { INDICATOR_PROPS_FOLD } from "./IIndicatorProps";
import { IInstantProps } from "./IInstantProps";

export interface IChartProps extends IInstantProps {

    id: string;

    name: string;

    desc: string;

    valueFormatter: IFormattingDefinition;

    path: string;

    breadcrumbProps: IBreadcrumbProps[];

    /**
     * the state that the parent component passes to the indicator
     */
    fold: INDICATOR_PROPS_FOLD;

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

    logarithmic: boolean;

    onLogarithmicChange: (logarithmic: boolean) => void;

    style?: React.CSSProperties;

}