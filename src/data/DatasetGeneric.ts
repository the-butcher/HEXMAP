import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { TimeUtil } from "../util/TimeUtil";
import { ADataset } from "./ADataset";
import { DataEntry } from "./DataEntry";
import { IDataRoot } from "./IDataRoot";
import { IDataValue } from "./IDataValue";
import { IKeysetIndex } from "./IKeysetIndex";
import { KeysetIndex } from "./KeysetIndex";

/**
 * implementation of IDataSet
 * goal is to speed up things, espectially where calls for each hexagon have an impact even on a small scale
 * 
 * @author h.fleischer
 * @since 30.12.2021
 */
export class DatasetGeneric extends ADataset {

    private readonly indexKeyset: IKeysetIndex;

    private readonly minY: number;
    private readonly maxY: number;

    constructor(dataRoot: IDataRoot, valueFormatter: IFormattingDefinition) {

        super(dataRoot);

        this.indexKeyset = new KeysetIndex(dataRoot.indx, dataRoot.idxs);

        let lastValidSubEntries: { [K in string]: number[] } = {};

        const dateKeys = Object.keys(dataRoot.data);
        const entrySubKeys = this.getEntrySubkeys();

        dateKeys.forEach(dateKey => {

            const dataValues: { [K in string]: IDataValue[] } = {};
            const currEntry = dataRoot.data[dateKey];

            entrySubKeys.map(k => k.join('')).forEach(entrySubKey => {
                if (dataRoot.data[dateKey][entrySubKey]) {
                    lastValidSubEntries[entrySubKey] = dataRoot.data[dateKey][entrySubKey];
                } else {
                    console.log('missing entry sub key', dateKey, entrySubKey)
                }
                dataValues[entrySubKey] = lastValidSubEntries[entrySubKey].map(d => {
                    return {
                        noscl: d,
                        value: d,
                        label: () => valueFormatter.format(d)
                    }
                });
            });

            this.addEntry(dateKey, new DataEntry(TimeUtil.parseCategoryDateFull(dateKey), dataValues));

        });

    }

    acceptsZero(rawIndex: number): boolean {
        return false;
    }

    getMinY(): number {
        return this.minY;
    }

    getMaxY(): number {
        return this.maxY;
    }

    getIndexKeyset(): IKeysetIndex {
        return this.indexKeyset;
    }

}