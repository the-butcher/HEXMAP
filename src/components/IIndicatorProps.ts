import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { IInterpolatedValue } from "../util/IInterpolatedValue";
import { IBreadcrumbProps } from "./IBreadcrumbProps";
import { IChartProps } from "./IChartProps";

export type INDICATOR_PROPS_FOLD = 'closed' | 'open-horizontal' | 'open-vertical';

export interface IIndicatorProps {

    date: string;
 
    name: string;

    desc: string;

    value00: string;

    value07: string;

    valueFormatter: IFormattingDefinition;

    /**
     * the state that the parent component passes to the indicator
     */
    fold: INDICATOR_PROPS_FOLD

    /**
     * callback to be triggered when an indicator wants to open horizontally
     */
    onExpand: (id: string) => void;

    /**
     * points to the data, retrievable from DataRepository
     */
    source: string;

    /**
     * flag indicating if the given source has already been loaded
     */
    loaded: boolean;

    path: string;  

    /**
     * properties for the chart unfoldable from the indicator
     */
    chartProps: IChartProps;

    breadcrumbProps: IBreadcrumbProps[];

    interpolatedHue: IInterpolatedValue;
    interpolatedSat: IInterpolatedValue;
    interpolatedVal: IInterpolatedValue;
     
    interpolatedEle: IInterpolatedValue;

    style?: React.CSSProperties;

}