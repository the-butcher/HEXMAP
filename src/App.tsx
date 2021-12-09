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
      let postPointer: string = '';
      for (let i=0; i<names.length; i++) {
        const name = names[i];
        if (i > 0) {
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

      // attach source to props
      const instantProps: IInstantProps = {
        ...userInterfaceProps.navigationBotProps.instantProps,
        source
      }

      const refData = data.data[data.date]['A' + postPointer][0];
      console.log('refData', refData );
      const interpolatedH = new InterpolatedValue(0.5, 0, 0, 600, 1);
      const interpolatedV = new InterpolatedValue(1, 0.1, 100, 1000, 1);
      const interpolatedHeight = new InterpolatedValue(-10, 20, 0, 1000, 1);

      userInterfaceProps.navigationTopProps = {
        ...userInterfaceProps.navigationTopProps,
        breadcrumbProps
      }
      userInterfaceProps.navigationBotProps = {
        ...userInterfaceProps.navigationBotProps,
        instantProps
      }
      setUserInterfaceProps({
        ...userInterfaceProps
      });    
      setMapProps({
        ...mapProps,
        hexagonProps: {
          id: ObjectUtil.createId(),
          getColor: (values) => {
            let comp = 0;
            if (values.gkz >= 0) {
              const corineColor = ColorUtil.getCorineColor(values.luc);
              const dataPointer = values.gkz.toString().substring(0, 1) + postPointer;
              const h = interpolatedH.getOut(data.data[data.date][dataPointer][0]);
              const v = interpolatedV.getOut(data.data[data.date][dataPointer][0]);
              return new Color(h, 1, 1);
            }
            return new Color(0, 1, 1); // ColorUtil.getCorineColor(values.luc);
          },
          getHeight: (values) => {
            let ele = values.ele;
            if (values.gkz >= 0) {
              
              const dataPointer = values.gkz.toString().substring(0, 1) + postPointer;
              ele = values.ele / 3 + interpolatedHeight.getOut(data.data[data.date][dataPointer][0]);
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
      data.date = TimeUtil.formatCategoryDateFull(instant);
      console.log('data.date', data.date);
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
        source: './hexmap-data-bundesland-alter.json'
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
        instantMax: Date.now() - TimeUtil.MILLISECONDS_PER____DAY * 2,
        onInstantChange: handleInstantChange
      }
    }
  });  
  const [mapProps, setMapProps] = useState<IMapProps>({
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

