
export interface IIndicatorProps {

    id: string; 

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

    source: string;


}