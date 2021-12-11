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

  const handlePathChange = (source: string, name: string, path: string) => {

    DataRepository.getInstance().getOrLoad(source).then(data => {
      data.path[name] = path;
      handleDataPicked(source);
    });

  }

  const handleDataPicked = (source: string) => {

    // console.log('handle data pixked', source);
    DataRepository.getInstance().getOrLoad(source).then(data => {
      
      const breadcrumbProps: IBreadcrumbProps[] = [];
      const names = Object.keys(data.keys);
      let path;
      let prefPointer: string = '';
      let postPointer: string = '';
      for (let i=0; i<names.length; i++) {
        const name = names[i];
        if (i === 0) {
          prefPointer = data.path[name];
        } else {
          postPointer += data.path[name];
        }
        breadcrumbProps.push({
          source, 
          name,
          keys: data.keys[name],
          path: data.path[name],
          onPathChange: handlePathChange,
        });
      };

      console.log('prefPointer', prefPointer, 'postPointer', postPointer);

      // attach source to props
      const instantProps: IInstantProps = {
        ...userInterfaceProps.navigationBotProps.instantProps,
        source
      }

      // console.log('refData', refData );
      const interpolatedH = new InterpolatedValue(0.25, 0.00, 0, 500, 1);
      const interpolatedS = new InterpolatedValue(1.00, 1.00, 0, 750, 1);
      const interpolatedV = new InterpolatedValue(0.50, 0.75, 0, 750, 1);
      const interpolatedHeight = new InterpolatedValue(0, 100, 0, 5000, 1);
      const refEle = 0; // interpolatedHeight.getOut(data.data[data.date]['A' + postPointer][0]);

      /**
       * update breadcrumbs
       */
      userInterfaceProps.navigationTopProps = {
        ...userInterfaceProps.navigationTopProps,
        breadcrumbProps
      }

      /**
       * update instants
       */
      userInterfaceProps.navigationBotProps = {
        ...userInterfaceProps.navigationBotProps,
        instantProps
      }

      /**
       * let react know about updates
       */
      setUserInterfaceProps({
        ...userInterfaceProps
      });    
      setMapProps({
        ...mapProps,
        hexagonProps: {
          id: ObjectUtil.createId(),
          getColor: (values) => {
            if (values.gkz) {
              const corineColor = ColorUtil.getCorineColor(values.luc);
              const dataPointer = values.gkz.substring(0, prefPointer.length) + postPointer;
              const h = interpolatedH.getOut(data.data[data.date][dataPointer][0]);
              const s = interpolatedS.getOut(data.data[data.date][dataPointer][0]);
              const v = interpolatedV.getOut(data.data[data.date][dataPointer][0]);
              return new Color(h, s, v);
            }
            return ColorUtil.getCorineColor(values.luc);
          },
          getHeight: (values) => {
            let ele = values.ele / 5 - 7.5 - refEle; // - 7.5;
            if (values.gkz) {
              
              // const dataPointer = values.gkz.toString().substring(0, 1) + postPointer;
              const dataPointer = values.gkz.substring(0, prefPointer.length) + postPointer;
              ele += interpolatedHeight.getOut(data.data[data.date][dataPointer][0]);

            }
            return ele;
            
          }
        }
      })

    });

  }  

  const handleInstantChange = (source: string, instant: number) => {

    // console.log('instant', instant)
    DataRepository.getInstance().getOrLoad(source).then(data => {
      userInterfaceProps.navigationBotProps.instantProps.instantCur = instant;
      mapProps.controlsProps.instant = instant;
      // mapProps.labelProps.label = TimeUtil.formatCategoryDateFull(instant);
      data.date = TimeUtil.formatCategoryDateFull(instant);
      handleDataPicked(source);
    });

  }

  const handleExpand = (id: string) => {

    userInterfaceProps.indicatorProps.filter(p => p.id !== id).forEach(props => props.state = 'closed');

    const displayableProps: IIndicatorProps | undefined = userInterfaceProps.indicatorProps.find(p => p.id === id);
    if (displayableProps) {
      displayableProps.state = displayableProps.state === 'open-horizontal' ? 'open-vertical' : 'open-horizontal'; 
      handleDataPicked(displayableProps.source);
    } else {
      console.warn('failed to find props for id', id); 
    }

  }

  const [userInterfaceProps, setUserInterfaceProps] = useState<IUserInterfaceProps>({
    onDataPicked: handleDataPicked,
    indicatorProps: [
      {
        id: ObjectUtil.createId(),
        title: 'Inzidenz1',
        value: '1.001',
        onExpand: handleExpand,
        state: 'closed',
        source: './hexmap-data-bundesland-alter.json'
      },
      {
        id: ObjectUtil.createId(),
        title: 'Inzidenz2',
        value: '1.001',
        onExpand: handleExpand,
        state: 'closed',
        source: './hexmap-data-bundesland-bezirk.json'
      }  
    ],
    navigationTopProps: {
      breadcrumbProps: []
    },
    navigationBotProps: { 
      instantProps: {
        source: '',
        instantCur: Date.now(),
        instantMin: new Date('2020-03-01').getTime(),
        instantMax: Date.now() - TimeUtil.MILLISECONDS_PER____DAY * 3,
        onInstantChange: handleInstantChange
      }
    }
  });  
  const [mapProps, setMapProps] = useState<IMapProps>({
    controlsProps: {
      instant: Date.now(),
    },
    hexagonProps: {
        id: ObjectUtil.createId(),
        getColor: (values) => ColorUtil.getCorineColor(values.luc),
        getHeight: (values) => values.ele
    }
  });


  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
    </div>
  );
  
};

