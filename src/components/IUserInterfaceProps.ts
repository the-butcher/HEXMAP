import { IExportSceneProps } from "./IExportSceneProps";
import { IIndicatorProps } from "./IIndicatorProps";
import { IMapProps } from "./IMapProps";
import { INavigationBotProps } from "./INavigationBotProps";
import { INavigationTopProps } from "./INavigationTopProps";

/**
 * definition of properties for the UserInterfaceComponent
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
export interface IUserInterfaceProps {

    /**
     * callback to be triggered when either new data or the path within the data was altered
     */
    onDataPicked: (source: string) => void;

    /**
     * callback to be triggered when a thematic (incidence | vaccination | hospitalization) is requested
     */
    onThemaChange: (thema: string) => void;

    /**
     * properties for the indicator area
     */
    indicatorProps: IIndicatorProps[];

    /**
     * properties for the bottom-bar (date-picking)
     */
    navigationBotProps: INavigationBotProps;

    /**
     * properties for the export-scene component
     */
    exportSceneProps: IExportSceneProps;

}