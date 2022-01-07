/**
 * definition of properties for the ControlsCompoment
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export interface IControlsProps {
    id: string;
    stamp: string;
    instant: number;
    onInstantChange: (instant: number) => void;
} 