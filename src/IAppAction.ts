import { IHexagon } from "./components/IHexagon";

export interface IAppAction {

    hexagon?: IHexagon;

    stamp: string;

    updateScene: boolean;

    updateLight: boolean;

}