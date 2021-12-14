import { IBreadcrumbProps } from "./IBreadcrumbProps";

export interface IIndicatorProps {

    id: string; 

    /**
     * flag that can be listened to in i.e. useEffect method
     */
    stamp: string;

    title: string;

    value: string;

    /**
     * the state that the parent component passes to the indicator
     */
    state: 'closed' | 'open-horizontal' | 'open-vertical'

    /**
     * callback to be triggered when an indicator wants to open horizontally
     */
    onExpand: (id: string) => void;

    /**
     * points to the data, retrievable from DataRepository
     */
    source: string;

    breadcrumbProps: IBreadcrumbProps[];


}