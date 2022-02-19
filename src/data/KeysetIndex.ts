import { IDataIndex } from "./IDataIndex";
import { IKeyset } from "./IKeyset";
import { ISeriesStyle } from "./ISeriesStyle";
import { SeriesStyle } from "./SeriesStyle";


export class KeysetIndex implements IKeyset {

    private readonly defaultKey: string
    private readonly keysetRaw: string[];
    private readonly keys: string[];
    private readonly raws: string[];

    constructor(defaultKey: number, keysetRaw: IDataIndex[]) {
        this.defaultKey = defaultKey.toString();
        this.keysetRaw = keysetRaw.map(m => m.name);
        this.raws = [];
        this.keys = [];
        for (let i = 0; i < keysetRaw.length; i++) {
            this.raws.push(i.toString());
            if (!keysetRaw[i].isHiddenOption) {
                this.keys.push(i.toString());
            }
        }
    }

    getRaws(): string[] {
        return this.raws;
    }

    getKeys(): string[] {
        return this.keys;
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

    getKeyCount(): number {
        return this.keys.length;
    }

    getRawCount(): number {
        return this.raws.length;
    }

    getDefaultKey(): string {
        return this.defaultKey;
    }

    hasKey(key: string | number): boolean {
        return this.keys[key] !== undefined;
    }

    hasRaw(key: string | number): boolean {
        return this.raws[key] !== undefined;
    }

    getValue(key: string): string {
        return this.keysetRaw[parseInt(key)];
    }

}