import { IControlsProps } from "./IControlsProps";
import { IHexagonsProps } from "./IHexagonsProps";
import { ILabelProps } from "./ILabelProps";
import { ILightProps } from "./ILightProps";

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

}