import { IColor } from "../util/IColor";
import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { ILabelProps } from "./ILabelProps";

/**
 * definition of properties for a LabelCompomonent
 * 
 * @author h.fleischer
 * @since 28.12.2021
 */
export interface IChart3DProps {
    id: string;
    source: string;
    path: string;
    indx: number;
    instant: number;
    min: {
        x: number;
        y: number;
    };  
    max: {
        x: number;
        y: number;
    };  
    rotationY: number;  
    getColor: (value: number) => IColor;
    valueFormatter: IFormattingDefinition;  
}