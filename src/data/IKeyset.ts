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
    size(): number;

    /**
     * return the default key for this keyset
     * for i.e. the index keyset this may not be the first key
     */
    getDefaultKey(): string;

    /**
     * get the keys that this instance holds
     */
    getKeys(): string[];

    /**
     * get the value for a given key
     * @param key
     */
    getValue(key: string): string;

    /**
     * get a sub-keyset (if any) for the given key
     * @param key 
     */
    getSubset(key: string): IKeyset;

    /**
     * check if this keyset provides subsets
     */
    hasSubset(key: string): boolean;

}