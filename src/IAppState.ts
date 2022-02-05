import { ViewOrientation } from "./components/IHexagonsProps";
import { IndicatorPropsFold } from "./components/IIndicatorProps";
import { IAppAction } from "./IAppAction";

export interface IAppState {

    /**
     * refer to the currently displayed datasource
     */
    source: string;

    action: IAppAction;

    fold: IndicatorPropsFold;

    view: ViewOrientation;

}