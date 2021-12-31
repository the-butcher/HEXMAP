import { IDataEntry } from "./IDataEntry";
import { IKeyset } from "./IKeyset";

export interface IDataset {

    getEntryByInstant(instant: number): IDataEntry;

    getEntryByDate(date: string): IDataEntry;

    getIndexKeyset(): IKeyset;

    /**
     * get the keys that this dataset holds, i.e. ['Bundesland', 'Altersgruppe']
     * each key will have a subset of values
     */
    getKeysetKeys(): string[];

    /**
     * get the keys that a single entry in this dataset may have
     * effectively this list is a multiplication of all possible values resulting from different keysets
     */
    getEntryKeys(): string[];

    /**
     * get the keyset held by a given key
     * @param key 
     */
    getKeyset(key: string): IKeyset; 

    /**
     * get an instant known to exist in this dataset
     * @param instant 
     */
    getValidInstant(instant: number): number;

    /**
     * get the last valid instant for this data
     */
    getLastInstant(): number;

    getMinY(): number;

    getMaxY(): number;

}