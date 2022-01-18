import { IIndicatorProps } from "../components/IIndicatorProps";
import { FixedValue } from "../util/FixedValue";
import { FormattingDefinition } from "../util/FormattingDefinition";
import { InterpolatedValue } from "../util/InterpolatedValue";
import { JsonLoader } from "../util/JsonLoader";
import { DatasetGeneric } from "./DatasetGeneric";
import { DatasetIncidence } from "./DatasetIncidence";
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

  static readonly interpolatedEle7di5 = new InterpolatedValue(0, 80, 0, 20000, 1.00);
  static readonly interpolatedEle7di3 = new InterpolatedValue(0, 80, 0, 14000, 1.00);
  static readonly interpolatedEle7di1 = new InterpolatedValue(0, 80, 0, 8000, 1.00);
  static readonly interpolatedHue7di5 = new InterpolatedValue(0.25, -0.01, 0, 5000, 0.33);
  static readonly interpolatedHue7di3 = new InterpolatedValue(0.25, -0.01, 0, 3500, 0.33);
  static readonly interpolatedHue7di1 = new InterpolatedValue(0.25, -0.01, 0, 2000, 0.33);
  static readonly interpolatedInt7diX = new InterpolatedValue(1.30, 1.20, 0, 2000, 1);

  static readonly DEFAULT_INDICATOR_PROPS: IIndicatorProps[] = [
    // {
    //   id: 'i_sbg',
    //   instant: -1,
    //   instantMin: -1,
    //   instantMax: -1,
    //   name: 'Inzidenz',
    //   desc: 'Salzburger Gemeinden',
    //   value00: '',
    //   value07: '',
    //   valueFormatter: FormattingDefinition.FORMATTER____FIXED,
    //   onExpand: () => { },
    //   onInstantChange: () => { },
    //   onInstantRangeChange: () => { },
    //   onExport: () => { },
    //   doExport: false,
    //   fold: 'open-horizontal',
    //   source: './hexmap-data-salzburg-gemeinde.json',
    //   loaded: false,
    //   path: '',
    //   breadcrumbProps: [],
    //   interpolatedEle: DataRepository.interpolatedEle7di5,
    //   interpolatedHue: DataRepository.interpolatedHue7di5,
    //   interpolatedSat: new FixedValue(1.00),
    //   interpolatedVal: new FixedValue(0.40),
    //   interpolatedInt: DataRepository.interpolatedInt7diX,
    //   constructDataset: dataRoot => new Dataset(dataRoot)
    // },
    {
      id: 'i_ems',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      name: 'Inzidenz',
      desc: 'EMS',
      value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      valueFormatter: FormattingDefinition.FORMATTER____FIXED,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      doExport: false,
      fold: 'open-horizontal',
      source: './hexmap-data-incidence-ems.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      interpolatedEle: DataRepository.interpolatedEle7di1,
      interpolatedHue: DataRepository.interpolatedHue7di1,
      interpolatedSat: new FixedValue(1.00),
      interpolatedVal: new FixedValue(0.40),
      interpolatedInt: DataRepository.interpolatedInt7diX,
      constructDataset: dataRoot => new DatasetIncidence(dataRoot)
    },
    {
      id: 'i_paa',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      name: 'Inzidenz',
      desc: 'Bundesland und Alter',
      value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      valueFormatter: FormattingDefinition.FORMATTER____FIXED,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      doExport: false,
      fold: 'closed',
      source: './hexmap-data-incidence-age.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      interpolatedEle: DataRepository.interpolatedEle7di1,
      interpolatedHue: DataRepository.interpolatedHue7di1,
      interpolatedSat: new FixedValue(1.00),
      interpolatedVal: new FixedValue(0.40),
      interpolatedInt: DataRepository.interpolatedInt7diX,
      constructDataset: dataRoot => new DatasetIncidence(dataRoot)
    },
    {
      id: 'i_dst',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      name: 'Inzidenz',
      desc: 'Bezirk',
      value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      valueFormatter: FormattingDefinition.FORMATTER____FIXED,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      doExport: false,
      fold: 'closed',
      source: './hexmap-data-incidence-bezirk.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      interpolatedEle: DataRepository.interpolatedEle7di3,
      interpolatedHue: DataRepository.interpolatedHue7di3,
      interpolatedSat: new FixedValue(1.00),
      interpolatedVal: new FixedValue(0.40),
      interpolatedInt: DataRepository.interpolatedInt7diX,
      constructDataset: dataRoot => new DatasetIncidence(dataRoot)
    },
    {
      id: 'v_mnc',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      name: 'Impfung',
      desc: 'Gemeinde',
      value00: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      value07: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      doExport: false,
      fold: 'closed',
      source: './hexmap-data-vacc-gemeinde.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      interpolatedEle: new InterpolatedValue(0, 20, 0.00, 1.00, 1),
      interpolatedHue: new InterpolatedValue(0.00, 0.25, 0.50, 0.90, 1),
      interpolatedSat: new FixedValue(1.00),
      interpolatedVal: new FixedValue(0.40),
      interpolatedInt: new FixedValue(1.25),
      constructDataset: dataRoot => new DatasetGeneric(dataRoot)
    }
  ];

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
            if (valueY.value > 0) {
              chartEntry[`value_${valueIndex}`] = valueY.value;
              chartEntry[`label_${valueIndex}`] = valueY.label();
            }
            maxY = Math.max(maxY, valueY.value);

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
      const indicatorProps = DataRepository.DEFAULT_INDICATOR_PROPS.find(p => p.source === source);
      const dataset = indicatorProps.constructDataset(dataRoot);
      this.dataSettings[source] = new DataSetting(dataset);
    }
    return this.dataSettings[source];
  }

}