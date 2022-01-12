import { IDataset } from "./IDataset";

/**
 * definition for types that hold the current user settings for a given dataset
 * 
 * @author h.fleischer
 * @since 30.12.2012
 */
export interface IDataSetting {

    /**
     * get the underlying dataset
     */
    getDataset(): IDataset;

    /**
     * the current data-index
     */
    getIndex(): number;

    /**
     * set the data index for this setting
     * @param index 
     */
    setIndex(index: number): void;

    /**
     * the current data-path
     */
    getPath(name: string): string;

    /**
     * set a specific part of this settings path
     * @param key 
     * @param value 
     */
    setPath(key: string, value: string): void;

    /**
     * the current data instant
     */
    getInstant(): number;

    // getInstantMin(): number;

    // getInstantMax(): number;

    /**
     * set the instant for this setting
     */
    setInstant(instant: number): void;

    // setInstantMin(instantMin: number): void;

    // setInstantMax(instantMax: number): void;

}