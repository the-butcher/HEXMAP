import { IColor } from "../util/IColor";

export interface IHexagonState {

    color: IColor;

    /**
     * outline color
     */
    col_o: IColor;

    /**
     * hilight color
     */
    col_h: IColor;
    height: number;

}