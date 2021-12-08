export interface IDateSliderComponentProps {

    /**
     * the initial instant that the slider shall display
     */
    instantCur: number;

    instantMin: number;
    
    instantMax: number;

    /**
     * callback function to be fired when the value of the slider changes
     */
    onValueChange: (instant: number) => void;

}