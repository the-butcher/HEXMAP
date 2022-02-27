import { IIndicatorProps } from "../components/IIndicatorProps";
import { FixedValue } from "../util/FixedValue";
import { FormattingDefinition } from "../util/FormattingDefinition";
import { InterpolatedValue } from "../util/InterpolatedValue";
import { JsonLoader } from "../util/JsonLoader";
import { TimeUtil } from "../util/TimeUtil";
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

  // mortality
  static readonly interpolatedEle7dm3 = new InterpolatedValue(0, 80, 0, 140, 1.00);

  static readonly interpolatedEle7di3 = new InterpolatedValue(-7, 73, 0, 14000, 1.00);
  static readonly interpolatedHue7di3 = new InterpolatedValue(0.25, -0.01, 0, 3500, 0.33);
  static readonly interpolatedInt7diX = new InterpolatedValue(1.75, 1.50, 0, 2000, 1.00);

  // 0.33, 0.17, 0.08, 0.00
  static readonly interpolatedHueRg04 = new InterpolatedValue(0.33, 0.17, 0.03, 0.05, 1.00);
  static readonly interpolatedHueRg08 = new InterpolatedValue(0.17, 0.08, 0.07, 0.09, 1.00);
  static readonly interpolatedHueRg11 = new InterpolatedValue(0.08, 0.00, 0.10, 0.12, 1.00);

  static readonly INDICATOR_PROPS: IIndicatorProps[] = [
    // {
    //   id: 'i_sbg',
    //   thema: 'INCIDENCE',
    //   instant: -1,
    //   instantMin: -1,
    //   instantMax: -1,
    //   instantDif: TimeUtil.MILLISECONDS_PER____DAY,
    //   name: 'Inzidenz',
    //   desc: 'Salzburger Gemeinden',
    //   copy: 'https://fitforfire.github.io/covid-sbg/#/',
    //   formatter: FormattingDefinition.FORMATTER____FIXED,
    //   label00: '',
    //   label07: '',
    //   onExpand: () => { },
    //   onInstantChange: () => { },
    //   onInstantRangeChange: () => { },
    //   onExport: () => { },
    //   onSeriesVisibilityChange: () => { },
    //   onLogarithmicChange: () => { },
    //   doExport: false,
    //   logarithmic: false,
    //   fold: 'open-horizontal',
    //   source: './hexmap-data-salzburg-gemeinde.json',
    //   loaded: false,
    //   path: '',
    //   breadcrumbProps: [],
    //   getRendererProps: (index: number, name: string) => {
    //     return {
    //       interpolatedEle: new InterpolatedValue(0, 20, 0, 14000, 1.00),
    //       interpolatedHue: DataRepository.interpolatedHue7di3,
    //       interpolatedSat: new FixedValue(1.00),
    //       interpolatedVal: new FixedValue(0.40),
    //       interpolatedInt: DataRepository.interpolatedInt7diX,
    //     }
    //   },
    //   constructDataset: dataRoot => new DatasetIncidence(dataRoot),
    //   seriesVisibilities: {}
    // },
    {

      id: 'i_ems',
      thema: 'INCIDENCE',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Inzidenz',
      desc: 'EMS',
      copy: 'https://www.data.gv.at/covid-19/',
      formatter: FormattingDefinition.FORMATTER____FIXED,
      label00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      label07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
      onLogarithmicChange: () => { },
      doExport: false,
      logarithmic: false,
      fold: 'open-horizontal',
      source: './hexmap-data-00-incidence-ems.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      getRendererProps: (index: number, name: string) => {
        if (index === 2) {
          return {
            interpolatedEle: new InterpolatedValue(-5, 20, -0.5, 2.00, 1),
            interpolatedHue: new InterpolatedValue(0.3, 0.0, -0.001, 0.001, 1),
            interpolatedSat: new FixedValue(1),
            interpolatedVal: new FixedValue(0.7),
            interpolatedInt: new FixedValue(1.65),
          }
        } else {
          return {
            interpolatedEle: DataRepository.interpolatedEle7di3,
            interpolatedHue: DataRepository.interpolatedHue7di3,
            interpolatedSat: new FixedValue(1.00),
            interpolatedVal: new FixedValue(0.40),
            interpolatedInt: DataRepository.interpolatedInt7diX,
          }
        }
      },
      constructDataset: dataRoot => new DatasetIncidence(dataRoot),
      seriesVisibilities: {}
    },
    {
      id: 'i_paa',
      thema: 'INCIDENCE',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Inzidenz',
      desc: 'Bundesland und Alter',
      copy: 'https://www.data.gv.at/covid-19/',
      formatter: FormattingDefinition.FORMATTER____FIXED,
      label00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      label07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
      onLogarithmicChange: () => { },
      doExport: false,
      logarithmic: false,
      fold: 'closed',
      source: './hexmap-data-01-incidence-age.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      getRendererProps: (index: number, name: string) => {
        if (name === 'Sterblichkeit' || name === 'Todesfälle') {
          return {
            interpolatedEle: DataRepository.interpolatedEle7dm3,
            interpolatedHue: new FixedValue(0.17),
            interpolatedSat: new FixedValue(0.20),
            interpolatedVal: new InterpolatedValue(0.25, 0.05, 0.00, 30.00, 1),
            interpolatedInt: DataRepository.interpolatedInt7diX,
          }
        } else {
          return {
            interpolatedEle: DataRepository.interpolatedEle7di3,
            interpolatedHue: DataRepository.interpolatedHue7di3,
            interpolatedSat: new FixedValue(1.00),
            interpolatedVal: new FixedValue(0.40),
            interpolatedInt: DataRepository.interpolatedInt7diX,
          }
        }
      },
      constructDataset: dataRoot => new DatasetIncidence(dataRoot),
      seriesVisibilities: {}
    },
    {
      id: 'i_dst',
      thema: 'INCIDENCE',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Inzidenz',
      desc: 'Bezirk',
      copy: 'https://www.data.gv.at/covid-19/',
      formatter: FormattingDefinition.FORMATTER____FIXED,
      label00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      label07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
      onLogarithmicChange: () => { },
      doExport: false,
      logarithmic: false,
      fold: 'closed',
      source: './hexmap-data-02-incidence-bezirk.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      getRendererProps: (index: number, name: string) => {
        if (name === 'Sterblichkeit' || name === 'Todesfälle') {
          return {
            interpolatedEle: DataRepository.interpolatedEle7dm3,
            interpolatedHue: new FixedValue(0.17),
            interpolatedSat: new FixedValue(0.20),
            interpolatedVal: new InterpolatedValue(0.25, 0.05, 0.00, 30.00, 1),
            interpolatedInt: DataRepository.interpolatedInt7diX,
          }
        } else if (name === 'dlt_incdc') {
          return {
            interpolatedEle: new InterpolatedValue(-7.00, 30.00, -0.50, 0.50, 1),
            interpolatedHue: new InterpolatedValue(0.33, 0, -0.25, 0.25, 1),
            interpolatedSat: new FixedValue(1.00),
            interpolatedVal: new FixedValue(0.30),
            interpolatedInt: DataRepository.interpolatedInt7diX,
          }
        } else {
          return {
            interpolatedEle: DataRepository.interpolatedEle7di3,
            interpolatedHue: DataRepository.interpolatedHue7di3,
            interpolatedSat: new FixedValue(1.00),
            interpolatedVal: new FixedValue(0.40),
            interpolatedInt: DataRepository.interpolatedInt7diX,
          }
        }
      },
      constructDataset: dataRoot => new DatasetIncidence(dataRoot),
      seriesVisibilities: {}
    },
    // {
    //   id: 'v_dst',
    //   thema: 'VACCINATION',
    //   instant: -1,
    //   instantMin: -1,
    //   instantMax: -1,
    //   instantDif: TimeUtil.MILLISECONDS_PER____DAY,
    //   name: 'Impfung',
    //   desc: 'Bezirk',
    //   label00: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
    //   label07: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
    //   formatter: FormattingDefinition.FORMATTER_PERCENT,
    //   copy: '',
    //   onExpand: () => { },
    //   onInstantChange: () => { },
    //   onInstantRangeChange: () => { },
    //   onExport: () => { },
    //   onSeriesVisibilityChange: () => { },
    //   onLogarithmicChange: () => { },
    //   doExport: false,
    //   logarithmic: false,
    //   fold: 'open-horizontal',
    //   source: './hexmap-data-03-vacc-age.json',
    //   loaded: false,
    //   path: '',
    //   breadcrumbProps: [],
    //   getRendererProps: (index: number, name: string) => {
    //     return {
    //       interpolatedEle: new InterpolatedValue(-5, 10, 0, 1, 1),
    //       interpolatedHue: new InterpolatedValue(0.00, 0.25, 0.10, 0.80, 1),
    //       interpolatedSat: new FixedValue(1.00),
    //       interpolatedVal: new FixedValue(0.40),
    //       interpolatedInt: new FixedValue(1.25),
    //     }
    //   },
    //   constructDataset: dataRoot => new DatasetGeneric(dataRoot, FormattingDefinition.FORMATTER_PERCENT),
    //   seriesVisibilities: {}
    // },
    {
      id: 'v_mnc',
      thema: 'VACCINATION',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Impfung',
      desc: 'Gemeinde',
      copy: 'https://www.data.gv.at/covid-19/',
      formatter: FormattingDefinition.FORMATTER_PERCENT,
      label00: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      label07: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      // valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
      onLogarithmicChange: () => { },
      doExport: false,
      logarithmic: false,
      fold: 'open-horizontal',
      source: './hexmap-data-03-vacc-gemeinde.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      getRendererProps: (index: number, name: string) => {
        if (index === 3) { // impfprämie
          return {
            interpolatedEle: new InterpolatedValue(-9.6, 2.4, 0, 1, 1),
            interpolatedHue: new FixedValue(0.33),
            interpolatedSat: {
              getOut: (val: number) => {
                if (val < 0.8) {
                  return 0;
                } else {
                  return 1.00;
                }
              }
            },
            interpolatedVal: {
              getOut: (val: number) => {
                if (val < 0.8) {
                  return 0;
                } else if (val < 0.85) {
                  return 0.20;
                } else if (val < 0.90) {
                  return 0.30;
                } else {
                  return 0.40;
                }
              }
            },
            interpolatedInt: new FixedValue(1.65),
          }
        } else {
          return {
            interpolatedEle: new InterpolatedValue(-7.2, 10, 0, 1, 1),
            interpolatedHue: new InterpolatedValue(0.00, 0.25, 0.50, 0.85, 1),
            interpolatedSat: new FixedValue(1.00),
            interpolatedVal: new FixedValue(0.50),
            interpolatedInt: new FixedValue(1.25),
          }
        }
      },
      constructDataset: dataRoot => new DatasetGeneric(dataRoot, FormattingDefinition.FORMATTER_PERCENT),
      seriesVisibilities: {}
    },
    {
      id: 'i_prv',
      thema: 'HOSPITALIZATION',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Intensivstation',
      desc: 'Bundesland',
      copy: 'https://www.data.gv.at/covid-19/',
      formatter: FormattingDefinition.FORMATTER_PERCENT,
      label00: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      label07: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      // valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
      onLogarithmicChange: () => { },
      doExport: false,
      logarithmic: false,
      fold: 'open-horizontal',
      source: './hexmap-data-04-hospitalizazion-icu.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      getRendererProps: (index: number, name: string) => {
        return {
          interpolatedEle: new InterpolatedValue(-5, 20, 0, 0.5, 1),
          interpolatedHue: {
            getOut: (val: number) => {
              if (val < 0.1) {
                return 0.33; // green
              } else if (val < 0.25) {
                return 0.17; // yellow
              } else if (val < 0.33) {
                return 0.08; // orange
              } else {
                return 0.00; // red
              }
            }
          },
          interpolatedSat: new FixedValue(1.00),
          interpolatedVal: new FixedValue(0.40),
          interpolatedInt: new FixedValue(1.25),
        }

      },
      constructDataset: dataRoot => new DatasetGeneric(dataRoot, FormattingDefinition.FORMATTER_PERCENT),
      seriesVisibilities: {}
    },
    {
      id: 'h_prv',
      thema: 'HOSPITALIZATION',
      instant: -1,
      instantMin: -1,
      instantMax: -1,
      instantDif: TimeUtil.MILLISECONDS_PER____DAY,
      name: 'Normalstation',
      desc: 'Bundesland',
      copy: 'https://www.data.gv.at/covid-19/',
      formatter: FormattingDefinition.FORMATTER_PERCENT,
      label00: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      label07: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
      // valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
      onExpand: () => { },
      onInstantChange: () => { },
      onInstantRangeChange: () => { },
      onExport: () => { },
      onSeriesVisibilityChange: () => { },
      onLogarithmicChange: () => { },
      doExport: false,
      logarithmic: false,
      fold: 'closed',
      source: './hexmap-data-05-hospitalizazion-reg.json',
      loaded: false,
      path: '',
      breadcrumbProps: [],
      getRendererProps: (index: number, name: string) => {
        return {
          interpolatedEle: new InterpolatedValue(-5, 20, 0, 0.5, 1),
          interpolatedHue: {
            getOut: (val: number) => {
              if (val < 0.06) {
                return DataRepository.interpolatedHueRg04.getOut(val); // green up to 0.03, gradient to 0.05, then yellq
              } else if (val < 0.095) {
                return DataRepository.interpolatedHueRg08.getOut(val); // yellow up to 0.07, gradient to 0.09, then orange
              } else {
                return DataRepository.interpolatedHueRg11.getOut(val); // orange up to 0.10, gradient to 0.12, then red
              }
            }
          },
          interpolatedSat: new FixedValue(1.00),
          interpolatedVal: new FixedValue(0.40),
          interpolatedInt: new FixedValue(1.25),
        }
      },
      constructDataset: dataRoot => new DatasetGeneric(dataRoot, FormattingDefinition.FORMATTER_PERCENT),
      seriesVisibilities: {}
    }

  ];

  static readonly MISCALLANEOUS___INDICATOR_PROPS: IIndicatorProps[] = [

  ];

  // static readonly ALL_INDICATOR_PROPS: IIndicatorProps[] = [
  //   ...this.INCIDENCE_______INDICATOR_PROPS,
  //   ...this.VACCINATION_____INDICATOR_PROPS,
  //   ...this.HOSPITALIZATION_INDICATOR_PROPS,
  //   ...this.MISCALLANEOUS___INDICATOR_PROPS,
  // ];

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
    const rawCount = dataSetting.getDataset().getIndexKeyset().getRawCount();

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

        for (let rawIndex = 0; rawIndex < rawCount; rawIndex++) {

          if (chartEntry[rawIndex] !== 0) {

            const indexName = dataSetting.getDataset().getIndexKeyset().getValue(rawIndex.toString());

            let valueY = dataEntry.getValue(dataPointer, rawIndex);
            if (dataSetting.getDataset().acceptsZero(rawIndex) || valueY.value > 0) {
              chartEntry[`value_${rawIndex}`] = valueY.value;
              chartEntry[`label_${rawIndex}`] = valueY.label();
            }
            maxY = Math.max(maxY, valueY.value);

          }

        }
        entries.push(chartEntry);

      }

    });

    return {
      entries,
      valueCount: rawCount,
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
      const indicatorProps = DataRepository.INDICATOR_PROPS.find(p => p.source === source);
      const dataset = indicatorProps.constructDataset(dataRoot);
      this.dataSettings[source] = new DataSetting(dataset);
    }
    return this.dataSettings[source];
  }

}