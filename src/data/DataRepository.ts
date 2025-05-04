
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

  private constructor() {

  }

}