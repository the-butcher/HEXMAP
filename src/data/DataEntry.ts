import { IDataEntry } from "./IDataEntry";

export class DataEntry implements IDataEntry {

    private readonly instant: number;
    private readonly dataRaw: { [K in string]: number[] };
    private readonly keys: string[];

    constructor(instant: number, dataRaw: { [K in string]: number[] }) {
        this.instant = instant;
        this.dataRaw = dataRaw;
        this.keys = Object.keys(this.dataRaw).sort();
    }

    getInstant(): number {
        return this.instant;
    }

    getKeys(): string[] {
        return this.keys;
    }

    hasKey(key: string | number): boolean {
        return this.dataRaw[key] !== undefined;
    }

    getValue(key: string | number, index: number): number {
        return this.dataRaw[key][index];
    }

}