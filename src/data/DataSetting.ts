import { IDataset } from "./IDataset";
import { IDataSetting } from "./IDataSetting";

export class DataSetting implements IDataSetting {

    private readonly dataSet: IDataset;
    private index: number;
    private instant: number;
    // private instantMin: number;
    // private instantMax: number;
    private path: { [K in string]: string };

    constructor(dataSet: IDataset) {

        this.dataSet = dataSet;
        this.index = parseInt(dataSet.getIndexKeyset().getDefaultKey());
        this.instant = dataSet.getInstantMax();
        // this.instantMin = dataSet.getInstantMin();
        // this.instantMax = dataSet.getInstantMax();
        this.path = {};
        dataSet.getKeysetKeys().forEach(keysetKey => {
            this.path[keysetKey] = dataSet.getKeyset(keysetKey).getDefaultKey();
        });

    }

    getPath(keysetKey: string): string {
        return this.path[keysetKey];
    }

    getDataset(): IDataset {
        return this.dataSet;
    }

    setIndex(index: number): void {
        this.index = index;
    }

    getIndex(): number {
        return this.index;
    }

    setPath(key: string, value: string): void {
        this.path[key] = value;
    }

    getInstant(): number {
        return this.instant;
    }

    setInstant(instant: number): void {
        this.instant = this.dataSet.getValidInstant(instant);
    }

}