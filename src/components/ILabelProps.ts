/**
 * definition of properties for a LabelCompomonent
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export interface ILabelProps {
    id: string;
    label: string;
    size: number;
    position: {
        x: number;
        y: number;
        z: number;
    };  
    rotationY: number;  
}