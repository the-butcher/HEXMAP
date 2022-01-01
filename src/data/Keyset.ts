import { IKeyset } from "./IKeyset";

export class Keyset implements IKeyset {

    private readonly keysetKey: string;
    private readonly defaultKey: string;
    private readonly keysetRaw: { [K in string]: string};
    private readonly keys: string[];

    private readonly hasSubsets: boolean;
    private readonly subsets: { [K in string]: IKeyset };

    constructor(keysetKey: string, defaultKey: string, keysetRaw: { [K in string]: string}) {

        this.keysetKey = keysetKey;
        this.defaultKey = defaultKey;
        this.keysetRaw = keysetRaw;
        this.subsets = {};

        const _keys = Object.keys(keysetRaw).sort();
        const categoryKeys = _keys.filter(k => k.indexOf('#') >= 0);
        this.hasSubsets = categoryKeys.length > 1;
        if (this.hasSubsets) {
            this.keys = categoryKeys;
        } else {
            this.keys = _keys;
        }

    }

    hasSubset(key: string): boolean {
        return this.hasSubsets && this.getSubset(key) !== undefined;
    }

    getSubset(key: string): IKeyset {
        const keyTrimmed = key.replaceAll('#', '');
        // subsets allowed, not root but another category
        if (this.hasSubsets && keyTrimmed.length > 0 && keyTrimmed.length != key.length) {
            if (!this.subsets[key]) {

                const keyTrimmed = key.replaceAll('#', '');
                const _keys = Object.keys(this.keysetRaw).sort();
                const subkeys = _keys.filter(k => k.indexOf('#') == -1 && k.startsWith(keyTrimmed)).sort();
                const subsetRaw: { [K in string]: string} = {};

                subsetRaw[key] = 'alle Einträge';
                subkeys.forEach(subkey => {
                    subsetRaw[subkey] = this.keysetRaw[subkey];
                });
                
                this.subsets[key] = new Keyset(this.keysetKey, subkeys[0], subsetRaw);
                // console.log('subset', this.subsets[key]);
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

    getKeys(): string[] {
        return this.keys;
    }

    getValue(key: string): string {
        return this.keysetRaw[key];
    }

}