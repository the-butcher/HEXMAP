import { FormattingDefinition } from "../util/FormattingDefinition";
import { TimeUtil } from "../util/TimeUtil";
import { DataEntry } from "./DataEntry";
import { DataRepository } from "./DataRepository";
import { IDataEntry } from "./IDataEntry";
import { IDataRoot } from "./IDataRoot";
import { IDataset } from "./IDataset";
import { IDataValue } from "./IDataValue";
import { IKeyset } from "./IKeyset";
import { IKeysetIndex } from "./IKeysetIndex";
import { KeysetGeneric } from "./KeysetGeneric";
import { KeysetIndex } from "./KeysetIndex";

/**
 * implementation of IDataSet
 * goal is to speed up things, espectially where calls for each hexagon have an impact even on a small scale
 * 
 * @author h.fleischer
 * @since 30.12.2021
 */
export class DatasetGeneric implements IDataset {

    // private readonly dataRoot: IDataRoot;
    private readonly populations: { [K in string]: number[] };
    private readonly keysetKeys: string[];
    private readonly keysets: { [K in string]: IKeyset };
    private readonly entryKeys: string[]; // the actual formatted dates
    private readonly entries: { [K in string]: IDataEntry };
    private readonly indexKeyset: IKeysetIndex;

    private readonly instantMin: number;
    private readonly instantMax: number;
    private readonly minY: number;
    private readonly maxY: number;

    constructor(dataRoot: IDataRoot) {

        this.populations = dataRoot.pops;

        this.keysetKeys = Object.keys(dataRoot.keys);
        this.keysets = {};
        this.keysetKeys.forEach(keysetKey => {
            const defaultKey = Object.keys(dataRoot.keys[keysetKey]).sort()[0];
            this.keysets[keysetKey] = new KeysetGeneric(keysetKey, defaultKey, dataRoot.keys[keysetKey]);
        });

        // const indexKeys = dataRoot.idxs;
        // const indexKeysetRaw: { [K in string]: string } = {};
        // for (let i = 0; i < indexKeys.length; i++) {
        //     indexKeysetRaw[i] = indexKeys[i];
        // }
        this.indexKeyset = new KeysetIndex(dataRoot.indx, dataRoot.idxs.map(m => m.name));

        const dateKeys = Object.keys(dataRoot.data);
        this.instantMin = TimeUtil.parseCategoryDateFull(dateKeys[0]);
        this.instantMax = TimeUtil.parseCategoryDateFull(dateKeys[dateKeys.length - 1]);
        this.entryKeys = [];
        this.entries = {};


        dateKeys.forEach(dateKey => {

            this.entryKeys.push(dateKey);
            const dataValues: { [K in string]: IDataValue[] } = {};

            const entryKeys = Object.keys(dataRoot.data[dateKey]);
            entryKeys.forEach(entryKey => {
                dataValues[entryKey] = dataRoot.data[dateKey][entryKey].map(d => {
                    return {
                        value: d,
                        label: () => FormattingDefinition.FORMATTER__FLOAT_2.format(d)
                    }
                });
            })

            this.entries[dateKey] = new DataEntry(TimeUtil.parseCategoryDateFull(dateKey), dataValues);

        });


        // this.minY = dataRoot.minY;
        // this.maxY = dataRoot.maxY;

    }

    acceptsZero(): boolean {
        return false;
    }

    getPopulation(key: string): number {
        return this.populations[key][0];
    }

    getMinY(): number {
        return this.minY;
    }

    getMaxY(): number {
        return this.maxY;
    }

    getEntryByDate(date: string): IDataEntry {
        return this.entries[date];
    }

    getEntryByInstant(instant: number): IDataEntry {
        return this.entries[TimeUtil.formatCategoryDateFull(instant)];
    }

    getEntryKeys(): string[] {
        return this.entryKeys;
    }

    getIndexKeyset(): IKeysetIndex {
        return this.indexKeyset;
    }

    getKeysetKeys(): string[] {
        return this.keysetKeys;
    }

    getValidInstant(instant: number): number {

        instant = Math.max(instant, this.instantMin);
        instant = Math.min(instant, this.instantMax);

        // that very date not contained
        const categoryFullDate = TimeUtil.formatCategoryDateFull(instant);
        if (this.entryKeys.indexOf(categoryFullDate) < 0) {

            let curInstantDif: number;
            let minInstantDif = Number.MAX_SAFE_INTEGER;
            let entryInstant: number;
            let minInstant: number;
            for (let i = 0; i < this.entryKeys.length; i++) {
                entryInstant = this.entries[this.entryKeys[i]].getInstant(); // parseInt(entryKey); // TimeUtil.parseCategoryDateFull(date);
                curInstantDif = Math.abs(entryInstant - instant);
                if (curInstantDif < minInstantDif) {
                    minInstantDif = curInstantDif;
                    minInstant = entryInstant;
                } else {
                    break;
                }
            }
            instant = minInstant;

        }

        return instant;

    }

    getInstantMin(): number {
        return this.instantMin;
    }

    getInstantMax(): number {
        return this.instantMax;
    }

    getKeyset(key: string): IKeyset {
        return this.keysets[key];
    }

}