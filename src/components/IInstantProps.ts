export interface IInstantProps {

    source: string;

    /**
     * the initial instant that the slider shall display
     */
    instantCur: number;

    instantMin: number;
    
    instantMax: number;

    /**
     * callback function to be fired when the value of the slider changes
     */
    onInstantChange: (source: string, instant: number) => void;

}