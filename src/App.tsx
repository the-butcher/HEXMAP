import { useEffect, useRef, useState } from 'react';
import * as three from 'three';
import ChartComponent from './components/ChartComponent';
import { IBreadcrumbProps } from './components/IBreadcrumbProps';
import { IChartProps } from './components/IChartProps';
import { IHexagonsProps, ViewOrientation } from './components/IHexagonsProps';
import { IHexagonState } from './components/IHexagonState';
import { IIndicatorProps, IndicatorPropsFold } from './components/IIndicatorProps';
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
import { FormattingDefinition } from './util/FormattingDefinition';
import { ObjectUtil } from './util/ObjectUtil';
import { TimeUtil } from './util/TimeUtil';

import { library } from '@fortawesome/fontawesome-svg-core' //allows later to just use icon name to render-them
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'

library.add(fas, faCheckSquare, faCoffee)

export default () => {

  const fracTo = useRef<number>(-1);
  const [fracstamp, setFracstamp] = useState<number>(-1);

  const handleScreenshotRequested = () => {

    console.debug('📞 handling screenshot requested');

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: false,
        updateLight: false,
        updateDelay: 0
      }
    });

  }


  /**
   * handles changes originating from either date-slider or data-picker
   * updates all property instances holding an instant
   * TODO :: think about a central place to have instant (but then how could component update be triggered individually)
   * 
   * @param source 
   * @param instant 
   */
  const handleInstantChange = async (instant: number) => {

    console.debug('📞 handling instant change', TimeUtil.formatCategoryDateFull(instant));

    const dataSetting = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
    dataSetting.setInstant(instant);

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: true,
        updateLight: true,
        updateDelay: 10
      }
    });

  }

  const handleViewChange = async (view: ViewOrientation) => {

    console.debug('📞 handling view change', view);

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: false,
        updateLight: false,
        updateDelay: 10
      },
      view
    });

  }

  const handleLogarithmicChange = async (logarithmic: boolean) => {

    console.debug('📞 handling logarithmic change', logarithmic);

    const dataSetting = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
    const userInterfaceProp = DataRepository.INDICATOR_PROPS.find(p => p.source === appState.source);
    userInterfaceProp.logarithmic = logarithmic;

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

  const handleSeriesVisibiltyChange = async (name: string, visibility: boolean) => {

    console.debug('📞 handling series visibility change', name, visibility);

    const dataSetting = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
    const userInterfaceProp = DataRepository.INDICATOR_PROPS.find(p => p.source === appState.source);
    userInterfaceProp.seriesVisibilities[name] = visibility;

    // setAppState({
    //   ...appState,
    //   action: {
    //     stamp: ObjectUtil.createId(),
    //     updateScene: false,
    //     updateLight: false,
    //     updateDelay: 250
    //   }
    // });

  }

  const handleInstantRangeChange = async (instantMin: number, instantMax: number) => {

    console.debug('📞 handling instant range change', TimeUtil.formatCategoryDateFull(instantMin), TimeUtil.formatCategoryDateFull(instantMax), appState.source);

    // const dataSetting = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
    const userInterfaceProp = DataRepository.INDICATOR_PROPS.find(p => p.source === appState.source);
    if (instantMin) {
      // dataSetting.setInstantMin(instantMin);
      userInterfaceProp.instantMin = instantMin;
    }
    if (instantMax) {
      // dataSetting.setInstantMax(instantMax);
      userInterfaceProp.instantMax = instantMax;
    }

    // setAppState({
    //   ...appState,
    //   action: {
    //     stamp: ObjectUtil.createId(),
    //     updateScene: false,
    //     updateLight: false,
    //     updateDelay: 250
    //   }
    // });

  }


  const handleHexagonsLoaded = () => {

    console.debug('📞 handling hexagons loaded');

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

  const loadThema = (thema: string) => {

    const indicatorProps = DataRepository.INDICATOR_PROPS.filter(p => p.thema === thema);
    let delay = 1;
    indicatorProps.filter(p => !p.loaded).forEach(props => {
      setTimeout(() => {
        DataRepository.getInstance().getOrLoadDataSetting(props.source).then(dataSetting => {

          console.debug('📞 handling props loaded', props.source);
          props.loaded = true;
          props.instantMin = TimeUtil.parseCategoryDateFull('01.12.2021');
          props.instantMax = dataSetting.getDataset().getInstantMax();

          // console.log(TimeUtil.formatCategoryDateFull(props.instantMin), TimeUtil.formatCategoryDateFull(props.instantMax));

          setAppState({
            ...appState,
            action: {
              stamp: ObjectUtil.createId(),
              updateScene: true,
              updateLight: true,
              updateDelay: 250
            },
            thema: props.thema
          });


        });
      }, delay);
      delay += 2000;
    });

  }



  const handleIndicatorExpand = async (id: string) => {

    const indicatorProps = DataRepository.INDICATOR_PROPS.find(p => p.id === id);
    const isSourceChange = indicatorProps.source !== appState.source;

    console.debug('📞 handling indicator fold', id, appState.source, ' >> ', indicatorProps.source);

    let fold: IndicatorPropsFold = indicatorProps.fold === 'open-horizontal' ? 'open-vertical' : 'open-horizontal'
    if (isSourceChange) {

      fold = 'open-horizontal';


      // get previous settings
      const prevSettings = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
      // get the settings that we are about to switch to
      const nextSettings = await DataRepository.getInstance().getOrLoadDataSetting(indicatorProps.source);

      // validate instant and apply
      nextSettings.setInstant(prevSettings.getInstant());

    }

    // close anyting in the same theme, then reopen specific
    DataRepository.INDICATOR_PROPS.filter(p => p.thema === indicatorProps.thema).forEach(p => p.fold = 'closed');
    indicatorProps.fold = fold;

    setAppState({
      ...appState,
      source: indicatorProps.source,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: isSourceChange,
        updateLight: isSourceChange,
        updateDelay: 350
      },
      // fold
    });

  }

  const handlePathChange = async (source: string, name: string, path: string) => {

    console.debug('📞 handling path change', source, name, path);

    const dataSetting = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
    const validatedPath = dataSetting.validatePath(name, path);
    if (validatedPath) {

      dataSetting.setPath(name, path); // the setting will try to adjust the path if needed (i.e. vienna district codes)

      setAppState({
        ...appState,
        action: {
          stamp: ObjectUtil.createId(),
          updateScene: true,
          updateLight: true,
          updateDelay: 0
        },
      });

    } else {
      console.debug('💣 skipping path change', source, name, path);
    }



  };

  const [exportableChart, setExportableChart] = useState<IChartProps>();
  const handleIndicatorExport = async (id: string) => {

    console.debug('📞 handling indicator export', id);

    const exportableChartProps = DataRepository.INDICATOR_PROPS.find(p => p.id === id);
    setExportableChart({
      ...exportableChartProps,
      id: ObjectUtil.createId(),
      doExport: true
    });

  }

  const handleThemaChange = (thema: string) => {

    console.debug('📞 handling thematic change', thema);

    const isThemaChange = thema !== appState.thema;
    if (isThemaChange) {

      // within the the target thema find the first that ist not closed
      const indicatorProps = DataRepository.INDICATOR_PROPS.find(p => p.thema === thema && p.fold !== 'closed');

      // close any indicators that may be vertically open in other themes
      DataRepository.INDICATOR_PROPS.filter(p => p.fold !== 'closed').forEach(p => p.fold = 'open-horizontal');

      loadThema(thema);
      location.hash = thema;

      setAppState({
        ...appState,
        source: indicatorProps.source,
        action: {
          stamp: ObjectUtil.createId(),
          updateScene: true,
          updateLight: true,
          updateDelay: 250
        },
        thema
      });

    }

  }



  const handleIndxChange = async (source: string, name: string, indexRaw: string) => {

    console.debug('📞 handling index change', source, name, indexRaw);

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

  const getThema = (themaRaw: string) => {

    if (themaRaw === 'VACCINATION' || themaRaw === 'HOSPITALIZATION' || themaRaw === 'MISCALLANEOUS') {
      return themaRaw;
    };
    return 'INCIDENCE';

  }

  const thema = getThema(window.location.hash.substring(1));
  const indicatorProps = DataRepository.INDICATOR_PROPS.filter(p => p.thema === thema);

  const instant = TimeUtil.parseCategoryDateFull(TimeUtil.formatCategoryDateFull(Date.now()));
  const [userInterfaceProps, setUserInterfaceProps] = useState<IUserInterfaceProps>({
    onDataPicked: handleIndicatorExpand,
    onThemaChange: handleThemaChange,
    indicatorProps,
    navigationBotProps: {
      instantProps: {
        source: '',
        instant: instant,
        instantMin: TimeUtil.parseCategoryDateFull('01.03.2020'),
        instantMax: instant,
        instantDif: 0,
        onInstantChange: handleInstantChange
      }
    },
    exportSceneProps: {
      onScreenshotRequested: handleScreenshotRequested
    }
  });

  const [updateMapTo, setUpdateMapTo] = useState<number>(-1);
  const [mapProps, setMapProps] = useState<IMapProps>({
    lightProps: [
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        intensity: 1.25,
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
        intensity: 1.25,
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
      onInstantChange: handleInstantChange,
      onViewChange: handleViewChange
    },
    hexagonProps: {
      source: '',
      name: '',
      keys: [],
      path: '',
      frac: -1,
      stamp: ObjectUtil.createId(),
      view: 'northwards',
      onPathChange: handlePathChange,
      getState: (values) => {
        return {
          color: ColorUtil.getCorineColor(values.luc),
          col_h: ColorUtil.getCorineColor(values.luc),
          col_o: ColorUtil.getCorineColor(values.luc),
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
        label: '', // 'https://www.data.gv.at/covid-19/' 'https://fitforfire.github.io/covid-sbg/#/', // 'https://data.statistik.gv.at'
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


  useEffect(() => {

    if (fracstamp < 0) {
      return;
    }

    console.debug('📞 handling frac changed', fracstamp);

    /**
     * update fracvalue, which will cause other calls to this method as along as value does not exceed 1
     */
    window.clearTimeout(fracTo.current);
    fracTo.current = window.setTimeout(() => {

      const elapstamp = Date.now() - fracstamp;
      const fraction = three.MathUtils.smootherstep(elapstamp, 0, 500);
      const _mapProps: IMapProps = {
        ...mapProps,
        hexagonProps: {
          ...mapProps.hexagonProps,
          frac: fraction
        },
        lightProps: mapProps.lightProps.map(props => {
          return {
            ...props,
            stamp: ObjectUtil.createId(),
            shadowEnabled: true // fraction === 1
          }
        })
      };
      setMapProps(_mapProps);

    }, 10);

  }, [fracstamp, mapProps.hexagonProps.frac]);

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


  const firstIndicatorProps = userInterfaceProps.indicatorProps[0];
  const [appState, setAppState] = useState<IAppState>({
    source: firstIndicatorProps.source,
    thema,
    action: {
      stamp: ObjectUtil.createId(),
      updateScene: false,
      updateLight: false,
      updateDelay: 1000
    },
    view: 'northwards'
  });


  useEffect(() => {

    console.debug('🔄 updating app', appState.source, appState.thema);

    // change source if this is the first indicator props instance of a fresh thema
    let source = appState.source;
    const appIndicatorProps = DataRepository.INDICATOR_PROPS.find(p => p.source === source);
    if (appIndicatorProps.thema !== appState.thema) {

      // find first props within target thema that is open
      const themeIndicatorProps = DataRepository.INDICATOR_PROPS.find(p => p.thema === thema && p.fold !== 'closed');
      // be sure there is no open-vertical state (which would cause an error in indicator- or chart component)
      // themeIndicatorProps.fold = 'open-horizontal';
      appState.source = themeIndicatorProps.source;

    }



    // // const refEle = 0;
    // const isThemaChange = userInterfaceProps.indicatorProps[0].thema !== appState.thema;
    // if (isThemaChange) {

    //   thema

    // }

    /**
     * update instant props with current source
     * this is done so the date-slider and date-picker components can call back with the current source
     * and could probably also be solved by putting source on state in this component
     */
    const _instantProps: IInstantProps = {
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
    const _hyperlinkProps = mapProps.hyperlinkProps.map(props => {
      return {
        ...props
      }
    });
    let _hexagonProps: IHexagonsProps = {
      ...mapProps.hexagonProps
    };
    const _lightProps = mapProps.lightProps.map(props => {
      return {
        ...props
      }
    });

    for (let i = 0; i < DataRepository.INDICATOR_PROPS.length; i++) {
      const indicatorPropsInstance = DataRepository.INDICATOR_PROPS[i];
      const dataSetting = DataRepository.getInstance().getDataSetting(indicatorPropsInstance.source);
      const selected = indicatorPropsInstance.source === appState.source;
      if (dataSetting && selected) {
        _instantProps.source = indicatorPropsInstance.source;
        _instantProps.instant = dataSetting.getInstant();
        _instantProps.instantDif = indicatorPropsInstance.instantDif;
      }
    }
    let mapKeys: string[] = [];

    for (let i = 0; i < DataRepository.INDICATOR_PROPS.length; i++) {

      const indicatorPropsInstance = DataRepository.INDICATOR_PROPS[i];
      const dataSetting = DataRepository.getInstance().getDataSetting(indicatorPropsInstance.source);
      if (dataSetting) {

        const indexKeysetInstance = dataSetting.getDataset().getIndexKeyset();
        const rendererPropsInstance = indicatorPropsInstance.getRendererProps(dataSetting.getIndex(), indexKeysetInstance.getValue(dataSetting.getIndex()));

        const selected = indicatorPropsInstance.source === appState.source;

        // current instant (closest to date slider date - and date slider will be move to that instant upon update)
        const clampedInstant00 = dataSetting.getDataset().getValidInstant(_instantProps.instant);
        // console.log('clampedInstant00', indicatorPropsInstance.source, TimeUtil.formatCategoryDateFull(clampedInstant00));

        // one week offset (for "vorwoche" value)
        const clampedInstant07 = dataSetting.getDataset().getValidInstant(clampedInstant00 - TimeUtil.MILLISECONDS_PER___WEEK);

        // ~ 2 month back (for the history hexagon slot)
        const clampedInstant60 = dataSetting.getDataset().getValidInstant(clampedInstant00 - TimeUtil.MILLISECONDS_PER____DAY * 60);

        /**
         * set up breadcrumbs to show options of current indicator
         */
        const breadcrumbProps: IBreadcrumbProps[] = [];

        const keysetKeys = dataSetting.getDataset().getKeysetKeys();
        if (selected) {

          _labelProps[0].label = indicatorPropsInstance.name + ' nach ' + indicatorPropsInstance.desc;

          // console.log('update hyperling to')
          _hyperlinkProps[0].label = indicatorPropsInstance.copy;
          _hyperlinkProps[0].href = indicatorPropsInstance.copy;

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

            // console.log('prefKey', prefKey, 'postKey', postKey);

            mapKeys = keyset.getRaws();

            /**
             * the path refers to subset (if there is subsets)
             * therefore the top crumbs needs to be adapted
             * path may i.e. be "502##"
             */
            let validPath = path;
            keyset.getKeys().forEach(key => {
              const keyTrimmed = key.replaceAll('#', '');
              if (keyTrimmed !== '' && path !== key && path?.startsWith(keyTrimmed)) { // includes #####, but will match 
                validPath = key;
              }
            });

            breadcrumbProps.push({
              source: appState.source,
              name: keysetKey,
              keys: keyset,
              path: validPath,
              onPathChange: handlePathChange,
            });

            if (validPath && keyset.hasSubset(validPath)) {

              const subset = keyset.getSubset(validPath);
              let validSubpath = path;
              // if (path.indexOf('#') >= 0) {
              //   mapKeys = keyset.getKeys();
              // } else {
              //   mapKeys = subset.getKeys();
              // }

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

        // const indexKeyset = dataSetting.getDataset().getIndexKeyset();
        const indexSizeFiltered = indexKeysetInstance.getKeys().length; // indexKeyset.getKeys().filter(k => indexKeyset.getValue(k) !== DataRepository.FAELLE).length;
        if (indexSizeFiltered > 1) {

          if (selected) {
            label1 += ' / ' + indexKeysetInstance.getValue(dataSetting.getIndex().toString());
          }

          const path = dataSetting.getIndex().toString();
          breadcrumbProps.push({
            source: appState.source,
            name: 'index',
            keys: indexKeysetInstance,
            path,
            onPathChange: handleIndxChange,
          });

        }

        if (selected) {
          _labelProps[1].label = label1;
        }

        let minLegendValue = Number.MAX_VALUE;
        let maxLegendValue = Number.MIN_VALUE;
        let minLegendLabel = '';
        let maxLegendLabel = '';
        if (selected) {

          _labelProps[2].label = TimeUtil.formatCategoryDateFull(clampedInstant60);
          _labelProps[3].label = TimeUtil.formatCategoryDateFull(clampedInstant00);

          const entry00 = dataSetting.getDataset().getEntryByInstant(dataSetting.getInstant()); // dataSetting.data[dataSetting.date]; // TimeUtil.formatCategoryDateFull(clampedInstant00)
          if (!entry00) {
            console.log('failed to get entry', TimeUtil.formatCategoryDateFull(instant), dataSetting.getDataset(), appState.source);
            Math.random();
          }
          /**
           * find min and max values referring to the map display date
           */
          entry00.getKeys().forEach(key => {
            if (key.endsWith(postKey)) { // TODO what does this do, why has endsWith relevance
              const value00 = entry00.getValue(key, dataSetting.getIndex());
              if (value00.value < minLegendValue) {
                minLegendValue = value00.value;
                minLegendLabel = value00.label();
              }
              if (value00.value > maxLegendValue) {
                maxLegendValue = value00.value;
                maxLegendLabel = value00.label();
              }
            }
          });

          _legendLabelProps.min.label = minLegendLabel.padStart(8, ' '); // right align by padding monospaced text
          _legendLabelProps.max.label = maxLegendLabel;

          const entry60 = dataSetting.getDataset().getEntryByInstant(clampedInstant60); // dataSetting.data[TimeUtil.formatCategoryDateFull(clampedInstant60)];
          const minCourseVal = entry60.getValue(prefKey + postKey, dataSetting.getIndex());
          const maxCourseVal = entry00.getValue(prefKey + postKey, dataSetting.getIndex());

          _courseLabelProps.min.label = minCourseVal.label().padStart(8, ' '); // right align by padding monospaced text
          _courseLabelProps.max.label = maxCourseVal.label();

        }

        const getColor = (value: number) => {
          const h = rendererPropsInstance.interpolatedHue.getOut(value);
          const s = Math.max(0, rendererPropsInstance.interpolatedSat.getOut(value));
          const v = Math.max(0, rendererPropsInstance.interpolatedVal.getOut(value));
          return new Color(h, s, v);
        }

        const valueKey = prefKey + postKey;
        const entry00 = dataSetting.getDataset().getEntryByInstant(clampedInstant00);
        const entry07 = dataSetting.getDataset().getEntryByInstant(clampedInstant07);
        const value00 = entry00.getValue(valueKey, dataSetting.getIndex());
        const valueM7 = entry07.getValue(valueKey, dataSetting.getIndex());
        const value07 = (value00.value - valueM7.value) / valueM7.value;
        const label07 = (value07 < 0 ? '-' : '+') + FormattingDefinition.FORMATTER_PERCENT.format(Math.abs(value07));


        if (selected) {

          DataRepository.INDICATOR_PROPS[i] = {
            ...indicatorPropsInstance,
            label00: value00.label(),
            label07,
            breadcrumbProps: breadcrumbProps,
            path: valueKey,
            // fold: appState.fold,
            instant: clampedInstant00,
            // instantMin: dataSetting.getInstantMin(),
            // instantMax: dataSetting.getInstantMax(),
            onExpand: handleIndicatorExpand,
            onExport: handleIndicatorExport,
            onInstantChange: handleInstantChange,
            onInstantRangeChange: handleInstantRangeChange,
            onSeriesVisibilityChange: handleSeriesVisibiltyChange,
            onLogarithmicChange: handleLogarithmicChange
          };

          _lightProps.forEach(props => {
            props.intensity = rendererPropsInstance.interpolatedInt.getOut(value00.value)
          });

        } else {

          DataRepository.INDICATOR_PROPS[i] = {
            ...indicatorPropsInstance,
            label00: value00.label(),
            label07,
            // fold: 'closed',
            instant: clampedInstant00,
            // instantMin: dataSetting.getInstantMin(),
            // instantMax: dataSetting.getInstantMax(),
            onExpand: handleIndicatorExpand,
            onExport: handleIndicatorExport,
            onInstantChange: handleInstantChange,
            onInstantRangeChange: handleInstantRangeChange,
            onSeriesVisibilityChange: handleSeriesVisibiltyChange,
            onLogarithmicChange: handleLogarithmicChange
          };

        }

        const defaultState = {
          color: new Color(0, 0, 0),
          col_o: new Color(0, 0, 0),
          col_h: new Color(0, 0, 0),
          height: 4.0
        };

        const eleMult = 0.5;

        if (selected) {

          // performance
          const valueLookup: { [K in string]: IHexagonState } = {};

          _hexagonProps = {
            ...mapProps.hexagonProps,
            source: appState.source,
            name: keysetKeys[0],
            keys: mapKeys,
            path: prefKey,
            view: appState.view,
            // fraction: mapProps.hexagonProps.fraction,
            onPathChange: handlePathChange,
            stamp: appState.action.updateScene ? ObjectUtil.createId() : mapProps.hexagonProps.stamp,
            getPath: (hexagon) => {
              return hexagon.gkz.substring(0, prefKey.length);
            },
            getState: (hexagon) => {
              let ele = hexagon.ele * eleMult;
              if (hexagon.luc === 0) {
                // legend
                let lookupState = valueLookup['l' + hexagon.x];
                if (!lookupState) {
                  const legendFraction = HexagonRepository.getInstance().getLegendFraction(hexagon);
                  const val = minLegendValue + (maxLegendValue - minLegendValue) * legendFraction;
                  const col = getColor(val);
                  lookupState = {
                    color: col,
                    col_h: col,
                    col_o: col,
                    height: rendererPropsInstance.interpolatedEle.getOut(val)
                  }
                  valueLookup['l' + hexagon.x] = lookupState;
                }
                return {
                  ...lookupState,
                  height: lookupState.height + ele
                }
              } else if (hexagon.luc === 1) { // 3d-chart
                // history
                const legendFraction = HexagonRepository.getInstance().getLegendFraction(hexagon);
                let lookupState = valueLookup['c' + hexagon.x];
                if (!lookupState) {
                  const historicInstant = dataSetting.getDataset().getValidInstant(clampedInstant60 + (clampedInstant00 - clampedInstant60) * legendFraction);
                  const historicEntry = dataSetting.getDataset().getEntryByInstant(historicInstant);
                  if (historicEntry.hasKey(prefKey + postKey)) {
                    const col = getColor(historicEntry.getValue(prefKey + postKey, dataSetting.getIndex()).value);
                    lookupState = {
                      color: col,
                      col_h: col,
                      col_o: col,
                      height: rendererPropsInstance.interpolatedEle.getOut(historicEntry.getValue(prefKey + postKey, dataSetting.getIndex()).value)
                    }
                  } else {
                    lookupState = {
                      color: Color.DARK_GREY,
                      col_h: Color.DARK_GREY,
                      col_o: Color.DARK_GREY,
                      height: 0
                    }
                  }
                  valueLookup['c' + hexagon.x] = lookupState;
                }
                return {
                  ...lookupState,
                  height: lookupState.height + ele
                }
              } else {

                // data
                let lookupState = valueLookup[hexagon.gkz];
                if (!lookupState) {

                  const _prefKey = dataSetting.validatePath(dataSetting.getDataset().getKeysetKeys()[0], hexagon.gkz.substring(0, prefKey.length));
                  if (!_prefKey) {

                    // for cases where there is partial data (like salzburg only)

                    lookupState = {
                      ...defaultState,
                      height: defaultState.height + ele
                    }

                  } else {

                    const dataKey = _prefKey + postKey;
                    const entry00 = dataSetting.getDataset().getEntryByInstant(dataSetting.getInstant());
                    const col = getColor(entry00.getValue(dataKey, dataSetting.getIndex()).value);

                    if (entry00.hasKey(dataKey)) {
                      lookupState = {
                        color: col,
                        col_h: col.hilight(),
                        col_o: col.outline(),
                        height: rendererPropsInstance.interpolatedEle.getOut(entry00.getValue(dataKey, dataSetting.getIndex()).value) - HexagonRepository.getInstance().getAverageElevation(_prefKey, _hexagonProps) * eleMult
                      }
                    } else {
                      lookupState = {
                        ...defaultState,
                        height: defaultState.height + ele
                      }
                    }

                  }
                  valueLookup[hexagon.gkz] = lookupState;

                }

                return {
                  ...lookupState,
                  height: lookupState.height + ele
                }

              }

            },
            onHexagonsLoaded: handleHexagonsLoaded
          }

        }

      }

    };

    const _indicatorProps = DataRepository.INDICATOR_PROPS.filter(p => p.thema === appState.thema).map(props => {
      return {
        ...props
      }
    });

    // console.debug('🔄 updating userInterfaceProps');
    /**
     * actual update of user interface props
     */
    setUserInterfaceProps({
      ...userInterfaceProps,
      indicatorProps: _indicatorProps,
      navigationBotProps: {
        ...userInterfaceProps.navigationBotProps,
        instantProps: _instantProps
      },
      onDataPicked: handleIndicatorExpand,
      onThemaChange: handleThemaChange,
    });

    /**
    * update instant on control props
    */
    const _controlProps = {
      ...mapProps.controlsProps,
      instant: _instantProps.instant,
      stamp: appState.action.updateScene ? ObjectUtil.createId() : mapProps.controlsProps.stamp,
      onInstantChange: handleInstantChange,
      onViewChange: handleViewChange
    }

    /**
    * update stamps on all lights (triggering a shadow update)
    */
    const _lightPropsFast = _lightProps.map(props => {
      return {
        ...props,
        stamp: appState.action.updateLight ? ObjectUtil.createId() : props.stamp,
        shadowEnabled: true
      }
    });
    const _lightPropsSlow = _lightProps.map(props => {
      return {
        ...props,
        stamp: appState.action.updateLight ? ObjectUtil.createId() : props.stamp,
        shadowEnabled: true
      }
    });

    /**
     * have a direct (fast) update
     */
    // if (appState.action.updateDelay > 0) {

    /**
     * sets the destination values on the map
     */

    setMapProps({
      ...mapProps,
      labelProps: _labelProps,
      legendLabelProps: _legendLabelProps,
      courseLabelProps: _courseLabelProps,
      hyperlinkProps: _hyperlinkProps,
      hexagonProps: _hexagonProps,
      lightProps: _lightPropsFast,
      controlsProps: _controlProps
    });

    if (appState.action.updateScene || appState.action.updateLight) {

      /**
      * set map-props in way that will cause the map to pick up current data, triggers re-rendering by changing the id of the properties (a useEffect method listens for this)
      */
      window.clearTimeout(updateMapTo);
      setUpdateMapTo(window.setTimeout(() => {
        setFracstamp(Date.now()); // kick off animation
      }, appState.action.updateDelay));

    }





  }, [appState]);

  useEffect(() => {
    console.debug('✨ building app component');
    window.addEventListener('resize', handleResize);
    loadThema(appState.thema);
  }, []);


  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
      {
        exportableChart ? <ChartComponent key={exportableChart.id} {...exportableChart} style={{ width: '1200px', height: '675px', position: 'absolute', left: '-2000px', top: '-1000px' }} /> : null
      }
    </div>
  );

};

// 