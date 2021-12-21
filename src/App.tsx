import { useEffect, useState } from 'react';
import { IBreadcrumbProps } from './components/IBreadcrumbProps';
import { IHexagonsProps } from './components/IHexagonsProps';
import { IHexagon } from './components/IHexagon';
import { IIndicatorProps, INDICATOR_PROPS_FOLD } from './components/IIndicatorProps';
import { IInstantProps } from './components/IInstantProps';
import { IMapProps } from './components/IMapProps';
import { IUserInterfaceProps } from './components/IUserInterfaceProps';
import MapComponent from './components/MapComponent';
import UserInterfaceComponent from './components/UserInterfaceComponent';
import { DataRepository } from './data/DataRepository';
import { IDataRoot } from './data/IDataRoot';
import { IAppState } from './IAppState';
import { Color } from './util/Color';
import { ColorUtil } from './util/ColorUtil';
import { FormattingDefinition } from './util/FormattingDefinition';
import { InterpolatedValue } from './util/InterpolatedValue';
import { ObjectUtil } from './util/ObjectUtil';
import { TimeUtil } from './util/TimeUtil';
import { UpdateDisabled } from '@mui/icons-material';

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

    DataRepository.getInstance().clampInstant(state.source, instant1).then(instant2 => {
      setState({
        ...state,
        instant: instant2,
        action: {
          updateScene: true,
          updateLight: true,
          updateDelay: 250
        }
      });
    });

  }

  const handleIndicatorExpand = (source1: string) => {

    const isSourceChange = source1 !== state.source;
    let fold: INDICATOR_PROPS_FOLD = state.fold === 'open-horizontal' ? 'open-vertical' : 'open-horizontal'
    if (isSourceChange) {
      fold = 'open-horizontal';
    }

    DataRepository.getInstance().clampInstant(source1, state.instant).then(instant1 => {

      setState({
        ...state,
        source: source1,
        instant: instant1,
        action: {
          updateScene: isSourceChange,
          updateLight: isSourceChange,
          updateDelay: 350
        },
        fold
      });

    });



  }

  const handlePathChange = (source: string, name: string, path: string) => {

    DataRepository.getInstance().getOrLoad(source).then(data => {
      data.path[name] = path;
      setState({
        ...state,
        source,
        action: {
          updateScene: true,
          updateLight: false,
          updateDelay: 1
        },
      });        
    });

  };


  const instant = Date.now() - TimeUtil.MILLISECONDS_PER____DAY * 14;
  const [userInterfaceProps, setUserInterfaceProps] = useState<IUserInterfaceProps>({
    onDataPicked: handleIndicatorExpand,
    indicatorProps: [
      {
        date: '',
        title: 'Inzidenz nach Alter und Bundesland',
        value: '',
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        fold: 'open-horizontal',
        source: './hexmap-data-bundesland-alter.json',
        path: '',
        breadcrumbProps: [],
        getColor: value => Color.DARK_GREY,
        interpolatedHue: new InterpolatedValue(0.25, 0.00, 0, 500, 1),
        interpolatedEle: new InterpolatedValue(0, 100, 0, 5000, 1) 
      },
      {
        date: '',
        title: 'Inzidenz nach Bezirk',
        value: '',
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        fold: 'closed',
        source: './hexmap-data-bundesland-bezirk.json',
        path: '',
        breadcrumbProps: [],
        getColor: value => Color.DARK_GREY,
        interpolatedHue: new InterpolatedValue(0.25, 0.00, 0, 500, 1),
        interpolatedEle: new InterpolatedValue(0, 100, 0, 5000, 1)
      },
      {
        date: '',
        title: 'Impfung nach Gemeinde',
        value: '',
        valueFormatter: FormattingDefinition.FORMATTER_PERCENT,
        onExpand: handleIndicatorExpand,
        fold: 'closed',
        source: './hexmap-data-vacc-gemeinde.json',
        path: '',
        breadcrumbProps: [],
        getColor: value => Color.DARK_GREY,
        interpolatedHue: new InterpolatedValue(0.00, 0.25, 50, 90, 1),
        interpolatedEle: new InterpolatedValue(0, 20, 0, 100, 1)
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
        // onHover: setHovered,
        source: '',
        name: '',
        keys: [],
        path: '',
        stamp: ObjectUtil.createId(),
        onPathChange: handlePathChange,
        getColor: (values) => ColorUtil.getCorineColor(values.luc),
        getHeight: (values) => values.ele,
        getPath: (values) => values.gkz
    },
    labelProps: [
      {
        id: ObjectUtil.createId(),
        label: '',
        size: 6.5,
        position: {
          x: -255,
          y: 0.2,
          z: -10
        }
      },
      {
        id: ObjectUtil.createId(),
        label: '',
        size: 5,
        position: {
          x: -255,
          y: 0.2,
          z: 0
        }
      },
      {
        id: ObjectUtil.createId(),
        label: '',
        size: 5,
        position: {
          x: -255,
          y: 0.2,
          z: 10
        }
      },
      {
        id: ObjectUtil.createId(),
        label: '',
        size: 5,
        position: {
          x: -255,
          y: 0.2,
          z: 20
        }
      }           
    ] 
  });



  const indicatorProps = userInterfaceProps.indicatorProps[0];
  const [state, setState] = useState<IAppState>({
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

    // TODO needs to be dynamic, especially color wise
    // const interpolatedH = new InterpolatedValue(0.25, 0.00, 0, 500, 1);
    // const interpolatedS = new InterpolatedValue(1.00, 1.00, 0, 750, 1);
    // const interpolatedV = new InterpolatedValue(0.33, 0.33, 0, 750, 1);
    // const interpolatedHeight = new InterpolatedValue(0, 100, 0, 5000, 1);
    const refEle = 0; // interpolatedHeight.getOut(data.data[data.date]['A' + postPointer][0]);

    const allPromises: Promise<IDataRoot>[] = userInterfaceProps.indicatorProps.map(props => DataRepository.getInstance().getOrLoad(props.source));
    Promise.all(allPromises).then(allData => {

      const indicatorProps: IIndicatorProps[] = [];
      const labelProps = mapProps.labelProps;
      labelProps.forEach(props => {
        props.label = '';
      });
      let hexagonProps: IHexagonsProps;

      for (let i=0; i<allData.length; i++) {

        const data = allData[i];
        const indicatorPropsInstance = userInterfaceProps.indicatorProps[i];
        const selected = indicatorPropsInstance.source === state.source;

        data.date = TimeUtil.formatCategoryDateFull(state.instant);

        /**
         * set up breadcrumbs to show options of current indicator
         */
        const breadcrumbProps: IBreadcrumbProps[] = [];
  
        const names = Object.keys(data.keys);
        if (selected) {
          labelProps[0].label = data.name;
        }
  
        let areaPointer: string = '';
        let dataPointer: string = '';
        for (let i=0; i<names.length; i++) {
          const name = names[i];
          if (i === 0) {
            areaPointer = data.path[name]; // i.e. '9' - Vienna as province/Bundesland, '900' - Vienna as district/Bezirk
          } else {
            dataPointer += data.path[name];
            if (selected) {
              labelProps[i].label = data.keys[name][dataPointer];
            }
          }
          breadcrumbProps.push({
            source: state.source, 
            name,
            keys: data.keys[name],
            path: data.path[name],
            onPathChange: handlePathChange,
          });
        };        

        if (selected) {
          labelProps[names.length].label = TimeUtil.formatCategoryDateFull(state.instant);
        }

        const getColor = (value: number) => {
          const h = indicatorPropsInstance.interpolatedHue.getOut(value);
          // const s = interpolatedS.getOut(value);
          // const v = interpolatedV.getOut(value);
          return new Color(h, 1, 0.4);
        }

        // console.log('data', data, );
        const fullPointer = areaPointer + dataPointer;
        // TODO 
        const values = data.data[TimeUtil.formatCategoryDateFull(state.instant)][fullPointer];
        if (selected) {
          indicatorProps.push({
            ...indicatorPropsInstance,
            value: indicatorPropsInstance.valueFormatter.format(values),
            breadcrumbProps: breadcrumbProps,
            path: fullPointer,
            // stamp: ObjectUtil.createId(),
            fold: state.fold,
            date: TimeUtil.formatCategoryDateFull(state.instant),
            onExpand: handleIndicatorExpand,
            getColor
          });
        } else {
          indicatorProps.push({
            ...indicatorPropsInstance,
            value: indicatorPropsInstance.valueFormatter.format(values),
            fold: 'closed',
            date: TimeUtil.formatCategoryDateFull(state.instant),
            onExpand: handleIndicatorExpand 
          });
  
        }

        if (selected) {

          // console.log('areaPointer', areaPointer);
          

          hexagonProps = {
            // onHover: setHovered,
            source: state.source,
            name: names[0],
            keys: Object.keys(data.keys[names[0]]), // only the actual keys of the file-wise key structure, i.e. 5,6,7 (for bundesland-kennziffer)
            path: areaPointer,
            onPathChange: handlePathChange,
            stamp: state.action.updateScene ? ObjectUtil.createId() : mapProps.hexagonProps.stamp,
            getPath: (values) => {
              return values.gkz.substring(0, areaPointer.length);
            },
            getColor: (values) => {
              const fullPointer = values.gkz.substring(0, areaPointer.length) + dataPointer;
              const dailyDataset = data.data[data.date];
              const dailyValues = dailyDataset[fullPointer];              
              let val = 0;
              if (dailyValues) {
                val += dailyValues[dailyValues.length - 1]; // last value
              }
              return getColor(val);
              // return ColorUtil.getCorineColor(values.luc);
            },
            getHeight: (values) => {
              let ele = values.ele / 2 - 7.5 - refEle; // - 7.5;
              const fullPointer = values.gkz.substring(0, areaPointer.length) + dataPointer;
              const dailyDataset = data.data[data.date];
              const dailyValues = dailyDataset[fullPointer];
              if (dailyValues) {
                ele += indicatorPropsInstance.interpolatedEle.getOut(dailyValues[dailyValues.length - 1]);
              } else {
                console.log('missing data', fullPointer);
              }
              return ele;
            }
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
        instantCur: state.instant,
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
        // stamp: state.stamp
      }
 
      /**
      * update stamps on all lights (triggering a shadow update)
      */
      const lightProps = mapProps.lightProps.map(props => {
        return {
          ...props,
          stamp: state.action.updateLight ? ObjectUtil.createId() : props.stamp
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
          lightProps,
          controlsProps,
          hexagonProps: hexagonProps! 
        });      
      }, state.action.updateDelay));

    });



  }, [state.instant, state.source, state.action]);   

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
    </div>
  );
  
};

