import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { ExpandMore } from '@mui/icons-material';
import { Breadcrumbs, Card, CardActions, CardContent, IconButton, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataRepository } from '../data/DataRepository';
import { TimeUtil } from '../util/TimeUtil';
import { IIndicatorProps } from './IIndicatorProps';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import BreadcrumbComponent from './BreadcrumbComponent';

export default (props: IIndicatorProps) => {

    const theme = useTheme();

    const { onExpand, breadcrumbProps } = props;

    const [ series, setSeries ] = useState<am5xy.LineSeries>();

    const openHorizontal = props.state === 'open-horizontal' || props.state === 'open-vertical';
    const openVertical = props.state === 'open-vertical';
    let expandTransform = 'rotate(-90deg)'
    if (openHorizontal) {
        expandTransform = openVertical ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    const handleExpand = () => {
      onExpand(props.id);
    }
   
    useEffect(() => {

      const root = am5.Root.new('chartdiv_' + props.id);
      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          wheelX: 'zoomX'
        })
      );     

      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      var cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'none'
      }));
      cursor.lineY.set('visible', false);

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );
      let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: 'day',
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      }));

      const series = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date'
      }));

      let tooltip = am5.Tooltip.new(root, {});
      tooltip.setAll({
        labelText: '{valueY}',
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        getFillFromSprite: false
      })
      tooltip.label.setAll({
        fontFamily: 'Consolas',
        fontSize: 14,
        
      });
      tooltip.get('background')!.setAll({
        stroke: am5.color(0x666666),
        fill: am5.color(0xffffff)
        
      });
      series.set('tooltip', tooltip);

      // series.get('tooltip')!.label.set('fontFamily', 'Consolas');
      // series.get('tooltip')!.get('background')!.setAll({
      //   fill: am5.color(0x666666)

      // });
      // write to state
      setSeries(series);

      xAxis.data.setAll([]);            

    }, []);    

    useEffect(() => {

      // console.log('stamp changed, updating chart', props.title);

      DataRepository.getInstance().getOrLoad(props.source).then(data => {

        const names = Object.keys(data.keys);
        let dataPointer: string = '';
        for (let i=0; i<names.length; i++) {
          dataPointer += data.path[names[i]];
        }

        const chartData: unknown[] = [];
        const dates = Object.keys(data.data);
        dates.forEach(dateRaw => {

          chartData.push({
            date: TimeUtil.parseCategoryDateFull(dateRaw),
            value: data.data[dateRaw][dataPointer][0]
          });

        });

        // console.log('chartData', chartData);
        if (series) {
          series.data.setAll(chartData);
          series.appear(1000);
          series.strokes.template.set('strokeWidth', 2);
          series.strokes.template.set('stroke', am5.color(0x666666));
          // series.fills.template.setAll({
          //   visible: true,
          //   fillOpacity: 0.4
          // });
        }

                

      });

      // TODO :: anything that has to happen when i.e. the chart opens

    }, [props.stamp]);  

    // useEffect(() => {

    // }, [props.breadcrumbProps]);  

    return (
      <div style={{ flexGrow: openHorizontal ? '2' : '0', transition: 'all 250ms ease-in-out' }}>
        <Card elevation={4}>
          <CardContent style={{ display: 'flex', flexDirection: 'column', width: openHorizontal ? 'inherit' : '150px', overflow: 'hidden' }} >
            <div style={{ display: 'flex', flexDirection: 'row', width: 'inherit', backgroundColor: '#ffaaaa', alignItems: 'center'}}>
              <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', backgroundColor: '#aaffaa' }}>{ props.title }</div>
              <Breadcrumbs aria-label="breadcrumb" style={{ display: openHorizontal ? 'block' : 'none', paddingLeft: '12px' }}>
              { breadcrumbProps.map(props => <BreadcrumbComponent {...props} />) }
              </Breadcrumbs>              
            </div>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
              <div style={{ display: 'flex', flexDirection: 'column'}}>
                <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div style={{ fontSize: openHorizontal ? '2em' : '1.5em', position: 'relative', top: '7px', height: '40px', width: '110px', textAlign: 'right', transition: 'font-size 250ms ease-in-out' }}>{ props.value }</div>
                <CardActions disableSpacing style={{ padding: '0px', margin: 'auto', marginRight: '0px', transform: expandTransform, transition: 'transform 250ms ease-in-out' }}>
                  <IconButton key={props.id} aria-label='share' onPointerUp={ handleExpand }>
                    <ExpandMore />
                  </IconButton>                  
                </CardActions>       
                </div>
              </div>
              <div style={{ overflow: 'hidden', width: '100%', height: openVertical ? '500px' : '0px', transition: 'all 250ms ease-in-out' }}>
                <div id={ 'chartdiv_' + props.id } style={{ width: 'inherit', height: 'inherit', overflow: 'hidden', display: openHorizontal ? 'block' : 'none' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
    )

}