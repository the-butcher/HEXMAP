import { useEffect, useState } from 'react';
import { IBreadcrumbProps } from './components/IBreadcrumbProps';
import { IHexagonsProps } from './components/IHexagonsProps';
import { IHexagon } from './components/IHexagon';
import { IIndicatorProps, INDICATOR_PROPS_STATE } from './components/IIndicatorProps';
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
    // console.log('handling instant change (1)', state);
    setState({
      ...state,
      instant: instant1,
      action: {
        updateScene: true,
      }
    });
  }

  const handleSourceChange = (source1: string) => {
    // console.log('handling source change (1)', state);
    setState({
      ...state,
      source: source1,
      action: {
        updateScene: true,
      }
    });
  }

  const handleIndicatorExpand = (source1: string) => {
    const isSourceChange = source1 !== state.source;
    let hatch: INDICATOR_PROPS_STATE = state.hatch === 'open-horizontal' ? 'open-vertical' : 'open-horizontal'
    if (isSourceChange) {
      hatch = 'open-horizontal';
    }
    // console.log(source1, state.source, isSourceChange);
    setState({
      ...state,
      source: source1,
      action: {
        updateScene: isSourceChange,
      },
      hatch
    });
  }

  const handlePathChange = (source: string, name: string, path: string) => {

    // console.log('handling pach update (1)', state);
    DataRepository.getInstance().getOrLoad(source).then(data => {
      data.path[name] = path;
      setState({
        ...state,
        source,
        action: {
          updateScene: true
        }
      });        
    });

  };

  // const [hovered, setHovered] = useState()
  // const selected1 = hovered ? [hovered] : undefined
  // console.log('selected1', selected1);

  // const stamp = ObjectUtil.createId();
  const instant = Date.now() - TimeUtil.MILLISECONDS_PER____DAY * 14;
  const [userInterfaceProps, setUserInterfaceProps] = useState<IUserInterfaceProps>({
    onDataPicked: handleSourceChange,
    indicatorProps: [
      {
        date: '',
        stamp: ObjectUtil.createId(),
        title: 'Inzidenz nach Alter und Bundesland',
        value: '',
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        state: 'open-horizontal',
        source: './hexmap-data-bundesland-alter.json',
        breadcrumbProps: [],
        getColor: value => Color.DARK_GREY
      },
      {
        // id: ObjectUtil.createId(),
        date: '',
        stamp: ObjectUtil.createId(),
        title: 'Inzidenz nach Bezirk',
        value: '',
        valueFormatter: FormattingDefinition.FORMATTER____FIXED,
        onExpand: handleIndicatorExpand,
        state: 'closed',
        source: './hexmap-data-bundesland-bezirk.json',
        breadcrumbProps: [],
        getColor: value => Color.DARK_GREY
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
        stamp: ObjectUtil.createId(),
        getColor: (values) => ColorUtil.getCorineColor(values.luc),
        getHeight: (values) => values.ele,
        getKey: (values) => values.gkz
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
      updateScene: false
    },
    hatch: indicatorProps.state
  });

  useEffect(() => {

    // console.log('handling data update (1)', state, TimeUtil.formatCategoryDateFull(state.instant));

    // console.log('handle data pixked', source);

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
          const h = interpolatedH.getOut(value);
          // const s = interpolatedS.getOut(value);
          // const v = interpolatedV.getOut(value);
          return new Color(h, 1, 0.4);
        }

        // console.log('data', data, );
        const values = data.data[TimeUtil.formatCategoryDateFull(state.instant)][areaPointer + dataPointer];
        if (selected) {
          indicatorProps.push({
            ...indicatorPropsInstance,
            value: indicatorPropsInstance.valueFormatter.format(values),
            breadcrumbProps: breadcrumbProps,
            stamp: ObjectUtil.createId(),
            state: state.hatch,
            date: TimeUtil.formatCategoryDateFull(state.instant),
            onExpand: handleIndicatorExpand,
            getColor
          });
        } else {
          indicatorProps.push({
            ...indicatorPropsInstance,
            value: indicatorPropsInstance.valueFormatter.format(values),
            state: 'closed',
            date: TimeUtil.formatCategoryDateFull(state.instant),
            onExpand: handleIndicatorExpand
          });
  
        }

        if (selected) {
          hexagonProps = {
            // onHover: setHovered,
            stamp: state.action.updateScene ? ObjectUtil.createId() : mapProps.hexagonProps.stamp,
            getKey: (values) => {
              return values.gkz.substring(0, areaPointer.length);
            },
            getColor: (values) => {
              const fullPointer = values.gkz.substring(0, areaPointer.length) + dataPointer;
              const value = data.data[data.date][fullPointer][0];
              return getColor(value);
              // return ColorUtil.getCorineColor(values.luc);
            },
            getHeight: (values) => {
              let ele = values.ele / 4 - 7.5 - refEle; // - 7.5;
              const fullPointer = values.gkz.substring(0, areaPointer.length) + dataPointer;
              ele += interpolatedHeight.getOut(data.data[data.date][fullPointer][0]);
              return ele;
            }
          }      
        }  

      };

      // TODO needs to be dynamic, especially color wise
      const interpolatedH = new InterpolatedValue(0.25, 0.00, 0, 500, 1);
      // const interpolatedS = new InterpolatedValue(1.00, 1.00, 0, 750, 1);
      // const interpolatedV = new InterpolatedValue(0.33, 0.33, 0, 750, 1);
      const interpolatedHeight = new InterpolatedValue(0, 100, 0, 5000, 1);
      const refEle = 0; // interpolatedHeight.getOut(data.data[data.date]['A' + postPointer][0]);

       // if (indicatorProps) {
       //   const values = data.data[TimeUtil.formatCategoryDateFull(state.instant)][areaPointer + dataPointer];
       //   indicatorProps.value = indicatorProps.valueFormatter.format(values);
       //   indicatorProps.breadcrumbProps = breadcrumbProps;
       //   indicatorProps.stamp = state.stamp;
       // }    
 
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
        * update instants
        */
       // userInterfaceProps.navigationBotProps = {
       //   ...userInterfaceProps.navigationBotProps,
       //   instantProps
       // }
 
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
        onDataPicked: handleSourceChange,
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
          stamp: state.action.updateScene ? ObjectUtil.createId() : props.stamp
        }
      });  
 
      // console.log('selectedE', selected1);
      /**
      * set map-props in way that will cause the map to pick up current data, triggers re-rendering by changing the id of the properties (a useEffect method listens for this)
      */
      // requestAnimationFrame(() => {
        setMapProps({
          // selected: selected1,
          labelProps: [...labelProps],
          lightProps,
          controlsProps,
          hexagonProps: hexagonProps! 
        });      
      // })
      // }, 10);

    });



  }, [state.instant, state.source, state.action]);   

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
    </div>
  );
  
};

