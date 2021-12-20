import { IColor } from "../util/IColor";
import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { IBreadcrumbProps } from "./IBreadcrumbProps";

export type INDICATOR_PROPS_FOLD = 'closed' | 'open-horizontal' | 'open-vertical';

export interface IIndicatorProps {

    date: string;
 
    /**
     * flag that can be listened to in i.e. useEffect method
     */
    // stamp: string;

    title: string;

    value: string;

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

    path: string;  

    breadcrumbProps: IBreadcrumbProps[];

    getColor: (value: number) => IColor;

}