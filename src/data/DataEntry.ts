import { IDataEntry } from "./IDataEntry";
import { IDataValue } from "./IDataValue";

export class DataEntry implements IDataEntry {

    private readonly instant: number;
    private readonly dataRaw: { [K in string]: IDataValue[] };
    private readonly keys: string[];

    constructor(instant: number, dataRaw: { [K in string]: IDataValue[] }) {
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

    getValue(key: string | number, index: number): IDataValue {
        return this.dataRaw[key][index];
    }


    addValue(key: string, value: IDataValue): void {
        this.dataRaw[key].push(value);
    }

}