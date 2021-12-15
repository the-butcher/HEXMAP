import { IColor } from "../util/IColor";
import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { IBreadcrumbProps } from "./IBreadcrumbProps";

export type INDICATOR_PROPS_STATE = 'closed' | 'open-horizontal' | 'open-vertical';

export interface IIndicatorProps {

    // id: string; 

    date: string;
 
    /**
     * flag that can be listened to in i.e. useEffect method
     */
    stamp: string;

    title: string;

    value: string;

    valueFormatter: IFormattingDefinition;

    /**
     * the state that the parent component passes to the indicator
     */
    state: INDICATOR_PROPS_STATE

    /**
     * callback to be triggered when an indicator wants to open horizontally
     */
    onExpand: (id: string) => void;

    /**
     * points to the data, retrievable from DataRepository
     */
    source: string;

    breadcrumbProps: IBreadcrumbProps[];

    getColor: (value: number) => IColor;

}