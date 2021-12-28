import { JsonLoader } from "../util/JsonLoader";
import { TimeUtil } from "../util/TimeUtil";
import { IChartData } from "./IChartData";
import { IChartEntry } from "./IChartEntry";
import { IDataRoot } from "./IDataRoot";

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

    private readonly dataset: { [K in string]: IDataRoot };

    private constructor() {
        this.dataset = {};
    }

    async getOrBuild(source: string, minInstant: number, maxInstant: number): Promise<IChartData> {

        const data = await this.getOrLoad(source);

        const names = Object.keys(data.keys);
        let dataPointer: string = '';
        for (let i = 0; i < names.length; i++) {
          dataPointer += data.path[names[i]];
        }
        const date = data.date;
  
        /**
         * how many series are going to be needed
         */
        const valueCount = data.data[date][dataPointer].length;
  
        const entries: IChartEntry[] = [];
        const dates = Object.keys(data.data);

        let minX = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;

        let minY = 0;
        let maxY = Number.MIN_VALUE;

        dates.forEach(dateRaw => {

          const dataVals = data.data[dateRaw][dataPointer];

          const valueX = TimeUtil.parseCategoryDateFull(dateRaw);

          if (valueX >= minInstant && valueX <= maxInstant) {

            minX = Math.min(minX, valueX);
            maxX = Math.max(maxX, valueX);
  
            const entry = {
              date: TimeUtil.parseCategoryDateFull(dateRaw),
            };
            for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) {
              if (dataVals[valueIndex] !== 0) {
                const valueY = dataVals[valueIndex];
                entry[`value_${valueIndex}`] = valueY;
                maxY = Math.max(maxY, valueY);
              }
            }
            entries.push(entry);
  
          }

        });     
        
        return {
          entries,
          valueCount,
          minX,
          maxX,
          minY: data.minY,
          maxY: data.maxY
        }

    }

    async getOrLoad(source: string): Promise<IDataRoot> {
        if (!this.dataset[source]) {
            this.dataset[source] = await new JsonLoader().load(source);
        }
        return this.dataset[source];
    }

    clampInstant(source: string, instant: number): number {

        const data = this.dataset[source];
        const dates = Object.keys(data.data);
        const instantMin = TimeUtil.parseCategoryDateFull(dates[0]);
        const instantMax = TimeUtil.parseCategoryDateFull(dates[dates.length - 1]);
    
        instant = Math.max(instant, instantMin);
        instant = Math.min(instant, instantMax);

        // that very date not contained
        if (dates.indexOf(TimeUtil.formatCategoryDateFull(instant)) < 0) {

            let curInstantDif: number;
            let minInstantDif = Number.MAX_SAFE_INTEGER;
            let datInstant: number;
            let minInstant: number;
            dates.forEach(date => {
                datInstant = TimeUtil.parseCategoryDateFull(date);
                curInstantDif = Math.abs(datInstant - instant);
                if (curInstantDif < minInstantDif) {
                    minInstantDif = curInstantDif;
                    minInstant = datInstant;
                }
            });
            instant = minInstant;

        }
    
        return instant;
    
      }

}