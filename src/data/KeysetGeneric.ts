import ChartComponent, { SERIES_TYPE } from "../components/ChartComponent";
import { DataRepository } from "./DataRepository";
import { IKeyset } from "./IKeyset";

export class KeysetGeneric implements IKeyset {

    private readonly defaultKey: string;
    private readonly keysetKey: string;
    private readonly keysetRaw: { [K in string]: string };
    private readonly keys: string[];
    private readonly raws: string[];

    private readonly hasSubsets: boolean;
    private readonly subsets: { [K in string]: IKeyset };

    constructor(keysetKey: string, defaultKey: string, keysetRaw: { [K in string]: string }) {

        this.keysetKey = keysetKey;
        this.defaultKey = defaultKey;
        this.keysetRaw = keysetRaw;
        this.subsets = {};

        this.raws = Object.keys(keysetRaw).sort();
        const categoryKeys = this.raws.filter(k => k.indexOf('#') >= 0);
        this.hasSubsets = categoryKeys.length > 1;
        if (this.hasSubsets) {
            this.keys = categoryKeys;
        } else {
            this.keys = this.raws;
        }

    }

    getRaws(): string[] {
        return this.raws;
    }

    hasSubset(key: string): boolean {
        return this.hasSubsets && this.getSubset(key) !== undefined;
    }

    getSubset(key: string): IKeyset {

        const keyTrimmed = key.replaceAll('#', '');

        // subsets allowed, not root but another category 
        if (this.hasSubsets && keyTrimmed.length > 0 && keyTrimmed.length != key.length) {
            if (!this.subsets[key]) {

                const _keys = Object.keys(this.keysetRaw).sort();
                const subkeys = _keys.filter(k => k !== key && k.startsWith(keyTrimmed)).sort(); // k => k.indexOf('#') == -1 && 
                const subsetRaw: { [K in string]: string } = {};

                if (subkeys.length > 0) {
                    subsetRaw[key] = 'alle Einträge';
                    subkeys.forEach(subkey => {
                        subsetRaw[subkey] = this.keysetRaw[subkey];
                    });
                    this.subsets[key] = new KeysetGeneric(this.keysetKey, subkeys[0], subsetRaw);
                }
            }
            return this.subsets[key];
        }
        return undefined;

    }

    size(): number {
        return this.keys.length;
    }

    getDefaultKey(): string {
        return this.defaultKey;
    }

    hasKey(key: string | number): boolean {
        return this.keysetRaw[key] !== undefined;
    }

    getKeys(): string[] {
        return this.keys;
    }

    getValue(key: string): string {
        return this.keysetRaw[key];
    }

}