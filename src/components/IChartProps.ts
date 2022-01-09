import React from "react";
import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { IBreadcrumbProps } from "./IBreadcrumbProps";
import { INDICATOR_PROPS_FOLD } from "./IIndicatorProps";

export interface IChartProps {

    id: string;

    date: string;

    name: string;

    desc: string;

    valueFormatter: IFormattingDefinition;

    /**
     * points to the data, retrievable from DataRepository
     */
    source: string;
    
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


    doExport: boolean;


    style?: React.CSSProperties;

}