import { JsonLoader } from "../util/JsonLoader";
import { Dataset } from "./Dataset";
import { DataSetting } from "./DataSetting";
import { IChartData } from "./IChartData";
import { IChartEntry } from "./IChartEntry";
import { IDataRoot } from "./IDataRoot";
import { IDataSetting } from "./IDataSetting";

/**
 * utility type for managing data that needs to be loaded or has already been loaded
 * 
 * @author h.fleischer
 * @since 19.12.2021
 */
export class DataRepository {

  static readonly FAELLE = 'Fälle';

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

  getChartData(source: string, minInstant: number, maxInstant: number): IChartData {

    const dataSetting = this.getDataSetting(source);

    const keysetKeys = dataSetting.getDataset().getKeysetKeys(); // Object.keys(data.keys);
    let dataPointer: string = '';
    for (let i = 0; i < keysetKeys.length; i++) {
      dataPointer += dataSetting.getPath(keysetKeys[i]);
    }
    const population = dataSetting.getDataset().getPopulation(dataPointer);

    /**
     * how many series are going to be needed
     */
    const valueCount = dataSetting.getDataset().getIndexKeyset().size();

    const entries: IChartEntry[] = [];
    const dates = dataSetting.getDataset().getEntryKeys(); // Object.keys(data.data);

    let minX = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;

    let minY = 0;
    let maxY = Number.MIN_VALUE;

    dates.forEach(date => {

      const dataEntry = dataSetting.getDataset().getEntryByDate(date); // data.data[dateRaw][dataPointer];

      const valueX = dataEntry.getInstant();

      if (valueX >= minInstant && valueX <= maxInstant) {

        minX = Math.min(minX, valueX);
        maxX = Math.max(maxX, valueX);

        const chartEntry: IChartEntry = {
          instant: dataEntry.getInstant(),
        };

        for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) {

          if (chartEntry[valueIndex] !== 0) {

            const indexName = dataSetting.getDataset().getIndexKeyset().getValue(valueIndex.toString());

            let valueY = dataEntry.getValue(dataPointer, valueIndex);
            if (valueY > 0) {
              chartEntry[`label_${valueIndex}`] = valueY;
              if (indexName === DataRepository.FAELLE) {
                valueY = valueY * 700000 / population; // scale daily reports to incidence
              }
              chartEntry[`value_${valueIndex}`] = valueY;
            }

            maxY = Math.max(maxY, valueY);

          }

        }
        entries.push(chartEntry);

      }

    });

    return {
      entries,
      valueCount,
      minX,
      maxX,
      minY: dataSetting.getDataset().getMinY(),
      maxY: dataSetting.getDataset().getMaxY()
    }

  }

  getDataSetting(source: string): IDataSetting {
    return this.dataSettings[source];
  }

  async getOrLoadDataSetting(source: string): Promise<IDataSetting> {
    if (!this.dataSettings[source]) {
      const dataRoot: IDataRoot = await new JsonLoader().load(source);
      this.dataSettings[source] = new DataSetting(new Dataset(dataRoot));
    }
    return this.dataSettings[source];
  }

}