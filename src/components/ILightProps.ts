/**
 * definition for properties defining a light in the scene
 * 
 * @author h.fleischer
 * @since 06.01.2022 
 */
export interface ILightProps {
    id: string;
    stamp: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    intensity: number;
    shadowEnabled: boolean;
}