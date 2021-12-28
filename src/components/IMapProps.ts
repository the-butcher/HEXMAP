import { IControlsProps } from "./IControlsProps";
import { IChart3DProps } from "./IChart3DProps";
import { IHexagonsProps } from "./IHexagonsProps";
import { ILabelProps } from "./ILabelProps";
import { ILightProps } from "./ILightProps";
import { ILegendProps } from "./ILegendProps";

/**
 * definition of properties for the MapComponent
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export interface IMapProps {

    // selected,

    lightProps: ILightProps[];

    controlsProps: IControlsProps;

    hexagonProps: IHexagonsProps;

    labelProps: ILabelProps[];

    legendLabelProps: ILegendProps,

    chart3DProps: IChart3DProps[];

}