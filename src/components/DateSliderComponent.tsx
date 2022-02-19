import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { IconButton, Slider, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
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

    const [key, setKey] = useState<string>(ObjectUtil.createId());

    const { source, instant, instantMin, instantMax, instantDif, onInstantChange } = props;

    const [incrementableInstant, setIncrementableInstant] = useState<number>(instant);
    const handleInstantDecr = useRef<() => void>(() => {
        // no op initially 
    });
    const handleInstantIncr = useRef<() => void>(() => {
        // no op initially 
    });

    const minDate = new Date(props.instantMin); // 2020
    const maxDate = new Date(props.instantMax); // 2020
    const marks: any[] = [];

    for (let y = minDate.getFullYear(); y <= maxDate.getFullYear(); y++) {
        for (let q = 0; q < 4; q++) {
            const date = new Date(y, q * 3, 1);
            if (date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime()) {
                marks.push({
                    value: date.getTime(),
                    label: TimeUtil.formatCategoryDateFull(date.getTime())
                });
            }
        }
    }

    useEffect(() => {

        console.debug('✨ building date slider component', props);

        window.addEventListener('keyup', e => {

            if (e.key === 'ArrowLeft') {
                // console.log('!!! key change', e);
                e.stopPropagation();
                handleInstantDecr.current();
            } else if (e.key === 'ArrowRight') {
                e.stopPropagation();
                handleInstantIncr.current();
            }

        });

    }, []);


    useEffect(() => {

        console.debug('⚙ updating date slider component (instant)', props);
        handleInstantDecr.current = () => {
            onInstantChange(instant - props.instantDif);
        }
        handleInstantIncr.current = () => {
            onInstantChange(instant + props.instantDif);
        }

    }, [source, instant, instantMin, instantMax, instantDif]);

    /**
     * triggered from the slider, calling the callback specified in props
     * @param event 
     * @param value 
     */
    const handleInstantChange = (event: React.SyntheticEvent | Event, value: number | Array<number>) => {
        onInstantChange(value as number);
    }

    /**
     * have slider values (timestamps) formatted to a readable date 
     * @param value 
     * @param index 
     * @returns 
     */
    const formatLabel = ((value: number, index: number) => {
        return <div>{TimeUtil.formatCategoryDateFull(value)}</div>;
    });

    /**
     * stop standard left-right keys from interfering with our manual left-right handlers
     */
    const handleKeyUp = (e) => {
        e.stopPropagation();
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '100' }}>
            <Tooltip title="Vorheriger Tag [<]">
                <span>
                    <IconButton onClick={handleInstantDecr.current} style={{ width: '30px', height: '28px', marginTop: '6px' }} disabled={instant <= instantMin} >
                        <KeyboardArrowLeft style={{ width: '21px', height: '21px', color: 'var(--color-text)' }} />
                    </IconButton>
                </span>
            </Tooltip>
            <Slider onKeyUp={handleKeyUp} key={key} marks={marks} onChange={handleInstantChange} valueLabelFormat={formatLabel} size="small" value={props.instant} min={props.instantMin} max={props.instantMax} step={TimeUtil.MILLISECONDS_PER____DAY} aria-label="Small" valueLabelDisplay="auto" style={{ margin: '10px 6px' }} />
            <Tooltip title="Nächster Tag [>]">
                <span>
                    <IconButton onClick={handleInstantIncr.current} style={{ width: '30px', height: '28px', marginTop: '6px' }} disabled={instant >= instantMax}>
                        <KeyboardArrowRight style={{ width: '21px', height: '21px', color: 'var(--color-text)' }} />
                    </IconButton>
                </span>
            </Tooltip>
        </div>
    );

}