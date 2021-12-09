import { JsonLoader } from "../util/JsonLoader";
import { IDataRoot } from "./IDataRoot";

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

}