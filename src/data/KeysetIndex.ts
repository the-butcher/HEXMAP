import ChartComponent, { SERIES_TYPE } from "../components/ChartComponent";
import { DataRepository } from "./DataRepository";
import { IKeyset } from "./IKeyset";
import { ISeriesStyle } from "./ISeriesStyle";

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

    getSeriesStyle(key: number): ISeriesStyle {
        if (this.keysetRaw[key] === 'xlo') {
            return {
                type: 'step',
                color: 0xd6781f,
                fill: 0xd6781f,
                strokeWidth: 1,
                fillOpacity: 0.0,
                // strokeDasharray: [1, 2],
                stacked: false
            };
        } else if (this.keysetRaw[key] === 'xhi') {
            return {
                type: 'step',
                color: 0xd6781f,
                fill: 0xd6781f,
                strokeWidth: 1,
                fillOpacity: 0.3,
                // strokeDasharray: [1, 2],
                stacked: true
            };
        } else if (this.keysetRaw[key] === DataRepository.FAELLE) {
            return {
                type: 'step',
                color: 0xc1c1aa,
                fill: 0xc1c1aa,
                strokeWidth: 1,
                fillOpacity: 0.0,
                stacked: false
            };
        } else if (this.keysetRaw[key] === 'avg') {
            return {
                type: 'line',
                color: 0xc1c1aa,
                fill: 0xc1c1aa,
                strokeWidth: 1,
                fillOpacity: 0.0,
                stacked: false
            };
        } else if (this.keysetRaw[key] === 'reg') {
            return {
                type: 'line',
                color: 0xd6781f,
                fill: 0xc1c1aa,
                strokeWidth: 1,
                fillOpacity: 0.0,
                strokeDasharray: [1, 2],
                stacked: false
            };
        } else {
            return {
                type: 'line',
                color: 0xc1c1aa,
                fill: 0xc1c1aa,
                strokeWidth: 2,
                fillOpacity: 0.2,
                stacked: false
            };
        }
    }

    // getSeriesType(key: number): SERIES_TYPE {
    //     return this.keysetRaw[key] === DataRepository.FAELLE || this.keysetRaw[key] === 'exp' ? 'step' : 'line';
    // }

    // getSeriesColor(key: number): number {
    //     if (this.keysetRaw[key] === DataRepository.FAELLE) {
    //         return 0xc1c1aa;
    //     } else if (this.keysetRaw[key] === 'exp') {
    //         return 0xff0000;
    //     } else {
    //         return 0xc1c1aa;
    //     }
    // }

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