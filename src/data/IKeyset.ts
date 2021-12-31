export interface IKeyset {

    /**
     * get the size (the keycount) of this keyset
     */
    getSize(): number;

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

}