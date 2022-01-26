export interface IInstantProps {

    /**
     * points to the data, retrievable from DataRepository
     */
    source: string;

    /**
     * the initial instant that the slider shall display
     */
    instant: number;

    instantMin: number;

    instantMax: number;

    /**
     * the increment or decrement that should be applied
     */
    instantDif: number;

    /**
     * callback function to be fired when the value of the slider changes
     */
    onInstantChange: (instant: number) => void;

}