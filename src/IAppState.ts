import { INDICATOR_PROPS_FOLD as INDICATOR_PROPS_HATCH } from "./components/IIndicatorProps";
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

    action: IAppAction;

    fold: INDICATOR_PROPS_HATCH;

}