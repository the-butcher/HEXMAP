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
     * try to find a match for this path regarding the available data
     * i.e. a path of '50212' (municipality) may be altered to '502##' (district) as best match
     * @param key 
     * @param value 
     */
    validatePath(key: string, value: string): string;

    /**
     * the current data instant
     */
    getInstant(): number;

    /**
     * set the instant for this setting
     */
    setInstant(instant: number): void;

}