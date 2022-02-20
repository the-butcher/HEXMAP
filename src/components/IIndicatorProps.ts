import { IDataRoot } from "../data/IDataRoot";
import { IDataset } from "../data/IDataset";
import { IChartProps } from "./IChartProps";
import { IRendererProps } from "./IRendererProps";

export type IndicatorPropsFold = 'closed' | 'open-horizontal' | 'open-vertical';

/**
 * configuration for a single indicator instance
 * 
 * @author h.fleischer
 * @since 03.02.2022
 */
export interface IIndicatorProps extends IChartProps {

    thema: string;

    /**
     * current value
     */
    label00: string;

    /**
     * label indicatinf the weekly change
     */
    label07: string;



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

    /**
     * get an instance 
     */
    getRendererProps: (index: number, name: string) => IRendererProps;

    /**
     * let each indicator props instance decide which type of dataset it creates
     * for incidence there is a special type of dataset
     */
    constructDataset: (dataRoot: IDataRoot) => IDataset;

}