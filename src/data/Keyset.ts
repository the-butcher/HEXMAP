import { IKeyset } from "./IKeyset";

export class Keyset implements IKeyset {

    private readonly defaultKey: string;
    private readonly keysetRaw: { [K in string]: string};
    private readonly keys: string[];

    constructor(defaultKey: string, keysetRaw: { [K in string]: string}) {
        this.defaultKey = defaultKey;
        this.keysetRaw = keysetRaw;
        this.keys = Object.keys(keysetRaw).sort();
    }

    getSize(): number {
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