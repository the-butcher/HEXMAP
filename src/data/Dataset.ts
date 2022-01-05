import { TimeUtil } from "../util/TimeUtil";
import { DataEntry } from "./DataEntry";
import { DataRepository } from "./DataRepository";
import { IDataEntry } from "./IDataEntry";
import { IDataRoot } from "./IDataRoot";
import { IDataset } from "./IDataset";
import { IKeyset } from "./IKeyset";
import { Keyset } from "./Keyset";

/**
 * implementation of IDataSet
 * goal is to speed up things, espectially where calls for each hexagon have an impact even on a small scale
 * 
 * @author h.fleischer
 * @since 30.12.2021
 */
export class Dataset implements IDataset { 

    // private readonly dataRoot: IDataRoot;
    private readonly populations: { [K in string]: number};
    private readonly keysetKeys: string[];
    private readonly keysets: { [K in string]: IKeyset };
    private readonly entryKeys: string[]; // the actual formatted dates
    private readonly entries: { [K in string]: IDataEntry };
    private readonly indexKeyset: IKeyset;

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
            this.keysets[keysetKey] = new Keyset(keysetKey, defaultKey, dataRoot.keys[keysetKey]);
        });

        const indexKeys = dataRoot.idxs;
        const indexKeysetRaw: { [K in string]: string} = {};
        for (let i = 0; i < indexKeys.length; i++) {
            indexKeysetRaw[i] = indexKeys[i];
        }        
        this.indexKeyset = new Keyset('index', dataRoot.indx.toString(), indexKeysetRaw);        

        const dateKeys = Object.keys(dataRoot.data);
        this.instantMin = TimeUtil.parseCategoryDateFull(dateKeys[0]);
        this.instantMax = TimeUtil.parseCategoryDateFull(dateKeys[dateKeys.length - 1]);
        this.entryKeys = [];
        this.entries = {};
        dateKeys.forEach(dateKey => {
            this.entryKeys.push(dateKey);
            this.entries[dateKey] = new DataEntry(TimeUtil.parseCategoryDateFull(dateKey), dataRoot.data[dateKey]);
        });


        this.minY = dataRoot.minY;
        this.maxY = dataRoot.maxY;

    }

    getPopulation(key: string): number {
        return this.populations[key];
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

    getIndexKeyset(): IKeyset {
        return this.indexKeyset;
    }

    getKeysetKeys(): string[] {
        return this.keysetKeys;
    }

    getValidInstant(instant: number): number {
        
        // console.log('min/max', TimeUtil.formatCategoryDateFull(instantMin), TimeUtil.formatCategoryDateFull(instantMax));
        instant = Math.max(instant, this.instantMin);
        instant = Math.min(instant, this.instantMax);

        // that very date not contained
        const categoryFullDate = TimeUtil.formatCategoryDateFull(instant);
        if (this.entryKeys.indexOf(categoryFullDate) < 0) {

            let curInstantDif: number;
            let minInstantDif = Number.MAX_SAFE_INTEGER;
            let entryInstant: number;
            let minInstant: number;
            for (let i=0; i<this.entryKeys.length; i++) {
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

    getLastInstant(): number {
        return this.instantMax;
    }

    getKeyset(key: string): IKeyset {
        return this.keysets[key];
    }
    
}