import { SERIES_TYPE } from "../components/ChartComponent";

/**
 * definition for types that hold a set of keys, i.e. referring to specific data
 * 
 * @author h.fleischer
 * @since 01.01.2022
 */
export interface IKeyset {

    /**
     * get the size (the keycount) of this keyset
     */
    getKeyCount(): number;

    /**
     * return the default key for this keyset
     * for i.e. the index keyset this may not be the first key
     */
    getDefaultKey(): string;

    hasKey(key: string | number): boolean;

    /**
     * get the keys that this instance holds
     */
    getKeys(): string[];

    /**
     * get the value for a given key, i.e. for key = '5' return value = 'Salzburg'
     * @param key
     */
    getValue(key: string | number): string;

    /**
     * get a sub-keyset (if any) for the given key
     * @param key 
     */
    getSubset(key: string | number): IKeyset;

    /**
     * check if this keyset provides subsets
     */
    hasSubset(key: string | number): boolean;

    /**
     * get the raw keys of this keyset, root and, if any, subsets
     */
    getRaws(): string[];

    /**
     * get the size (the keycount) of this keyset
     */
    getRawCount(): number;

}