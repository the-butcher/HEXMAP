import { Slider } from "@mui/material";
import { useState } from "react";
import { ObjectUtil } from "../util/ObjectUtil";
import { TimeUtil } from "../util/TimeUtil";
import { IInstantProps } from "./IInstantProps";

export default (props: IInstantProps) => {

    // console.log('slider props', props);

    const [key, setKey] = useState<string>(ObjectUtil.createId())

    const { onInstantChange, source } = props;

    const handleInstantChange = (event: React.SyntheticEvent | Event, value: number | Array<number>) => {
        onInstantChange(source, value as number);
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
        <Slider key={ key } onChange={ handleInstantChange } valueLabelFormat={ formatLabel } size="small"  value={ props.instantCur } min={ props.instantMin } max={ props.instantMax } step={ TimeUtil.MILLISECONDS_PER____DAY } aria-label="Small" valueLabelDisplay="auto" style={{ margin: '10px', marginLeft: '24px' }}/>
    );

}