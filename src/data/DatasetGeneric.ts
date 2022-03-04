import { IFormattingDefinition } from "../util/IFormattingDefinition";
import { TimeUtil } from "../util/TimeUtil";
import { ADataset } from "./ADataset";
import { DataEntry } from "./DataEntry";
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
export class DatasetGeneric extends ADataset {

    private readonly indexKeyset: IKeysetIndex;

    private readonly minY: number;
    private readonly maxY: number;

    constructor(dataRoot: IDataRoot, valueFormatter: IFormattingDefinition) {

        super(dataRoot);

        this.indexKeyset = new KeysetIndex(dataRoot.indx, dataRoot.idxs);

        const dateKeys = Object.keys(dataRoot.data);
        dateKeys.forEach(dateKey => {

            const dataValues: { [K in string]: IDataValue[] } = {};

            const entryKeys = Object.keys(dataRoot.data[dateKey]);
            entryKeys.forEach(entryKey => {
                dataValues[entryKey] = dataRoot.data[dateKey][entryKey].map(d => {
                    return {
                        noscl: d,
                        value: d,
                        label: () => valueFormatter.format(d)
                    }
                });
            })

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