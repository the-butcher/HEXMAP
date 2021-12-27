import React from "react";
import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { INDICATOR_PROPS_FOLD } from "./IIndicatorProps";

export interface IChartProps {

    style?: React.CSSProperties;

    valueFormatter: IFormattingDefinition;

    title: string;

    /**
     * points to the data, retrievable from DataRepository
     */
    source: string;

    /**
     * the state that the parent component passes to the indicator
     */
    fold: INDICATOR_PROPS_FOLD;

    path: string;

    // interpolatedHue: InterpolatedValue;

    // interpolatedEle: InterpolatedValue;

    onInstantChange: (instant: number) => void;

}