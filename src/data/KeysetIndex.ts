import { IKeyset } from "./IKeyset";
import { ISeriesStyle } from "./ISeriesStyle";
import { SeriesStyle } from "./SeriesStyle";


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
        return this.keys; // [this.keys[0]];
    }

    getSeriesStyle(key: number): ISeriesStyle {
        const predefinedStyle = SeriesStyle.PREDFINED_STYLE[this.keysetRaw[key]]
        if (predefinedStyle) {
            return predefinedStyle;
        } else {
            return SeriesStyle.SERIES_STYLE____DEFAULT;
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