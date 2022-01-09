import { useEffect, useState } from 'react';
import ChartComponent from './components/ChartComponent';
import { IBreadcrumbProps } from './components/IBreadcrumbProps';
import { IChartProps } from './components/IChartProps';
import { IHexagonsProps } from './components/IHexagonsProps';
import { IHexagonState } from './components/IHexagonState';
import { INDICATOR_PROPS_FOLD } from './components/IIndicatorProps';
import { IInstantProps } from './components/IInstantProps';
import { ILegendProps } from './components/ILegendProps';
import { IMapProps } from './components/IMapProps';
import { IUserInterfaceProps } from './components/IUserInterfaceProps';
import MapComponent from './components/MapComponent';
import UserInterfaceComponent from './components/UserInterfaceComponent';
import { DataRepository } from './data/DataRepository';
import { HexagonRepository } from './data/HexagonRepository';
import { IAppState } from './IAppState';
import { Color } from './util/Color';
import { ColorUtil } from './util/ColorUtil';
import { FixedValue } from './util/FixedValue';
import { FormattingDefinition } from './util/FormattingDefinition';
import { InterpolatedValue } from './util/InterpolatedValue';
import { ObjectUtil } from './util/ObjectUtil';
import { TimeUtil } from './util/TimeUtil';

export default () => {

  /**
   * handles changes originating from either date-slider or data-picker
   * updates all property instances holding an instant
   * TODO :: think about a central place to have instant (but then how could component update be triggered individually)
   * 
   * @param source 
   * @param instant 
   */
  const handleInstantChange = async (instant: number) => {

    console.log('📞 handling instant change', instant);

    const dataSettings = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
    dataSettings.setInstant(instant);

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: true,
        updateLight: true,
        updateDelay: 250
      }
    });

  }

  const handleHexagonsLoaded = () => {

    console.log('📞 handling hexagons loaded');

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: true,
        updateLight: true,
        updateDelay: 250
      }
    });

  }

  const handleDataLoaded = (source: string) => {

    console.log('📞 handling data loaded', source);
    userInterfaceProps.indicatorProps.find(p => p.source === source).loaded = true;

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: false,
        updateLight: false,
        updateDelay: 250
      }
    });

  }

  const handleIndicatorExpand = async (id: string) => {

    console.log('📞 handling indicator fold', id);

    const indicatorProps = userInterfaceProps.indicatorProps.find(p => p.id === id);
    const isSourceChange = indicatorProps.source !== appState.source;
    let fold: INDICATOR_PROPS_FOLD = appState.fold === 'open-horizontal' ? 'open-vertical' : 'open-horizontal'
    if (isSourceChange) {

      fold = 'open-horizontal';

      // get previous settings
      const prevSettings = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
      // get the settings that we are about to switch to
      const nextSettings = await DataRepository.getInstance().getOrLoadDataSetting(indicatorProps.source);

      // validate instant and apply
      nextSettings.setInstant(prevSettings.getInstant());

    }

    setAppState({
      ...appState,
      source: indicatorProps.source,
      // instant: DataRepository.getInstance().clampInstant(source1, appState.instant),
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: isSourceChange,
        updateLight: isSourceChange,
        updateDelay: 350
      },
      fold
    });

  }

  const [exportableChart, setExportableChart] = useState<IChartProps>();
  const handleIndicatorExport = async (id: string) => {

    console.log('📞 handling indicator export', id);

    const exportableChartProps = userInterfaceProps.indicatorProps.find(p => p.id === id);

    // console.log('exportableChartProps', exportableChartProps);

    // setAppState({
    //   ...appState,
    //   source: indicatorProps.source,
    //   // instant: DataRepository.getInstance().clampInstant(source1, appState.instant),
    //   action: {
    //     stamp: ObjectUtil.createId(),
    //     updateScene: false,
    //     updateLight: false,
    //     updateDelay: 0
    //   }
    // });

    setExportableChart({
      ...exportableChartProps,
      id: ObjectUtil.createId(),
      doExport: true
    });
    
  }

  const handleIndxChange = async (source: string, name: string, indexRaw: string) => {

    console.log('📞 handling index change', source, name, indexRaw);

    const dataSettings = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
    dataSettings.setIndex(parseInt(indexRaw));

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: true,
        updateLight: true,
        updateDelay: 250
      },
    });

  }

  const handlePathChange = async (source: string, name: string, path: string) => {

    console.log('📞 handling path change', source, name, path);

    const dataSettings = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
    dataSettings.setPath(name, path);

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: true,
        updateLight: true,
        updateDelay: 0
      },
    });

  };

  const interpolatedEle7di5 = new InterpolatedValue(0, 80, 0, 20000, 1.00);
  const interpolatedEle7di3 = new InterpolatedValue(0, 80, 0, 14000, 1.00);
  const interpolatedEle7di1 = new InterpolatedValue(0, 80, 0, 8000, 1.00);
  const interpolatedHue7di5 = new InterpolatedValue(0.25, -0.01, 0, 5000, 0.33);
  const interpolatedHue7di3 = new InterpolatedValue(0.25, -0.01, 0, 3500, 0.33);
  const interpolatedHue7di1 = new InterpolatedValue(0.25, -0.01, 0, 2000, 0.33);

  const instant = TimeUtil.parseCategoryDateFull(TimeUtil.formatCategoryDateFull(Date.now()));
  const [userInterfaceProps, setUserInterfaceProps] = useState<IUserInterfaceProps>({
    onDataPicked: handleIndicatorExpand,
    indicatorProps: [
      // {
      //   id: 'i_sbg',
      //   date: '',
      //   name: 'Inzidenz',
      //   desc: 'Salzburger Gemeinden',
      //   value00: '',
      //   value07: '',
      //   valueFormatter: FormattingDefinition.FORMATTER____FIXED,
      //   onExpand: handleIndicatorExpand,
      //   onExport: handleIndicatorExport,
      //   fold: 'open-horizontal',
      //   source: './hexmap-data-salzburg-gemeinde.json',
      //   loaded: false,
      //   path: '',
      //   breadcrumbProps: [],
      //   interpolatedEle: interpolatedEle7di5,
      //   interpolatedHue: interpolatedHue7di5,
      //   interpolatedSat: new FixedValue(1.00),
      //   interpolatedVal: new FixedValue(0.40),
      //   chartProps: {
      //     id: 'i_sbg',
      //     title: '7-Tages Inzidenz',
      //     source: './hexmap-data-salzburg-gemeinde.json',
      //     path: '',
      //     valueFormatter: FormattingDefinition.FORMATTER____FIXED,
      //     fold: 'open-horizontal',
      //     onInstantChange: handleInstantChange
      //   }
      // },
      {
        id: 'i_ems',
        date: '##.##.####',
        name: 'Inzidenz',
        desc: 'EMS',
        value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
        value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        onInstantChange: handleInstantChange,
        onExport: handleIndicatorExport,
        doExport: false,
        fold: 'open-horizontal',
        source: './hexmap-data-ems.json',
        loaded: false,
        path: '',
        breadcrumbProps: [],
        interpolatedEle: interpolatedEle7di1,
        interpolatedHue: interpolatedHue7di1,
        interpolatedSat: new FixedValue(1.00),
        interpolatedVal: new FixedValue(0.40)
      },
      {
        id: 'i_paa',
        date: '##.##.####',
        name: 'Inzidenz',
        desc: 'Bundesland und Alter',
        value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
        value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        onInstantChange: handleInstantChange,
        onExport: handleIndicatorExport,
        doExport: false,
        fold: 'closed',
        source: './hexmap-data-bundesland-alter.json',
        loaded: false,
        path: '',
        breadcrumbProps: [],
        interpolatedEle: interpolatedEle7di1,
        interpolatedHue: interpolatedHue7di1,
        interpolatedSat: new FixedValue(1.00),
        interpolatedVal: new FixedValue(0.40)
      },
      {
        id: 'i_dst',
        date: '##.##.####',
        name: 'Inzidenz',
        desc: 'Bezirk',
        value00: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
        value07: FormattingDefinition.FORMATTER____FIXED.format(1111).replaceAll('1', '#'),
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        onInstantChange: handleInstantChange,
        onExport: handleIndicatorExport,
        doExport: false,
        fold: 'closed',
        source: './hexmap-data-bundesland-bezirk.json',
        loaded: false,
        path: '',
        breadcrumbProps: [],
        interpolatedEle: interpolatedEle7di3,
        interpolatedHue: interpolatedHue7di3,
        interpolatedSat: new FixedValue(1.00),
        interpolatedVal: new FixedValue(0.40)
      },
      {
        id: 'v_mnc',
        date: '##.##.####',
        name: 'Impfung',
        desc: 'Gemeinde',
        value00: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
        value07: FormattingDefinition.FORMATTER_PERCENT.format(0.1111).replaceAll('1', '#'),
        valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
        onExpand: handleIndicatorExpand,
        onInstantChange: handleInstantChange,
        onExport: handleIndicatorExport,
        doExport: false,
        fold: 'closed',
        source: './hexmap-data-vacc-gemeinde.json',
        loaded: false,
        path: '',
        breadcrumbProps: [],
        interpolatedEle: new InterpolatedValue(-10, 20, 0.00, 1.00, 1),
        interpolatedHue: new InterpolatedValue(0.00, 0.25, 0.5, 0.9, 1),
        interpolatedSat: new FixedValue(1.00),
        interpolatedVal: new FixedValue(0.40)
      }
    ],
    navigationBotProps: {
      instantProps: {
        instantCur: instant,
        instantMin: TimeUtil.parseCategoryDateFull('01.03.2020'),
        instantMax: instant,
        onInstantChange: handleInstantChange
      }
    }
  });

  const [updateMapTo, setUpdateMapTo] = useState<number>(-1);
  const [mapProps, setMapProps] = useState<IMapProps>({
    lightProps: [
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        position: {
          x: 300,
          y: 200,
          z: -300
        },
        shadowEnabled: true
      },
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        position: {
          x: -300,
          y: 200,
          z: -150
        },
        shadowEnabled: true
      }
    ],
    controlsProps: {
      id: ObjectUtil.createId(),
      stamp: ObjectUtil.createId(),
      instant,
      onInstantChange: handleInstantChange
    },
    hexagonProps: {
      source: '',
      name: '',
      keys: [],
      path: '',
      stamp: ObjectUtil.createId(),
      onPathChange: handlePathChange,
      getState: (values) => {
        return {
          color: ColorUtil.getCorineColor(values.luc),
          height: values.ele
        }
      },
      getPath: (values) => values.gkz,
      onHexagonsLoaded: handleHexagonsLoaded
    },
    labelProps: [
      {
        id: ObjectUtil.createId(),
        label: '',
        size: 5,
        position: {
          x: -202,
          y: 0.3,
          z: -8
        },
        rotationY: 0
      },
      {
        id: ObjectUtil.createId(),
        label: '',
        size: 7,
        position: {
          x: -202,
          y: 0.3,
          z: 4
        },
        rotationY: 0
      },
      {
        id: ObjectUtil.createId(),
        label: '',
        size: 4,
        position: {
          x: -202,
          y: 0.3,
          z: -25.5
        },
        rotationY: 0
      },
      {
        id: ObjectUtil.createId(),
        label: '',
        size: 4,
        position: {
          x: -118,
          y: 0.3,
          z: -25.5
        },
        rotationY: 0
      }
    ],
    legendLabelProps: {
      title: {
        id: ObjectUtil.createId(),
        label: 'Legende',
        size: 4,
        position: {
          x: -202,
          y: 0.3,
          z: -100.2
        },
        rotationY: 0
      },
      min: {
        id: ObjectUtil.createId(),
        label: '0',
        size: 6,
        position: {
          x: -247,
          y: 0.3,
          z: -88.2
        },
        rotationY: 0
      },
      max: {
        id: ObjectUtil.createId(),
        label: '0',
        size: 6,
        position: {
          x: -80,
          y: 0.3,
          z: -88.2
        },
        rotationY: 0
      }
    },
    courseLabelProps: {
      title: {
        id: ObjectUtil.createId(),
        label: 'Verlauf',
        size: 4,
        position: {
          x: -202,
          y: 0.3,
          z: -48.5
        },
        rotationY: 0
      },
      min: {
        id: ObjectUtil.createId(),
        label: '0',
        size: 6,
        position: {
          x: -247,
          y: 0.3,
          z: -36.5
        },
        rotationY: 0
      },
      max: {
        id: ObjectUtil.createId(),
        label: '0',
        size: 6,
        position: {
          x: -80,
          y: 0.3,
          z: -36.5
        },
        rotationY: 0
      }
    },
    hyperlinkProps: [
      {
        id: ObjectUtil.createId(),
        label: 'https://www.data.gv.at/covid-19/', // 'https://fitforfire.github.io/covid-sbg/#/', // 
        size: 3,
        position: {
          x: -202,
          y: 0.3,
          z: 11
        },
        rotationY: 0,
        href: 'https://www.data.gv.at/covid-19/'
      },
      {
        id: ObjectUtil.createId(),
        label: '@FleischerHannes',
        size: 3,
        position: {
          x: -202,
          y: 0.3,
          z: 17
        },
        rotationY: 0,
        href: 'https://twitter.com/FleischerHannes'
      }
    ]
  });

  const [updateDimensionsTo, setUpdateDimensionsTo] = useState<number>(-1);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const handleResize = () => {
    window.clearTimeout(updateDimensionsTo);
    setUpdateDimensionsTo(window.setTimeout(() => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 250));
  }

  useEffect(() => {
    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: false,
        updateLight: false,
        updateDelay: 250
      },
    });
  }, [dimensions]);


  const indicatorProps = userInterfaceProps.indicatorProps[0];
  const [appState, setAppState] = useState<IAppState>({
    source: indicatorProps.source,
    action: {
      stamp: ObjectUtil.createId(),
      updateScene: false,
      updateLight: false,
      updateDelay: 1000
    },
    fold: indicatorProps.fold
  });


  useEffect(() => {

    console.log('🔄 updating app');

    // const refEle = 0;

    /**
     * update instant props with current source
     * this is done so the date-slider and date-picker components can call back with the current source
     * and could probably also be solved by putting source on state in this component
     */
    const instantProps: IInstantProps = {
      ...userInterfaceProps.navigationBotProps.instantProps,
      onInstantChange: handleInstantChange
    }

    // const promises: Promise<IDataSetting>[] = userInterfaceProps.indicatorProps.map(props => DataRepository.getInstance().getOrLoadDataSetting(props.source));
    // Promise.all(promises).then(allSettings => {

    const _labelProps = mapProps.labelProps.map(props => {
      return {
        ...props,
        label: ''
      }
    });
    const _legendLabelProps: ILegendProps = {
      ...mapProps.legendLabelProps,
      min: { ...mapProps.legendLabelProps.min },
      max: { ...mapProps.legendLabelProps.max },
    }
    const _courseLabelProps: ILegendProps = {
      ...mapProps.courseLabelProps,
      min: { ...mapProps.courseLabelProps.min },
      max: { ...mapProps.courseLabelProps.max },
    }
    let _hexagonProps: IHexagonsProps = {
      ...mapProps.hexagonProps
    };

    for (let i = 0; i < userInterfaceProps.indicatorProps.length; i++) {
      const indicatorPropsInstance = userInterfaceProps.indicatorProps[i];
      const dataSetting = DataRepository.getInstance().getDataSetting(indicatorPropsInstance.source);
      const selected = indicatorPropsInstance.source === appState.source;
      if (dataSetting && selected) {
        instantProps.instantCur = dataSetting.getInstant();
      }
    }
    let mapKeys: string[] = [];

    for (let i = 0; i < userInterfaceProps.indicatorProps.length; i++) {

      const indicatorPropsInstance = userInterfaceProps.indicatorProps[i];
      const dataSetting = DataRepository.getInstance().getDataSetting(indicatorPropsInstance.source);

      if (dataSetting) {

        // console.log('data', userInterfaceProps.indicatorProps[i].source, data.path)

        const selected = indicatorPropsInstance.source === appState.source;

        // current instant (closest to date slider date - and date slider will be move to that instant upon update)
        const clampedInstant00 = dataSetting.getDataset().getValidInstant(instantProps.instantCur);

        // one week offset (for "vorwoche" value)
        const clampedInstant07 = dataSetting.getDataset().getValidInstant(clampedInstant00 - TimeUtil.MILLISECONDS_PER___WEEK);

        // ~ 2 month back (for the history hexagon slot)
        const clampedInstant60 = dataSetting.getDataset().getValidInstant(clampedInstant00 - TimeUtil.MILLISECONDS_PER____DAY * 60);

        // dataSetting.date = TimeUtil.formatCategoryDateFull(clampedInstant00);

        /**
         * set up breadcrumbs to show options of current indicator
         */
        const breadcrumbProps: IBreadcrumbProps[] = [];

        const keysetKeys = dataSetting.getDataset().getKeysetKeys();;
        if (selected) {
          _labelProps[0].label = indicatorPropsInstance.name + ' nach ' + indicatorPropsInstance.desc;
        }
        let label1 = '';

        let prefKey: string = '';
        let postKey: string = '';
        for (let i = 0; i < keysetKeys.length; i++) {

          const keysetKey = keysetKeys[i];
          const keyset = dataSetting.getDataset().getKeyset(keysetKey);
          const path = dataSetting.getPath(keysetKey);

          if (i === 0) {
            prefKey = path; // i.e. '9' - Vienna as province/Bundesland, '900' - Vienna as district/Bezirk
            if (selected) {
              label1 += dataSetting.getDataset().getKeyset(keysetKey).getValue(prefKey);
            }
          } else {
            postKey += path;
            if (selected) {
              label1 += ' / ' + dataSetting.getDataset().getKeyset(keysetKey).getValue(postKey);
            }
          }

          if (selected) {

            mapKeys = keyset.getRaws();

            /**
             * the path refers to subset (if there is subsets)
             * therefore the top crumbs needs to be adapted
             */
            let validPath = path;
            keyset.getKeys().forEach(key => {
              if (path.startsWith(key.replaceAll('#', ''))) { // includes #####, but will match 
                validPath = key;
              }
            });

            // console.log('crumbs (top)', path, prefKey, validPath, keyset);

            breadcrumbProps.push({
              source: appState.source,
              name: keysetKey,
              keys: keyset,
              path: validPath,
              onPathChange: handlePathChange,
            });

            if (keyset.hasSubset(validPath)) {

              const subset = keyset.getSubset(validPath);
              let validSubpath = path;
              // if (path.indexOf('#') >= 0) {
              //   mapKeys = keyset.getKeys();
              // } else {
              //   mapKeys = subset.getKeys();
              // }
              // console.log('mapKeys', mapKeys);

              // console.log('crumbs (sub)', path, prefKey, validSubpath, subset, mapKeys);
              breadcrumbProps.push({
                source: appState.source,
                name: keysetKey,
                keys: subset,
                path: validSubpath,
                onPathChange: handlePathChange,
              });

            };

          }

        };

        const indexKeyset = dataSetting.getDataset().getIndexKeyset();
        const indexSizeFiltered = indexKeyset.getKeys().filter(k => indexKeyset.getValue(k) !== DataRepository.FAELLE).length;
        if (indexSizeFiltered > 1) {

          if (selected) {
            label1 += ' / ' + indexKeyset.getValue(dataSetting.getIndex().toString());
          }

          const path = dataSetting.getIndex().toString();
          breadcrumbProps.push({
            source: appState.source,
            name: 'index',
            keys: indexKeyset,
            path,
            onPathChange: handleIndxChange,
          });

        }

        if (selected) {
          _labelProps[1].label = label1;
        }

        let minLegendVal = Number.MAX_VALUE;
        let maxLegendVal = Number.MIN_VALUE;
        if (selected) {

          _labelProps[2].label = TimeUtil.formatCategoryDateFull(clampedInstant60);
          _labelProps[3].label = TimeUtil.formatCategoryDateFull(clampedInstant00);

          const entry00 = dataSetting.getDataset().getEntryByInstant(dataSetting.getInstant()); // dataSetting.data[dataSetting.date]; // TimeUtil.formatCategoryDateFull(clampedInstant00)

          // console.log('areaPointer', prefPointer, postPointer);
          /**
           * find min and max values referring to the map display date
           */
          entry00.getKeys().forEach(key => {
            if (key.endsWith(postKey)) {
              minLegendVal = Math.min(minLegendVal, entry00.getValue(key, dataSetting.getIndex()));
              maxLegendVal = Math.max(maxLegendVal, entry00.getValue(key, dataSetting.getIndex()));
            }
          });

          _legendLabelProps.min.label = indicatorPropsInstance.valueFormatter.format(minLegendVal).padStart(8, ' '); // right align by padding monospaced text
          _legendLabelProps.max.label = indicatorPropsInstance.valueFormatter.format(maxLegendVal);

          const entry60 = dataSetting.getDataset().getEntryByInstant(clampedInstant60); // dataSetting.data[TimeUtil.formatCategoryDateFull(clampedInstant60)];
          const minCourseVal = entry60.getValue(prefKey + postKey, dataSetting.getIndex());
          const maxCourseVal = entry00.getValue(prefKey + postKey, dataSetting.getIndex());

          _courseLabelProps.min.label = indicatorPropsInstance.valueFormatter.format(minCourseVal).padStart(8, ' '); // right align by padding monospaced text
          _courseLabelProps.max.label = indicatorPropsInstance.valueFormatter.format(maxCourseVal);

        }

        const getColor = (value: number) => {
          const h = indicatorPropsInstance.interpolatedHue.getOut(value);
          const s = indicatorPropsInstance.interpolatedSat.getOut(value);
          const v = indicatorPropsInstance.interpolatedVal.getOut(value);
          return new Color(h, s, v);
        }

        // console.log('data', data, );
        const valueKey = prefKey + postKey;
        const entry00 = dataSetting.getDataset().getEntryByInstant(clampedInstant00); // dataSetting.data[TimeUtil.formatCategoryDateFull(clampedInstant00)];
        const entry07 = dataSetting.getDataset().getEntryByInstant(clampedInstant07);
        const value00 = entry00.getValue(valueKey, dataSetting.getIndex()); // dataset00[dataPointer][dataSetting.indx];
        const valueM7 = entry07.getValue(valueKey, dataSetting.getIndex());
        const value07 = (value00 - valueM7) / valueM7;
        if (selected) {
          userInterfaceProps.indicatorProps[i] = {
            ...indicatorPropsInstance,
            value00: indicatorPropsInstance.valueFormatter.format(value00),
            value07: FormattingDefinition.FORMATTER_PERCENT.format(value07),
            breadcrumbProps: breadcrumbProps,
            path: valueKey,
            fold: appState.fold,
            date: TimeUtil.formatCategoryDateFull(clampedInstant00),
            onExpand: handleIndicatorExpand,
            onExport: handleIndicatorExport,
            onInstantChange: handleInstantChange
          };
        } else {
          userInterfaceProps.indicatorProps[i] = {
            ...indicatorPropsInstance,
            value00: indicatorPropsInstance.valueFormatter.format(value00),
            value07: FormattingDefinition.FORMATTER_PERCENT.format(value07),
            fold: 'closed',
            date: TimeUtil.formatCategoryDateFull(clampedInstant00),
            onExpand: handleIndicatorExpand,
            onExport: handleIndicatorExport,
            onInstantChange: handleInstantChange
          };

        }

        const defaultState = {
          color: new Color(0, 0, 0),
          height: 0
        };

        if (selected) {

          // performance
          const valueLookup: { [K in string]: IHexagonState } = {};

          // console.log(TimeUtil.formatCategoryDateFull(clampedInstant60), '-', TimeUtil.formatCategoryDateFull(clampedInstant00))

          _hexagonProps = {
            // onHover: setHovered,
            source: appState.source,
            name: keysetKeys[0],
            keys: mapKeys,
            path: prefKey,
            onPathChange: handlePathChange,
            stamp: appState.action.updateScene ? ObjectUtil.createId() : mapProps.hexagonProps.stamp,
            getPath: (values) => {
              return values.gkz.substring(0, prefKey.length);
            },
            getState: (hexagon) => {
              let ele = hexagon.ele / 2 - 7.5;
              if (hexagon.luc === 0) {
                let lookupState = valueLookup['l' + hexagon.x];
                if (!lookupState) {
                  const legendFraction = HexagonRepository.getInstance().getLegendFraction(hexagon);
                  const val = minLegendVal + (maxLegendVal - minLegendVal) * legendFraction;
                  lookupState = {
                    color: getColor(val),
                    height: indicatorPropsInstance.interpolatedEle.getOut(val)
                  }
                  valueLookup['l' + hexagon.x] = lookupState;
                }
                return {
                  color: lookupState.color,
                  height: lookupState.height + ele
                }
              } else if (hexagon.luc === 1) { // 3d-chart
                const legendFraction = HexagonRepository.getInstance().getLegendFraction(hexagon);
                let lookupState = valueLookup['c' + hexagon.x];
                if (!lookupState) {
                  const historicInstant = dataSetting.getDataset().getValidInstant(clampedInstant60 + (clampedInstant00 - clampedInstant60) * legendFraction);
                  // console.log('building', 'c' + hexagon.x, legendFraction.toFixed(3), TimeUtil.formatCategoryDateFull(historicInstant));
                  const historicEntry = dataSetting.getDataset().getEntryByInstant(historicInstant);
                  if (historicEntry.hasKey(prefKey + postKey)) {
                    lookupState = {
                      color: getColor(historicEntry.getValue(prefKey + postKey, dataSetting.getIndex())),
                      height: indicatorPropsInstance.interpolatedEle.getOut(historicEntry.getValue(prefKey + postKey, dataSetting.getIndex()))
                    }
                  } else {
                    lookupState = {
                      color: Color.DARK_GREY,
                      height: 0
                    }
                  }
                  valueLookup['c' + hexagon.x] = lookupState;
                }
                return {
                  color: lookupState.color,
                  height: lookupState.height + ele
                }
              } else {
                let lookupState = valueLookup[hexagon.gkz];
                if (!lookupState) {
                  const _prefKey = hexagon.gkz.substring(0, prefKey.length)
                  const dataKey = _prefKey + postKey;
                  const entry00 = dataSetting.getDataset().getEntryByInstant(dataSetting.getInstant()); // .data[dataSetting.date];
                  if (entry00.hasKey(dataKey)) {
                    lookupState = {
                      color: getColor(entry00.getValue(dataKey, dataSetting.getIndex())),
                      height: indicatorPropsInstance.interpolatedEle.getOut(entry00.getValue(dataKey, dataSetting.getIndex()))
                    }
                  } else {
                    return defaultState;
                  }
                  valueLookup[hexagon.gkz] = lookupState;
                }
                return {
                  color: lookupState.color,
                  height: lookupState.height + ele
                }
              }

            },
            onHexagonsLoaded: handleHexagonsLoaded
          }

        }

      }

    };

    /**
     * actual update of user interface props
     */
    setUserInterfaceProps({
      ...userInterfaceProps,
      // userInterfaceProps.indicatorProps,
      navigationBotProps: {
        ...userInterfaceProps.navigationBotProps,
        instantProps
      },
      onDataPicked: handleIndicatorExpand,
    });

    /**
    * update instant on control props
    */
    const _controlProps = {
      ...mapProps.controlsProps,
      instant: instantProps.instantCur,
      stamp: appState.action.updateScene ? ObjectUtil.createId() : mapProps.controlsProps.stamp,
      onInstantChange: handleInstantChange
    }


    /**
    * update stamps on all lights (triggering a shadow update)
    */
    const _lightPropsFast = mapProps.lightProps.map(props => {
      return {
        ...props,
        stamp: appState.action.updateLight ? ObjectUtil.createId() : props.stamp,
        shadowEnabled: false
      }
    });
    const _lightPropsSlow = mapProps.lightProps.map(props => {
      return {
        ...props,
        stamp: appState.action.updateLight ? ObjectUtil.createId() : props.stamp,
        shadowEnabled: true
      }
    });

    if (appState.action.updateDelay > 0) {
      setMapProps({
        ...mapProps,
        labelProps: _labelProps,
        legendLabelProps: _legendLabelProps,
        courseLabelProps: _courseLabelProps,
        hexagonProps: _hexagonProps,
        lightProps: _lightPropsFast,
        controlsProps: _controlProps
      });
    }

    // console.log('selectedE', selected1);
    /**
    * set map-props in way that will cause the map to pick up current data, triggers re-rendering by changing the id of the properties (a useEffect method listens for this)
    */
    window.clearTimeout(updateMapTo);
    setUpdateMapTo(window.setTimeout(() => {
      setMapProps({
        ...mapProps,
        labelProps: _labelProps,
        legendLabelProps: _legendLabelProps,
        courseLabelProps: _courseLabelProps,
        hexagonProps: _hexagonProps,
        lightProps: _lightPropsSlow,
        controlsProps: _controlProps
      });
    }, appState.action.updateDelay));

    // });

  }, [appState]);

  useEffect(() => {

    console.log('✨ building app component');
    window.addEventListener('resize', handleResize);

    let delay = 1;
    userInterfaceProps.indicatorProps.forEach(props => {
      setTimeout(() => {
        DataRepository.getInstance().getOrLoadDataSetting(props.source).then(dataSetting => {
          handleDataLoaded(props.source)
        });
      }, delay);
      delay += 500;
    });

  }, []);

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
      {
        exportableChart ? <ChartComponent key={ObjectUtil.createId()} {...exportableChart} style={{ width: '1200px', height: '675px' }} /> : null
      }
    </div>
  );

};

