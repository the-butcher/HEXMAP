import { IHexagon } from "./IHexagon";
import { IHexagonState } from "./IHexagonState";

export type ViewOrientation = 'northwards' | 'southwards';

/**
 * definition of the hexagon-component properties
 * 
 * @author h.fleischer
 * @since 05.02.2022
 */
export interface IHexagonsProps {

    source: string;

    name: string;

    keys: string[];

    path: string;

    stamp: string;

    frac: number;

    view: ViewOrientation;

    onPathChange: (source: string, name: string, path: string) => void;

    onHexagonsLoaded: () => void;

    getState: (hexagon: IHexagon) => IHexagonState;

    /**
     * get the currently used portion of the gkz number 
     */
    getPath: (values: IHexagon) => string;

}