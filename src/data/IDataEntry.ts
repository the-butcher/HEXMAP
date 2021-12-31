/**
 * definition for types that hold a single data entry
 * one entry may hold values for multiple provinces, districts, municipalities
 * 
 * @author h.fleischer
 * @since 31.12.2021
 */
export interface IDataEntry {

    /**
     * get the instant that this entry refers to
     */
    getInstant(): number;

    getKeys(): string[];

    hasKey(key: string): boolean;

    getValue(key: string, index: number): number;

}