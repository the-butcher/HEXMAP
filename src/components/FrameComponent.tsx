import ColorScaleComponent from "./ColorScaleComponent";
import { IMapProps } from "./IMapProps";


function FrameComponent(props: IMapProps) {

    const { metadataProps } = { ...props };

    return (

        <div
            style={{
                position: 'absolute',
                left: '4vw',
                right: '4vw',
                top: '4vw',
                bottom: '4vw',
                pointerEvents: 'none',
                color: 'var(--color-text)',
                border: '1px solid var(--color-text)',
                fontFamily: 'var(--font-text)'

            }}
        >
            <div
                style={{
                    position: 'absolute',
                    left: '1vw',
                    top: '0.3vw',
                    fontSize: '3.6vw'
                }}
            >
                Austria
            </div>
            <div
                style={{
                    position: 'absolute',
                    left: '1.2vw',
                    top: '4.0vw',
                    fontSize: '1.2vw',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                {metadataProps.title}
                {
                    metadataProps.colorScale ? <ColorScaleComponent {...metadataProps.colorScale} /> : null
                }
            </div>

            <div
                style={{
                    position: 'absolute',
                    left: '1vw',
                    bottom: '-0.2vw',
                    fontSize: '0.8vw'
                }}
            >
                <pre>{metadataProps.source}</pre>
            </div>
            <div
                style={{
                    position: 'absolute',
                    right: '1vw',
                    bottom: '-0.2vw',
                    fontSize: '0.8vw',
                    whiteSpace: 'pre-wrap'
                }}
            >
                <pre>@FleischerHannes</pre>
            </div>

        </div >

    );

}

export default FrameComponent;