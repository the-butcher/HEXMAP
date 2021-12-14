import { useState } from 'react';
import { IBreadcrumbProps } from './components/IBreadcrumbProps';
import { IIndicatorProps } from './components/IIndicatorProps';
import { IInstantProps } from './components/IInstantProps';
import { IMapProps } from './components/IMapProps';
import { INavigationBotProps } from './components/INavigationBotProps';
import { IUserInterfaceProps } from './components/IUserInterfaceProps';
import MapComponent from './components/MapComponent';
import UserInterfaceComponent from './components/UserInterfaceComponent';
import { DataRepository } from './data/DataRepository';
import { Color } from './util/Color';
import { ColorUtil } from './util/ColorUtil';
import { InterpolatedValue } from './util/InterpolatedValue';
import { ObjectUtil } from './util/ObjectUtil';
import { TimeUtil } from './util/TimeUtil';

export default () => {

  const handleIndicatorExpand = (id: string) => {

    /**
     * set everything but indicator identiable by id to closed
     */
    userInterfaceProps.indicatorProps.filter(p => p.id !== id).forEach(props => props.state = 'closed');

    /**
     * open indicator identifiable by id
     */
    const indicatorProps = userInterfaceProps.indicatorProps.find(p => p.id === id);
    if (indicatorProps) {
      indicatorProps.state = indicatorProps.state === 'open-horizontal' ? 'open-vertical' : 'open-horizontal'; 
      indicatorProps.stamp = ObjectUtil.createId(); // <-- mark for update
      handleDataPicked(indicatorProps.source);
    } else {
      console.warn('failed to find props for id', id); 
    }

  }


  const handlePathChange = (source: string, name: string, path: string) => {

    DataRepository.getInstance().getOrLoad(source).then(data => {
      data.path[name] = path;
      const indicatorProps = userInterfaceProps.indicatorProps.find(props => props.source === source);
      if (indicatorProps) {
        indicatorProps.stamp = ObjectUtil.createId(); // <-- mark for update
      }
      handleDataPicked(source);
    });

  }

  const handleDataPicked = (source: string) => {

    // console.log('handle data pixked', source);
    DataRepository.getInstance().getOrLoad(source).then(data => {
      
      /**
       * set up breadcrumbs to show options of current indicator
       */
      const breadcrumbProps: IBreadcrumbProps[] = [];

      const names = Object.keys(data.keys);
      mapProps.labelProps[0].label = data.name;

      let areaPointer: string = '';
      let dataPointer: string = '';
      for (let i=0; i<names.length; i++) {
        const name = names[i];
        if (i === 0) {
          areaPointer = data.path[name]; // i.e. '9' - Vienna as province/Bundesland, '900' - Vienna as district/Bezirk
          // mapProps.labelProps[1].label = `${name}: ${data.keys[name][areaPointer]}`;
        } else {
          dataPointer += data.path[name];
          mapProps.labelProps[i].label = data.keys[name][dataPointer];
        }
        breadcrumbProps.push({
          source, 
          name,
          keys: data.keys[name],
          path: data.path[name],
          onPathChange: handlePathChange,
        });
      };

      mapProps.labelProps[names.length].label = TimeUtil.formatCategoryDateFull(mapProps.controlsProps.instant);

      for (let i=names.length + 1; i<mapProps.labelProps.length; i++) {
        mapProps.labelProps[i].label = '';
      }
      
      
 
      /**
       * update instant props with current source
       * this is done so the date-slider and date-picker components can call back with the current source
       * and could probably also be solved by putting source on state in this component
       */
      const instantProps: IInstantProps = {
        ...userInterfaceProps.navigationBotProps.instantProps,
        source
      }

      const indicatorProps = userInterfaceProps.indicatorProps.find(props => props.source === source);
      if (indicatorProps) {
        // console.log(TimeUtil.formatCategoryDateFull(instantProps.instantCur), areaPointer + dataPointer);
        indicatorProps.value = data.data[TimeUtil.formatCategoryDateFull(instantProps.instantCur)][areaPointer + dataPointer][0].toLocaleString(undefined, {minimumFractionDigits: 2});
        indicatorProps.breadcrumbProps = breadcrumbProps;
      }    

      // TODO needs to be dynamic, especially color wise
      const interpolatedH = new InterpolatedValue(0.25, 0.00, 0, 500, 1);
      const interpolatedS = new InterpolatedValue(1.00, 1.00, 0, 750, 1);
      const interpolatedV = new InterpolatedValue(0.50, 0.75, 0, 750, 1);
      const interpolatedHeight = new InterpolatedValue(0, 100, 0, 5000, 1);
      const refEle = 0; // interpolatedHeight.getOut(data.data[data.date]['A' + postPointer][0]);

      // /**
      //  * update breadcrumbs
      //  */
      // userInterfaceProps.navigationTopProps = {
      //   ...userInterfaceProps.navigationTopProps,
      //   breadcrumbProps
      // }

      /**
       * update instants
       */
      userInterfaceProps.navigationBotProps = {
        ...userInterfaceProps.navigationBotProps,
        instantProps
      }

      /**
       * actual update of user interface props
       */
      setUserInterfaceProps({
        ...userInterfaceProps
      });    

      /**
       * set map-props in way that will cause the map to pick up current data, triggers re-rendering by changing the id of the properties (a useEffect method listens for this)
       */
      setMapProps({
        ...mapProps,
        hexagonProps: {
          id: ObjectUtil.createId(),
          getColor: (values) => {
            if (values.gkz) {
              // const corineColor = ColorUtil.getCorineColor(values.luc);
              const fullPointer = values.gkz.substring(0, areaPointer.length) + dataPointer;
              const h = interpolatedH.getOut(data.data[data.date][fullPointer][0]);
              const s = interpolatedS.getOut(data.data[data.date][fullPointer][0]);
              const v = interpolatedV.getOut(data.data[data.date][fullPointer][0]);
              return new Color(h, s, v);
            }
            return ColorUtil.getCorineColor(values.luc);
          },
          getHeight: (values) => {
            let ele = values.ele / 4 - 7.5 - refEle; // - 7.5;
            if (values.gkz) {
              
              // const dataPointer = values.gkz.toString().substring(0, 1) + postPointer;
              const fullPointer = values.gkz.substring(0, areaPointer.length) + dataPointer;
              ele += interpolatedHeight.getOut(data.data[data.date][fullPointer][0]);

            }
            return ele;
            // return values.ele - 7.5;
            
          }
        }
      })

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
  const handleInstantChange = (source: string, instant: number) => {

    DataRepository.getInstance().getOrLoad(source).then(data => {
      userInterfaceProps.navigationBotProps.instantProps.instantCur = instant;
      mapProps.controlsProps.instant = instant;
      mapProps.lightProps.forEach(props => {
        props.instant = instant;
      });
      // mapProps.labelProps.label = TimeUtil.formatCategoryDateFull(instant);
      data.date = TimeUtil.formatCategoryDateFull(instant);
      handleDataPicked(source);
    });

  }


  /**
   * initial settings
   */
  const [userInterfaceProps, setUserInterfaceProps] = useState<IUserInterfaceProps>({
    onDataPicked: handleDataPicked,
    indicatorProps: [
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        title: 'Inzidenz nach Alter und Bundesland',
        value: '',
        onExpand: handleIndicatorExpand,
        state: 'open-horizontal',
        source: './hexmap-data-bundesland-alter.json',
        breadcrumbProps: []
      },
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        title: 'Inzidenz nach Bezirk',
        value: '',
        onExpand: handleIndicatorExpand,
        state: 'closed',
        source: './hexmap-data-bundesland-bezirk.json',
        breadcrumbProps: []
      }  
    ],
    navigationTopProps: {
      breadcrumbProps: []
    },
    navigationBotProps: { 
      instantProps: {
        source: '',
        instantCur: Date.now() - TimeUtil.MILLISECONDS_PER____DAY * 10,
        instantMin: new Date('2020-03-01').getTime(),
        instantMax: Date.now() - TimeUtil.MILLISECONDS_PER____DAY * 10,
        onInstantChange: handleInstantChange
      }
    }
  });  
  const [mapProps, setMapProps] = useState<IMapProps>({
    lightProps: [
      {
        id: ObjectUtil.createId(),
        instant: Date.now(),
        position: {
          x: 300,
          y: 200,
          z: -300
        }
      },
      {
        id: ObjectUtil.createId(),
        instant: Date.now(),
        position: {
          x: -300,
          y: 200,
          z: -150
        }
      }      
    ],
    controlsProps: {
      instant: Date.now(),
    },
    hexagonProps: {
        id: ObjectUtil.createId(),
        getColor: (values) => ColorUtil.getCorineColor(values.luc),
        getHeight: (values) => values.ele
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


  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
    </div>
  );
  
};

