import ChartComponent, { SERIES_TYPE } from "../components/ChartComponent";
import { DataRepository } from "./DataRepository";
import { IKeyset } from "./IKeyset";

export class KeysetIndex implements IKeyset {

    private readonly defaultKey: string
    private readonly keysetRaw: string[];
    private readonly keys: string[];
    // private readonly raws: string[];

    constructor(defaultKey: number, keysetRaw: string[]) {
        this.defaultKey = defaultKey.toString();
        this.keysetRaw = keysetRaw;
        this.keys = [];
        for (let i = 0; i < keysetRaw.length; i++) {
            this.keys[i] = i.toString();
        }
    }

    getRaws(): string[] {
        return this.keys;
    }

    getBreadcrumbKeys(): string[] {
        return [this.keys[0]];
    }

    getSeriesType(key: number): SERIES_TYPE {
        return this.keysetRaw[key] === DataRepository.FAELLE || this.keysetRaw[key] === 'exp' ? 'step' : 'line';
    }

    getSeriesColor(key: number): number {
        if (this.keysetRaw[key] === DataRepository.FAELLE) {
            return 0xc1c1aa;
        } else if (this.keysetRaw[key] === 'exp') {
            return 0xff0000;
        } else {
            return 0xc1c1aa;
        }
    }

    hasSubset(key: string): boolean {
        return false;
    }

    getSubset(key: string): IKeyset {
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
        return this.keysetRaw[parseInt(key)];
    }

}