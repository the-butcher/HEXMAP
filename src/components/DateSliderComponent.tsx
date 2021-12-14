import { Slider } from "@mui/material";
import { useState } from "react";
import { ObjectUtil } from "../util/ObjectUtil";
import { TimeUtil } from "../util/TimeUtil";
import { IInstantProps } from "./IInstantProps";

/**
 * functional react component holding a matertial-ui slider
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: IInstantProps) => {

    const [key, setKey] = useState<string>(ObjectUtil.createId())

    const { onInstantChange, source } = props;

    const [to, setTo] = useState<number>();

    /**
     * triggered from the slider, calling the callback specified in props
     * @param event 
     * @param value 
     */
    const handleInstantChange = (event: React.SyntheticEvent | Event, value: number | Array<number>) => {
        window.requestAnimationFrame(() => {
            onInstantChange(source, value as number);
        });
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