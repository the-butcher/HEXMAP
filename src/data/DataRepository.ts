import { IIndicatorProps } from "../components/IIndicatorProps";
import { FixedValue } from "../util/FixedValue";
import { FormattingDefinition } from "../util/FormattingDefinition";
import { InterpolatedValue } from "../util/InterpolatedValue";
import { JsonLoader } from "../util/JsonLoader";
import { TimeUtil } from "../util/TimeUtil";
import { DatasetGeneric } from "./DatasetGeneric";
import { DatasetIncidence } from "./DatasetIncidence";
import { DatasetMortality } from "./DatasetMortality";
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
    //   instantDif: TimeUtil.MILLISECONDS_PER____DAY,
    //   name: 'Inzidenz',
    //   desc: 'Salzburger Gemeinden',
    //   value00: '',
    //   value07: '',
    //   valueFormatter: FormattingDefinition.FORMATTER____FIXED,
    //   onExpand: () => { },
    //   onInstantChange: () => { },
    //   onInstantRangeChange: () => { },
    //   onExport: () => { },
    //   onSeriesVisibilityChange: () => { },
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
    //   constructDataset: dataRoot => new DatasetIncidence(dataRoot),
    //   seriesVisibilities: {}
    // },
    {
      id: 'i_ems',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Inzidenz',
      desc: 'EMS',
      value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      valueFormatter: FormattingDefinition.FORMATTER____FIXED,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
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
      constructDataset: dataRoot => new DatasetIncidence(dataRoot),
      seriesVisibilities: {}
    },
    {
      id: 'i_paa',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Inzidenz',
      desc: 'Bundesland und Alter',
      value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      valueFormatter: FormattingDefinition.FORMATTER____FIXED,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
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
      constructDataset: dataRoot => new DatasetIncidence(dataRoot),
      seriesVisibilities: {}
    },
    {
      id: 'i_dst',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Inzidenz',
      desc: 'Bezirk',
      value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      valueFormatter: FormattingDefinition.FORMATTER____FIXED,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
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
      constructDataset: dataRoot => new DatasetIncidence(dataRoot),
      seriesVisibilities: {}
    },
    {
      id: 'v_mnc',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER___WEEK,
      name: 'Impfung',
      desc: 'Gemeinde',
      value00: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      value07: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
      doExport: false,
      fold: 'closed',
      source: './hexmap-data-vacc-gemeinde.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      interpolatedEle: new InterpolatedValue(-10, 20, 0, 1, 1),
      interpolatedHue: new InterpolatedValue(0.00, 0.25, 0.65, 0.85, 1),
      interpolatedSat: new FixedValue(1.00), // new InterpolatedValue(0.50, 1.00, 0.78, 0.82, 1), //
      interpolatedVal: new FixedValue(0.40), // new InterpolatedValue(0.00, 0.20, 0.78, 0.82, 1), // new FixedValue(0.40),
      interpolatedInt: new FixedValue(1.25),
      constructDataset: dataRoot => new DatasetGeneric(dataRoot),
      seriesVisibilities: {}
    },
    // {
    //   id: 'p_mnc',
    //   instant: -1,
    //   instantMin: -1,
    //   instantMax: -1,
    //   instantDif: TimeUtil.MILLISECONDS_PER___YEAR,
    //   name: 'Alter',
    //   desc: 'Gemeinde',
    //   value00: FormattingDefinition.FORMATTER__FLOAT_2.format(0.1111).replaceAll('1', '#'),
    //   value07: FormattingDefinition.FORMATTER__FLOAT_2.format(0.1111).replaceAll('1', '#'),
    //   valueFormatter: FormattingDefinition.FORMATTER__FLOAT_2,
    //   onExpand: () => { },
    //   onInstantChange: () => { },
    //   onInstantRangeChange: () => { },
    //   onExport: () => { },
    //   onSeriesVisibilityChange: () => { },
    //   doExport: false,
    //   fold: 'closed',
    //   source: './hexmap-data-population-gemeinde.json',
    //   loaded: false,
    //   path: '',
    //   breadcrumbProps: [],
    //   interpolatedEle: new InterpolatedValue(-5, 5, 22, 52, 1),
    //   interpolatedHue: new FixedValue(0.17),
    //   interpolatedSat: new InterpolatedValue(0.8, 0.2, 32, 52, 1), // new InterpolatedValue(0.50, 1.00, 0.78, 0.82, 1), //
    //   interpolatedVal: new InterpolatedValue(0.5, 0.1, 32, 52, 1),
    //   interpolatedInt: new FixedValue(1.25),
    //   constructDataset: dataRoot => new DatasetGeneric(dataRoot),
    //   seriesVisibilities: {}
    // },
    // {
    //   id: 'd_dst',
    //   instant: -1,
    //   instantMin: -1,
    //   instantMax: -1,
    //   instantDif: TimeUtil.MILLISECONDS_PER___WEEK,
    //   name: 'Sterblichkeit',
    //   desc: 'Bezirk',
    //   value00: FormattingDefinition.FORMATTER____FIXED.format(0.1111).replaceAll('1', '#'),
    //   value07: FormattingDefinition.FORMATTER____FIXED.format(0.1111).replaceAll('1', '#'),
    //   valueFormatter: FormattingDefinition.FORMATTER____FIXED,
    //   onExpand: () => { },
    //   onInstantChange: () => { },
    //   onInstantRangeChange: () => { },
    //   onExport: () => { },
    //   onSeriesVisibilityChange: () => { },
    //   doExport: false,
    //   fold: 'closed',
    //   source: './hexmap-data-mortality-bezirk.json',
    //   loaded: false,
    //   path: '',
    //   breadcrumbProps: [],
    //   interpolatedEle: new InterpolatedValue(0, 40, 0.00, 80.00, 1),
    //   interpolatedHue: new FixedValue(0.17),
    //   interpolatedSat: new FixedValue(0.2),
    //   interpolatedVal: new InterpolatedValue(0.25, 0.05, 0.00, 30.00, 1),
    //   interpolatedInt: new FixedValue(1.25),
    //   constructDataset: dataRoot => new DatasetMortality(dataRoot),
    //   seriesVisibilities: {}
    // }
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
    // const population = dataSetting.getDataset().getPopulation(dataPointer);

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
            if (dataSetting.getDataset().acceptsZero() || valueY.value > 0) {
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