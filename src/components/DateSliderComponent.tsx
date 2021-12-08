import { Slider } from "@mui/material";
import { ObjectUtil } from "../util/ObjectUtil";
import { TimeUtil } from "../util/TimeUtil";
import { IDateSliderComponentProps } from "./IDateSliderProps";

export default (props: IDateSliderComponentProps) => {

    const { onValueChange } = props;

    const handleValueChange = (event: React.SyntheticEvent | Event, value: number | Array<number>) => {
        onValueChange(value as number);
    }

    /**
     * have slider values (timestamps) formatted to a readable date
     * @param value 
     * @param index 
     * @returns 
     */
    const formatLabel = ((value: number, index: number) => {
        return <div>{ TimeUtil.formatCategoryDateFull(value) }</div>;
    });

    return (
        <Slider key={ ObjectUtil.createId() } onChange={ handleValueChange } valueLabelFormat={ formatLabel } size="small" min={ props.instantMin } max={ props.instantMax } step={ TimeUtil.MILLISECONDS_PER____DAY } defaultValue={ Date.now() } aria-label="Small" valueLabelDisplay="auto" style={{ margin: '10px', marginLeft: '24px' }}/>
    );

}