/**
 * definition of properties for a LabelCompomonent
 * TODO :: positioning, conditional recreation, ...
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
}