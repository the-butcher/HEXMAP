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
     * properties for the app-bar (area-picking)
     */
    navigationTopProps: INavigationTopProps;

    /**
     * properties for the indicator area
     */
    indicatorProps: IIndicatorProps[];

    /**
     * properties for the bottom-bar (date-picking)
     */
    navigationBotProps: INavigationBotProps; 

}