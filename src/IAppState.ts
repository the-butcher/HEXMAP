import { INDICATOR_PROPS_STATE as INDICATOR_PROPS_HATCH } from "./components/IIndicatorProps";
import { IAppAction } from "./IAppAction";

export interface IAppState {

    /**
     * refer to the currently displayed datasource
     */
    source: string;

    /**
     * refer to the currently display time
     */
    instant: number;

    /**
     * a synthetic variable usable to force a state update
     */
    action: IAppAction;

    hatch: INDICATOR_PROPS_HATCH;

    // userInterfaceProps: IUserInterfaceProps;

    // mapProps: IMapProps;

}