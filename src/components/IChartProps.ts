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
    
    path: string;

    /**
     * the state that the parent component passes to the indicator
     */
    fold: INDICATOR_PROPS_FOLD;

    onInstantChange: (instant: number) => void;

}