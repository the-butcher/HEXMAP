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

    async clampInstant(source: string, instant: number): Promise<number> {

        const data = await DataRepository.getInstance().getOrLoad(source)
        const dates = Object.keys(data.data);
        const instantMin = TimeUtil.parseCategoryDateFull(dates[0]);
        const instantMax = TimeUtil.parseCategoryDateFull(dates[dates.length - 1]);
    
        instant = Math.max(instant, instantMin);
        instant = Math.min(instant, instantMax);
    
        return instant;
    
      }

}