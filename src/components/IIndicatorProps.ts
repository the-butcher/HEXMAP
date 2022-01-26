import { IDataRoot } from "../data/IDataRoot";
import { IDataset } from "../data/IDataset";
import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { IInterpolatedValue } from "../util/IInterpolatedValue";
import { IBreadcrumbProps } from "./IBreadcrumbProps";
import { IChartProps } from "./IChartProps";
import { IRendererProps } from "./IRendererProps";

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

    getRendererProps: (index: number, name: string) => IRendererProps;

    /**
     * let each indicator props instance decide which type of dataset it creates
     * for incidence there is a special type of dataset
     */
    constructDataset: (dataRoot: IDataRoot) => IDataset;

}