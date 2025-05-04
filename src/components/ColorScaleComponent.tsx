import { JSX, useEffect, useState } from "react";
import { IColorScale } from "../util/IColorScale";


function ColorScaleComponent(props: IColorScale) {

    const { sampleRange, legendRange, toRgbaLegend } = { ...props };

    const [items, setItems] = useState<JSX.Element[]>([]);

    useEffect(() => {

        console.debug('⚙ updating color scale component (ampleRange, legendRange, toRgbaLegend)', sampleRange, legendRange, toRgbaLegend);

        const _items: JSX.Element[] = [];
        const minSample = sampleRange.min;
        const maxSample = sampleRange.max;
        const cntSample = 50;
        const stpSample = (maxSample - minSample) / cntSample;
        for (let sample = minSample; sample <= maxSample; sample += stpSample) {
            const rgba = toRgbaLegend(sample);
            const backgroundColor = `rgba(${rgba[0] * 255}, ${rgba[1] * 255}, ${rgba[2] * 255}, ${rgba[3]})`;
            console.log('backgroundColor', backgroundColor);
            _items.push(
                <div
                    style={{
                        backgroundColor: backgroundColor,
                        width: '0.3vw',
                        height: '1.05vw'
                    }}
                ></div>
            )
        }
        setItems(_items);

    }, [sampleRange, legendRange, toRgbaLegend]);

    return (

        <>
            <div
                style={{
                    paddingLeft: '1vw',
                    paddingRight: '0.2vw'
                }}
            >{legendRange.min}</div>
            {items}
            <div
                style={{
                    paddingLeft: '0.2vw'
                }}
            >{legendRange.max}</div>
        </>


    );

}

export default ColorScaleComponent;