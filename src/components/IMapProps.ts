import { IControlsProps } from "./IControlsProps";
import { IHexagonsProps } from "./IHexagonsProps";
import { ILightProps } from "./ILightProps";
import { IMetadataProps } from "./IMetadataProps";

/**
 * definition of properties for the MapComponent
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
export interface IMapProps {

    /**
     * for triggering updates to hexagons
     */
    hexagonsStamp: string;

    lightProps: ILightProps[];

    controlsProps: IControlsProps;

    hexagonsProps: IHexagonsProps;

    metadataProps: IMetadataProps;

}