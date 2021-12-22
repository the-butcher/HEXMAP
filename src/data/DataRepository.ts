import { JsonLoader } from "../util/JsonLoader";
import { TimeUtil } from "../util/TimeUtil";
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