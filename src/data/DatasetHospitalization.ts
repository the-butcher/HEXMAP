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
 * @since 17.02.2022
 */
export class DatasetHospitalization extends ADataset {

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
        return true;
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