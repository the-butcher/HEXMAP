import { height } from '@mui/lab/node_modules/@mui/system';
import { color } from '@mui/system';
import { useEffect, useState } from 'react';
import { IBreadcrumbProps } from './components/IBreadcrumbProps';
import { IHexagonsProps } from './components/IHexagonsProps';
import { IHexagonState } from './components/IHexagonState';
import { IIndicatorProps, INDICATOR_PROPS_FOLD } from './components/IIndicatorProps';
import { IInstantProps } from './components/IInstantProps';
import { IMapProps } from './components/IMapProps';
import { IUserInterfaceProps } from './components/IUserInterfaceProps';
import MapComponent from './components/MapComponent';
import UserInterfaceComponent from './components/UserInterfaceComponent';
import { DataRepository } from './data/DataRepository';
import { HexagonRepository } from './data/HexagonRepository';
import { IDataRoot } from './data/IDataRoot';
import { IDataSetting } from './data/IDataSetting';
import { IAppState } from './IAppState';
import { Color } from './util/Color';
import { ColorUtil } from './util/ColorUtil';
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

    /**
     * trigger an update
     */
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

    console.log('📞 handling hexagons loaded', instant);

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: true,
        updateLight: true,
        updateDelay: 1
      }
    });

  }

  const handleIndicatorExpand = async (source: string) => {

    console.log('📞 handling indicator fold', source);

    const isSourceChange = source !== appState.source;
    let fold: INDICATOR_PROPS_FOLD = appState.fold === 'open-horizontal' ? 'open-vertical' : 'open-horizontal'
    if (isSourceChange) {

      fold = 'open-horizontal';

      // get previous settings
      const prevSettings = await DataRepository.getInstance().getOrLoadDataSetting(appState.source);
      // get the settings that we are about to switch to
      const nextSettings = await DataRepository.getInstance().getOrLoadDataSetting(source);

      // validate instant and apply
      nextSettings.setInstant(prevSettings.getInstant());

    }

    setAppState({
      ...appState,
      source,
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
        updateDelay: 1
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
        updateDelay: 1
      },
    });

  };


  const instant = TimeUtil.parseCategoryDateFull(TimeUtil.formatCategoryDateFull(Date.now()));
  const [userInterfaceProps, setUserInterfaceProps] = useState<IUserInterfaceProps>({
    onDataPicked: handleIndicatorExpand,
    indicatorProps: [
      {
        date: '',
        name: 'Inzidenz',
        desc: 'EMS',
        value00: '',
        value07: '',
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        fold: 'open-horizontal',
        source: './hexmap-data-ems.json',
        path: '',
        breadcrumbProps: [],
        interpolatedHue: new InterpolatedValue(0.25, 0.00, 0, 400, 1),
        interpolatedEle: new InterpolatedValue(0, 50, 0, 3000, 1),
        chartProps: {
          title: '7-Tages Inzidenz',
          source: './hexmap-data-ems.json',
          path: '',
          valueFormatter: FormattingDefinition.FORMATTER____FIXED,
          fold: 'open-horizontal',
          onInstantChange: handleInstantChange
        }
      },
      {
        date: '',
        name: 'Inzidenz',
        desc: 'Bundesland und Alter',
        value00: '',
        value07: '',
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        fold: 'closed',
        source: './hexmap-data-bundesland-alter.json',
        path: '',
        breadcrumbProps: [],
        interpolatedHue: new InterpolatedValue(0.25, 0.00, 0, 400, 1),
        interpolatedEle: new InterpolatedValue(0, 50, 0, 3000, 1),
        chartProps: {
          title: '7-Tages Inzidenz',
          source: './hexmap-data-bundesland-alter.json',
          path: '',
          valueFormatter: FormattingDefinition.FORMATTER____FIXED,
          fold: 'closed',
          onInstantChange: handleInstantChange
        }
      },
      {
        date: '',
        name: 'Inzidenz',
        desc: 'Bezirk',
        value00: '',
        value07: '',
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        fold: 'closed',
        source: './hexmap-data-bundesland-bezirk.json',
        path: '',
        breadcrumbProps: [],
        interpolatedHue: new InterpolatedValue(0.25, 0.00, 0, 400, 1),
        interpolatedEle: new InterpolatedValue(0, 50, 0, 3000, 1),
        chartProps: {
          title: '7-Tages Inzidenz',
          source: './hexmap-data-bundesland-bezirk.json',
          path: '',
          valueFormatter: FormattingDefinition.FORMATTER____FIXED,
          fold: 'closed',
          onInstantChange: handleInstantChange
        }
      },
      {
        date: '',
        name: 'Impfung',
        desc: 'Gemeinde',
        value00: '',
        value07: '',
        valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
        onExpand: handleIndicatorExpand,
        fold: 'closed',
        source: './hexmap-data-vacc-gemeinde.json',
        path: '',
        breadcrumbProps: [],
        interpolatedHue: new InterpolatedValue(0.00, 0.25, 0.50, 0.90, 1),
        interpolatedEle: new InterpolatedValue(0, 20, 0.00, 1.00, 1),
        chartProps: {
          title: 'Impfquote',
          source: './hexmap-data-vacc-gemeinde.json',
          path: '',
          valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
          fold: 'closed',
          onInstantChange: handleInstantChange
        }
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
    // selected: selected1,
    lightProps: [
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        position: {
          x: 300,
          y: 200,
          z: -300
        }
      },
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        position: {
          x: -300,
          y: 200,
          z: -150
        }
      }
    ],
    controlsProps: {
      stamp: ObjectUtil.createId(),
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
        label: 'https://www.data.gv.at/covid-19/',
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
        updateDelay: 1
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
      updateDelay: 1
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

    const promises: Promise<IDataSetting>[] = userInterfaceProps.indicatorProps.map(props => DataRepository.getInstance().getOrLoadDataSetting(props.source));
    Promise.all(promises).then(allSettings => {

      const indicatorProps: IIndicatorProps[] = [];
      const labelProps = mapProps.labelProps;
      labelProps.forEach(props => {
        props.label = '';
      });
      const legendLabelProps = mapProps.legendLabelProps;
      const courseLabelProps = mapProps.courseLabelProps;
      const hyperlinkProps = mapProps.hyperlinkProps;
      let hexagonProps: IHexagonsProps;

      for (let i = 0; i < allSettings.length; i++) {
        const dataSetting = allSettings[i];
        const indicatorPropsInstance = userInterfaceProps.indicatorProps[i];
        const selected = indicatorPropsInstance.source === appState.source;
        if (selected) {
          instantProps.instantCur = dataSetting.getInstant();
        }
      }
      let mapKeys: string[] = [];

      for (let i = 0; i < allSettings.length; i++) {

        const dataSetting = allSettings[i];
        // console.log('data', userInterfaceProps.indicatorProps[i].source, data.path)

        const indicatorPropsInstance = userInterfaceProps.indicatorProps[i];
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

        const keysetKeys = dataSetting.getDataset().getKeysetKeys(); ;
        if (selected) {
          labelProps[0].label = indicatorPropsInstance.name + ' nach ' + indicatorPropsInstance.desc;
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

            mapKeys = keyset.getKeys();
            /**
             * the path refers to subset (if there is subsets)
             * therefore the top crumbs needs to be adapted
             */
            let validPath = path;
            keyset.getKeys().forEach(key => {
              if (path.startsWith(key.replaceAll('#', ''))) {
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
              if (path.indexOf('#') >= 0) {
                mapKeys = keyset.getKeys();
              } else {
                mapKeys = subset.getKeys();
              }
              
              // console.log('crumbs (sub)', path, prefKey, validSubpath, subset);
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
        if (indexKeyset.size() > 1) {

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
          labelProps[1].label = label1;
        }

        let minLegendVal = Number.MAX_VALUE;
        let maxLegendVal = Number.MIN_VALUE;
        if (selected) {

          labelProps[2].label = TimeUtil.formatCategoryDateFull(clampedInstant60);
          labelProps[3].label = TimeUtil.formatCategoryDateFull(clampedInstant00);

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

          legendLabelProps.min.label = indicatorPropsInstance.valueFormatter.format(minLegendVal).padStart(8, ' '); // right align by padding monospaced text
          legendLabelProps.max.label = indicatorPropsInstance.valueFormatter.format(maxLegendVal);

          const entry60 = dataSetting.getDataset().getEntryByInstant(clampedInstant60); // dataSetting.data[TimeUtil.formatCategoryDateFull(clampedInstant60)];
          const minCourseVal = entry60.getValue(prefKey + postKey, dataSetting.getIndex());
          const maxCourseVal = entry00.getValue(prefKey + postKey, dataSetting.getIndex());

          courseLabelProps.min.label = indicatorPropsInstance.valueFormatter.format(minCourseVal).padStart(8, ' '); // right align by padding monospaced text
          courseLabelProps.max.label = indicatorPropsInstance.valueFormatter.format(maxCourseVal);

        }

        // legend
        // 

        const getColor = (value: number) => {
          const h = indicatorPropsInstance.interpolatedHue.getOut(value);
          // const s = interpolatedS.getOut(value);
          // const v = interpolatedV.getOut(value);
          return new Color(h, 1, 0.4);
        }

        // console.log('data', data, );
        const valueKey = prefKey + postKey;
        const entry00 = dataSetting.getDataset().getEntryByInstant(clampedInstant00); // dataSetting.data[TimeUtil.formatCategoryDateFull(clampedInstant00)];
        const entry07 = dataSetting.getDataset().getEntryByInstant(clampedInstant07);
        const value00 = entry00.getValue(valueKey, dataSetting.getIndex()); // dataset00[dataPointer][dataSetting.indx];
        const valueM7 = entry07.getValue(valueKey, dataSetting.getIndex());
        const value07 = (value00 - valueM7) / valueM7;
        if (selected) {
          indicatorProps.push({
            ...indicatorPropsInstance,
            value00: indicatorPropsInstance.valueFormatter.format(value00),
            value07: FormattingDefinition.FORMATTER_PERCENT.format(value07),
            breadcrumbProps: breadcrumbProps,
            path: valueKey,
            fold: appState.fold,
            date: TimeUtil.formatCategoryDateFull(clampedInstant00),
            onExpand: handleIndicatorExpand,
            chartProps: {
              ...indicatorPropsInstance.chartProps,
              path: valueKey,
              fold: appState.fold,
              onInstantChange: handleInstantChange
            }
          });
        } else {
          indicatorProps.push({
            ...indicatorPropsInstance,
            value00: indicatorPropsInstance.valueFormatter.format(value00),
            value07: FormattingDefinition.FORMATTER_PERCENT.format(value07),
            fold: 'closed',
            date: TimeUtil.formatCategoryDateFull(clampedInstant00),
            onExpand: handleIndicatorExpand
          });

        }

        if (selected) {

          // performance
          const valueLookup: { [K in string]: IHexagonState } = {};

          // console.log(TimeUtil.formatCategoryDateFull(clampedInstant60), '-', TimeUtil.formatCategoryDateFull(clampedInstant00))

          hexagonProps = {
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
                    lookupState = {
                      color: Color.DARK_GREY,
                      height: 0
                    }
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

      };





      /**
       * actual update of user interface props
       */
      setUserInterfaceProps({
        // ...userInterfaceProps,
        indicatorProps,
        navigationBotProps: {
          ...userInterfaceProps.navigationBotProps,
          instantProps
        },
        onDataPicked: handleIndicatorExpand,
      });

      /**
      * update instant on control props
      */
      const controlsProps = {
        ...mapProps.controlsProps,
        stamp: appState.action.updateScene ? ObjectUtil.createId() : mapProps.controlsProps.stamp
      }

      /**
      * update stamps on all lights (triggering a shadow update)
      */
      const lightProps = mapProps.lightProps.map(props => {
        return {
          ...props,
          stamp: appState.action.updateLight ? ObjectUtil.createId() : props.stamp
        }
      });

      // console.log('selectedE', selected1);
      /**
      * set map-props in way that will cause the map to pick up current data, triggers re-rendering by changing the id of the properties (a useEffect method listens for this)
      */
      window.clearTimeout(updateMapTo);
      setUpdateMapTo(window.setTimeout(() => {
        setMapProps({
          labelProps: [...labelProps],
          legendLabelProps: { ...legendLabelProps },
          courseLabelProps: { ...courseLabelProps },
          hyperlinkProps: [...hyperlinkProps],
          lightProps,
          controlsProps,
          hexagonProps: hexagonProps!
        });
      }, appState.action.updateDelay));

    });



  }, [appState.source, appState.action]);

  useEffect(() => {

    console.log('✨ building app component');
    window.addEventListener('resize', handleResize);

  }, []);

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
    </div>
  );

};

