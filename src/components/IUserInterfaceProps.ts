import { IIndicatorProps } from "./IIndicatorProps";
import { IMapProps } from "./IMapProps";
import { INavigationBotProps } from "./INavigationBotProps";
import { INavigationTopProps } from "./INavigationTopProps";

export interface IUserInterfaceProps {

    /**
     * callback to be triggered when either new data or the path within the data was altered
     */
    onDataPicked: (source: string) => void;

    navigationTopProps: INavigationTopProps;

    indicatorProps: IIndicatorProps[];

    navigationBotProps: INavigationBotProps; 

}