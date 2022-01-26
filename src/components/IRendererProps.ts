import { IInterpolatedValue } from "../util/IInterpolatedValue";

export interface IRendererProps {

    interpolatedHue: IInterpolatedValue;
    interpolatedSat: IInterpolatedValue;
    interpolatedVal: IInterpolatedValue;
    interpolatedEle: IInterpolatedValue;
    interpolatedInt: IInterpolatedValue; // light intensity

}