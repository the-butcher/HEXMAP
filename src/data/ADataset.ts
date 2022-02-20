import { TextGeometry } from "three";
import { TimeUtil } from "../util/TimeUtil";
import { IDataEntry } from "./IDataEntry";
import { IDataRoot } from "./IDataRoot";
import { IDataset } from "./IDataset";
import { IKeyset } from "./IKeyset";
import { IKeysetIndex } from "./IKeysetIndex";
import { KeysetGeneric } from "./KeysetGeneric";

/**
 * implementation of IDataSet
 * goal is to speed up things, espectially where calls for each hexagon have an impact even on a small scale
 * 
 * @author h.fleischer
 * @since 30.12.2021
 */
export abstract class ADataset implements IDataset {

    protected readonly populations: { [K in string]: number[] };
    private readonly keysetKeys: string[];
    private readonly keysets: { [K in string]: IKeyset };

    private readonly entryKeys: string[]; // the actual formatted dates
    private readonly entries: { [K in string]: IDataEntry };

    protected readonly instantMin: number;
    protected readonly instantMax: number;

    constructor(dataRoot: IDataRoot) {

        this.populations = dataRoot.pops;

        this.keysetKeys = Object.keys(dataRoot.keys);
        this.keysets = {};
        this.keysetKeys.forEach(keysetKey => {
            const defaultKey = Object.keys(dataRoot.keys[keysetKey]).sort()[0];
            this.keysets[keysetKey] = new KeysetGeneric(keysetKey, defaultKey, dataRoot.keys[keysetKey]);
        });

        this.entryKeys = [];
        this.entries = {};

        const dateKeys = Object.keys(dataRoot.data);
        this.instantMin = TimeUtil.parseCategoryDateFull(dateKeys[0]);
        this.instantMax = TimeUtil.parseCategoryDateFull(dateKeys[dateKeys.length - 1]);

    }

    abstract getIndexKeyset(): IKeysetIndex;
    abstract getMinY(): number;
    abstract getMaxY(): number;

    addEntry(entryKey: string, entry: IDataEntry): void {
        this.entryKeys.push(entryKey);
        this.entries[entryKey] = entry;
    }

    abstract acceptsZero(rawIndex: number): boolean;

    getPopulation(key: string): number {
        return this.populations[key][0];
    }

    getKeysetKeys(): string[] {
        return this.keysetKeys;
    }

    getKeyset(key: string): IKeyset {
        return this.keysets[key];
    }

    getValidInstant(instant: number): number {

        instant = Math.max(instant, this.instantMin);
        instant = Math.min(instant, this.instantMax);

        // that very date not contained
        const categoryFullDate = TimeUtil.formatCategoryDateFull(instant);
        const entryKeys = this.getEntryKeys()
        if (entryKeys.indexOf(categoryFullDate) < 0) {

            let curInstantDif: number;
            let minInstantDif = Number.MAX_SAFE_INTEGER;
            let entryInstant: number;
            let minInstant: number;

            const entries = this.getEntries();

            for (let i = 0; i < entryKeys.length; i++) {
                entryInstant = entries[entryKeys[i]].getInstant(); // parseInt(entryKey); // TimeUtil.parseCategoryDateFull(date);
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


    getEntryByDate(date: string): IDataEntry {
        return this.entries[date];
    }

    getEntryByInstant(instant: number): IDataEntry {
        return this.entries[TimeUtil.formatCategoryDateFull(instant)];
    }

    getEntryKeys(): string[] {
        return this.entryKeys;
    }

    protected getEntries(): { [K in string]: IDataEntry } {
        return this.entries;
    }


}