import { useEffect, useState } from 'react';
import { IBreadcrumbProps } from './components/IBreadcrumbProps';
import { IHexagonsProps } from './components/IHexagonsProps';
import { IIndicatorProps, INDICATOR_PROPS_FOLD } from './components/IIndicatorProps';
import { IInstantProps } from './components/IInstantProps';
import { IMapProps } from './components/IMapProps';
import { IUserInterfaceProps } from './components/IUserInterfaceProps';
import MapComponent from './components/MapComponent';
import UserInterfaceComponent from './components/UserInterfaceComponent';
import { DataRepository } from './data/DataRepository';
import { HexagonRepository } from './data/HexagonRepository';
import { IDataRoot } from './data/IDataRoot';
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
  const handleInstantChange = (instant1: number) => {

    console.log('📞 handling instant change', instant1);

    setAppState({
      ...appState,
      instant: DataRepository.getInstance().clampInstant(appState.source, instant1),
      action: {
        updateScene: true,
        updateLight: true,
        updateDelay: 250
      }
    });
    
  }

  const handleHexagonsLoaded = () => {
    // console.log('handling hexagons loaded', appState);
    setAppState({
      ...appState,
      action: {
        updateScene: true,
        updateLight: true,
        updateDelay: 1
      }
    });
  }

  const handleIndicatorExpand = (source1: string) => {

    console.log('📞 handling indicator fold', source1);

    const isSourceChange = source1 !== appState.source;
    let fold: INDICATOR_PROPS_FOLD = appState.fold === 'open-horizontal' ? 'open-vertical' : 'open-horizontal'
    if (isSourceChange) {
      fold = 'open-horizontal';
    }

    setAppState({
      ...appState,
      source: source1,
      instant: DataRepository.getInstance().clampInstant(source1, appState.instant),
      action: {
        updateScene: isSourceChange,
        updateLight: isSourceChange,
        updateDelay: 350
      },
      fold
    });

  }

  const handleIndxChange = (source: string, name: string, path: string) => {

    console.log('📞 handling index change', source, name, path);

    DataRepository.getInstance().getOrLoad(source).then(data => {
      data.indx = parseInt(path);
      setAppState({
        ...appState,
        source,
        action: {
          updateScene: true,
          updateLight: true,
          updateDelay: 1
        },
      });
    });

  }

  const handlePathChange = (source: string, name: string, path: string) => {

    console.log('📞 handling path change', source, name, path);

    DataRepository.getInstance().getOrLoad(source).then(data => {
      data.path[name] = path;
      setAppState({
        ...appState,
        source,
        action: {
          updateScene: true,
          updateLight: true,
          updateDelay: 1
        },
      });
    });

  };


  const instant = Date.now();
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
        instantMin: new Date('2020-03-01').getTime(),
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
      getColor: (values) => ColorUtil.getCorineColor(values.luc),
      getHeight: (values) => values.ele,
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
        updateScene: false,
        updateLight: false,
        updateDelay: 1
      },
    });
  }, [dimensions]);

  const indicatorProps = userInterfaceProps.indicatorProps[0];
  const [appState, setAppState] = useState<IAppState>({
    source: indicatorProps.source,
    instant,
    action: {
      updateScene: false,
      updateLight: false,
      updateDelay: 1
    },
    fold: indicatorProps.fold
  });

  useEffect(() => {

    console.log('🔄 updating app');

    const refEle = 0;

    const allPromises: Promise<IDataRoot>[] = userInterfaceProps.indicatorProps.map(props => DataRepository.getInstance().getOrLoad(props.source));
    Promise.all(allPromises).then(allData => {

      const indicatorProps: IIndicatorProps[] = [];
      const labelProps = mapProps.labelProps;
      labelProps.forEach(props => {
        props.label = '';
      });
      const legendLabelProps = mapProps.legendLabelProps;
      const courseLabelProps = mapProps.courseLabelProps;
      const hyperlinkProps = mapProps.hyperlinkProps;
      let hexagonProps: IHexagonsProps;

      for (let i = 0; i < allData.length; i++) {

        const data = allData[i];
        // console.log('data', userInterfaceProps.indicatorProps[i].source, data.path)

        const indicatorPropsInstance = userInterfaceProps.indicatorProps[i];
        const selected = indicatorPropsInstance.source === appState.source;

        // current instant (closest to date slider date - and date slider will be move to that instant upon update)
        const clampedInstant00 = DataRepository.getInstance().clampInstant(indicatorPropsInstance.source, appState.instant);

        // one week offset (for "vorwoche" value)
        const clampedInstant07 = DataRepository.getInstance().clampInstant(indicatorPropsInstance.source, clampedInstant00 - TimeUtil.MILLISECONDS_PER___WEEK);

        // ~ 2 month back (for the history hexagon slot)
        const clampedInstant60 = DataRepository.getInstance().clampInstant(indicatorPropsInstance.source, clampedInstant00 - TimeUtil.MILLISECONDS_PER____DAY * 60);

        data.date = TimeUtil.formatCategoryDateFull(clampedInstant00);

        /**
         * set up breadcrumbs to show options of current indicator
         */
        const breadcrumbProps: IBreadcrumbProps[] = [];

        const names = Object.keys(data.keys);
        if (selected) {
          labelProps[0].label = indicatorPropsInstance.name + ' nach ' + indicatorPropsInstance.desc;
        }
        let label1 = '';

        let prefPath: string = '';
        let postPath: string = '';
        for (let i = 0; i < names.length; i++) {
          const name = names[i];
          if (i === 0) {
            prefPath = data.path[name]; // i.e. '9' - Vienna as province/Bundesland, '900' - Vienna as district/Bezirk
            if (selected) {
              label1 += data.keys[name][prefPath];
            }
          } else {
            postPath += data.path[name];
            if (selected) {
              label1 += ' / ' + data.keys[name][postPath];
            }
          }
          breadcrumbProps.push({
            source: appState.source,
            name,
            keys: data.keys[name],
            path: data.path[name],
            onPathChange: handlePathChange,
          });
        };

        if (data.idxs.length > 1) {
          // console.log('idxs', data.idxs);
          const keys = {};
          for (let i = 0; i < data.idxs.length; i++) {
            keys[i] = data.idxs[i];
          }

          if (selected) {
            label1 += ' / ' + data.idxs[data.indx];
          }

          const path = data.indx.toString();
          breadcrumbProps.push({
            source: appState.source,
            name: 'index',
            keys,
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

          const dataset00 = data.data[data.date]; // TimeUtil.formatCategoryDateFull(clampedInstant00)
          const keys = Object.keys(dataset00);

          // console.log('areaPointer', prefPointer, postPointer);
          /**
           * find min and max values referring to the map display date
           */
          keys.forEach(key => {
            if (key.endsWith(postPath)) {
              minLegendVal = Math.min(minLegendVal, dataset00[key][data.indx]);
              maxLegendVal = Math.max(maxLegendVal, dataset00[key][data.indx]);
            }
          });

          legendLabelProps.min.label = indicatorPropsInstance.valueFormatter.format(minLegendVal).padStart(8, ' '); // right align by padding monospaced text
          legendLabelProps.max.label = indicatorPropsInstance.valueFormatter.format(maxLegendVal);

          const dataset60 = data.data[TimeUtil.formatCategoryDateFull(clampedInstant60)];
          const minCourseVal = dataset60[prefPath + postPath][data.indx];
          const maxCourseVal = dataset00[prefPath + postPath][data.indx];

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
        const dataPointer = prefPath + postPath;
        const dataset00 = data.data[TimeUtil.formatCategoryDateFull(clampedInstant00)];
        const dataset07 = data.data[TimeUtil.formatCategoryDateFull(clampedInstant07)];
        const value00 = dataset00[dataPointer][data.indx];
        const valueM7 = dataset07[dataPointer][data.indx];
        const value07 = (value00 - valueM7) / valueM7;
        if (selected) {
          indicatorProps.push({
            ...indicatorPropsInstance,
            value00: indicatorPropsInstance.valueFormatter.format(value00),
            value07: FormattingDefinition.FORMATTER_PERCENT.format(value07),
            breadcrumbProps: breadcrumbProps,
            path: dataPointer,
            fold: appState.fold,
            date: TimeUtil.formatCategoryDateFull(clampedInstant00),
            onExpand: handleIndicatorExpand,
            chartProps: {
              ...indicatorPropsInstance.chartProps,
              path: dataPointer,
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

          hexagonProps = {
            // onHover: setHovered,
            source: appState.source,
            name: names[0],
            keys: Object.keys(data.keys[names[0]]), // only the actual keys of the file-wise key structure, i.e. 5,6,7 (for bundesland-kennziffer)
            path: prefPath,
            onPathChange: handlePathChange,
            stamp: appState.action.updateScene ? ObjectUtil.createId() : mapProps.hexagonProps.stamp,
            getPath: (values) => {
              return values.gkz.substring(0, prefPath.length);
            },
            getColor: (values) => {
              const _prefPointer = values.gkz.substring(0, prefPath.length)
              const dataPointer = _prefPointer + postPath;
              const dataset00 = data.data[data.date];
              const dailyValues = dataset00[dataPointer];
              let val = 0;
              if (dailyValues) {
                return getColor(dailyValues[data.indx]); // last value
              } else if (values.luc === 0) {
                const legendFraction = HexagonRepository.getInstance().getLegendFraction(values);
                return getColor(minLegendVal + (maxLegendVal - minLegendVal) * legendFraction);
              } else if (values.luc === 1) {
                const legendFraction = HexagonRepository.getInstance().getLegendFraction(values);
                const historicInstant = DataRepository.getInstance().clampInstant(indicatorPropsInstance.source, clampedInstant60 + (clampedInstant00 - clampedInstant60) * legendFraction);
                const historicDataset = data.data[TimeUtil.formatCategoryDateFull(historicInstant)];
                const historicValues = historicDataset[prefPath + postPath];
                if (historicValues) {
                  return getColor(historicValues[data.indx]); // last value
                } else {
                  console.error('failed to find historic values');
                }
              }
              return ColorUtil.getCorineColor(values.luc);
              // return ColorUtil.getCorineColor(values.luc);
            },
            getHeight: (values) => {
              let ele = values.ele / 2 - 7.5 - refEle; // - 7.5;
              const _prefPath = values.gkz.substring(0, prefPath.length)
              const fullPath = _prefPath + postPath;
              const dataset00 = data.data[data.date];
              const dailyValues = dataset00[fullPath];
              if (dailyValues) {
                ele += indicatorPropsInstance.interpolatedEle.getOut(dailyValues[data.indx]);
              } else if (values.luc === 0) {
                const legendFraction = HexagonRepository.getInstance().getLegendFraction(values);
                const val = minLegendVal + (maxLegendVal - minLegendVal) * legendFraction;
                ele += indicatorPropsInstance.interpolatedEle.getOut(val);
              } else if (values.luc === 1) {
                // TODO this could likely be faster since legend and history are handled in columns
                const legendFraction = HexagonRepository.getInstance().getLegendFraction(values);
                const historicInstant = DataRepository.getInstance().clampInstant(indicatorPropsInstance.source, clampedInstant60 + (clampedInstant00 - clampedInstant60) * legendFraction);
                const historicDataset = data.data[TimeUtil.formatCategoryDateFull(historicInstant)];
                const historicValues = historicDataset[prefPath + postPath];
                if (historicValues) {
                  ele += indicatorPropsInstance.interpolatedEle.getOut(historicValues[data.indx]);
                } else {
                  console.error('failed to find historic values');
                }
              }
              return ele;
            },
            onHexagonsLoaded: handleHexagonsLoaded
          }
        }

      };



      /**
       * update instant props with current source
       * this is done so the date-slider and date-picker components can call back with the current source
       * and could probably also be solved by putting source on state in this component
       */
      const instantProps: IInstantProps = {
        ...userInterfaceProps.navigationBotProps.instantProps,
        instantCur: appState.instant,
        onInstantChange: handleInstantChange
      }

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
          hyperlinkProps: [ ...hyperlinkProps ],
          lightProps,
          controlsProps,
          hexagonProps: hexagonProps!
        });
      }, appState.action.updateDelay));

    });



  }, [appState.instant, appState.source, appState.action]); 

  useEffect(() => {

    console.log('building app');
    window.addEventListener('resize', handleResize);

  }, []);

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
    </div>
  );

};

