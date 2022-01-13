import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { IInterpolatedValue } from "../util/IInterpolatedValue";
import { IBreadcrumbProps } from "./IBreadcrumbProps";
import { IChartProps } from "./IChartProps";

export type INDICATOR_PROPS_FOLD = 'closed' | 'open-horizontal' | 'open-vertical';

export interface IIndicatorProps extends IChartProps {

    value00: string;

    value07: string;

    /**
     * callback to be triggered when an indicator wants to open horizontally
     */
    onExpand: (id: string) => void;

    /**
     * callback to be triggered when an indicator wants to export its chart
     */
    onExport: (id: string) => void;

    /**
     * flag indicating if the given source has already been loaded
     */
    loaded: boolean;

    interpolatedHue: IInterpolatedValue;
    interpolatedSat: IInterpolatedValue;
    interpolatedVal: IInterpolatedValue;

    interpolatedEle: IInterpolatedValue;

    /**
     * light intensity depending on value
     */
    interpolatedInt: IInterpolatedValue;

}