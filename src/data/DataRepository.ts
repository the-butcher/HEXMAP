import { JsonLoader } from "../util/JsonLoader";
import { Dataset } from "./Dataset";
import { DataSetting } from "./DataSetting";
import { IChartData } from "./IChartData";
import { IDataRoot } from "./IDataRoot";
import { IDataset } from "./IDataset";
import { IDataSetting } from "./IDataSetting";

/**
 * utility type for managing data that needs to be loaded or has already been loaded
 * 
 * @author h.fleischer
 * @since 19.12.2021
 */
export class DataRepository {

  static getInstance(): DataRepository {
    if (!this.instance) {
      this.instance = new DataRepository();
    }
    return this.instance;
  }

  private static instance: DataRepository;

  private readonly dataSettings: { [K in string]: IDataSetting };

  private constructor() {
    this.dataSettings = {};
  }

  async getOrBuild(source: string, minInstant: number, maxInstant: number): Promise<IChartData> {

    const dataSettings = await this.getOrLoadDataSetting(source);

    // const names = dataSet.getKeysetKeys(); // Object.keys(data.keys);
    // let dataPointer: string = '';
    // for (let i = 0; i < names.length; i++) {
    //   dataPointer += data.path[names[i]];
    // }
    // const date = data.date;

    // /**
    //  * how many series are going to be needed
    //  */
    // const valueCount = data.data[date][dataPointer].length;

    // const entries: IChartEntry[] = [];
    // const dates = Object.keys(data.data);

    // let minX = Number.MAX_VALUE;
    // let maxX = Number.MIN_VALUE;

    // let minY = 0;
    // let maxY = Number.MIN_VALUE;

    // dates.forEach(dateRaw => {

    //   const dataVals = data.data[dateRaw][dataPointer];

    //   const valueX = TimeUtil.parseCategoryDateFull(dateRaw);

    //   if (valueX >= minInstant && valueX <= maxInstant) {

    //     minX = Math.min(minX, valueX);
    //     maxX = Math.max(maxX, valueX);

    //     const entry: IChartEntry = {
    //       instant: TimeUtil.parseCategoryDateFull(dateRaw),
    //     };
    //     for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) {
    //       if (dataVals[valueIndex] !== 0) {
    //         const valueY = dataVals[valueIndex];
    //         entry[`value_${valueIndex}`] = valueY;
    //         maxY = Math.max(maxY, valueY);
    //       }
    //     }
    //     entries.push(entry);

    //   }

    // });

    // return {
    //   entries,
    //   valueCount,
    //   minX,
    //   maxX,
    //   minY: data.minY,
    //   maxY: data.maxY
    // }

    return null;

  }

  async getOrLoadDataSetting(source: string): Promise<IDataSetting> {
    if (!this.dataSettings[source]) {
      const dataRoot: IDataRoot = await new JsonLoader().load(source);
      this.dataSettings[source] = new DataSetting(new Dataset(dataRoot));
    }
    return this.dataSettings[source];
  }

}