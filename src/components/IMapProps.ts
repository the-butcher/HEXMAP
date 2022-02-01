import { IControlsProps } from "./IControlsProps";
import { IHexagonsProps } from "./IHexagonsProps";
import { IHyperlinkProps } from "./IHyperlinkProps";
import { ILabelProps } from "./ILabelProps";
import { ILegendProps } from "./ILegendProps";
import { ILightProps } from "./ILightProps";

/**
 * definition of properties for the MapComponent
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export interface IMapProps {

    lightProps: ILightProps[];

    controlsProps: IControlsProps;

    hexagonProps: IHexagonsProps;

    labelProps: ILabelProps[];

    legendLabelProps: ILegendProps,

    courseLabelProps: ILegendProps,

    hyperlinkProps: IHyperlinkProps[],

}