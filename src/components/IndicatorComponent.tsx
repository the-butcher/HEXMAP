import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { ExpandMore } from '@mui/icons-material';
import { Breadcrumbs, Card, CardActions, CardContent, IconButton, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataRepository } from '../data/DataRepository';
import { TimeUtil } from '../util/TimeUtil';
import { IIndicatorProps } from './IIndicatorProps';

import BreadcrumbComponent from './BreadcrumbComponent';
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { max } from 'date-fns/esm';

export default (props: IIndicatorProps) => {

    const theme = useTheme();

    const fontFamily = 'Courier Prime Sans';
    const fontColor = 0xc1c1aa;

    const { source, onExpand, breadcrumbProps } = props;
    const [ series, setSeries ] = useState<am5xy.LineSeries[]>([]);
    const [ yAxisPre, setYAxisPre ] = useState<am5xy.ValueAxis<am5xy.AxisRendererY>>();

    const openHorizontal = props.fold === 'open-horizontal' || props.fold === 'open-vertical';
    const openVertical = props.fold === 'open-vertical';
    let expandTransform = 'rotate(-90deg)'
    if (openHorizontal) {
        expandTransform = openVertical ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    const handleExpand = () => {
      onExpand(source);
    }
   
    useEffect(() => {

      const root = am5.Root.new('chartdiv_' + source);
      root.setThemes([
        am5themes_Dark.new(root)
      ]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: root.verticalLayout,
          stateAnimationDuration: 0,
          paddingTop: 0,
        })
      );     

      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      var cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'none'
      }));
      cursor.lineY.set('visible', false);

      const yRendererVal = am5xy.AxisRendererY.new(root, {});
      yRendererVal.labels.template.setAll({
        fontFamily,
        fontSize: 12,
        fill: am5.color(fontColor)
      });
      const yAxisVal = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: yRendererVal,
          interpolationDuration: 0,
          stateAnimationDuration: 0,
      }));

      const xRendererVal = am5xy.AxisRendererX.new(root, {
        pan: "zoom"
      });
      xRendererVal.labels.template.setAll({
        fontFamily,
        fontSize: 12,
        fill: am5.color(fontColor),
        minPosition: 0.01,
        maxPosition: 0.99        
      });
      const xAxisVal = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: 'day',
          count: 1
        },
        renderer: xRendererVal,
        tooltip: am5.Tooltip.new(root, {}),
      }));
      xAxisVal.get('tooltip')!.setAll({
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        paddingLeft: 4,
      });
      xAxisVal.get('tooltip')!.label.setAll({
        fontFamily,
        fontSize: 14,
        fill: am5.color(fontColor)
      });
      xAxisVal.get('tooltip')!.get('background')?.setAll({
        stroke: am5.color(0x131311),
        fill: am5.color(0x42423a),
      });

      const seriesVal = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Series',
        xAxis: xAxisVal,
        yAxis: yAxisVal,
        valueYField: 'valueVal',
        valueXField: 'date',
        interpolationDuration: 0,
        sequencedInterpolation: false,
        tooltip: am5.Tooltip.new(root, {}),
        stroke: am5.color(fontColor),
      }));
      seriesVal.strokes.template.set('strokeWidth', 3);
      // seriesVal.strokes.template.set('stroke', am5.color(fontColor));

      const tooltip = seriesVal.get('tooltip')!;
      tooltip.setAll({
        labelText: '{valueY}',
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        getFillFromSprite: false,
        getStrokeFromSprite: false,
      });
      tooltip.label.setAll({
        fontFamily,
        fontSize: 14,
        fill: am5.color(fontColor) 
      });
      (tooltip.get('background') as am5.PointedRectangle)!.setAll({
        stroke: am5.color(0x131311),
        fill: am5.color(0x42423a),
        cornerRadius: 0
      }); 

      chart.rightAxesContainer.set("layout", root.verticalLayout);

      const scrollbar = chart.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
        orientation: "horizontal",
        height: 73,
      }));
      scrollbar.get('background')!.setAll({
        fill: am5.color(0x42423a),
      });

      const gStI = scrollbar.startGrip.get('icon');
      const gStB = scrollbar.startGrip.get('background')
      // console.log(gStI, gStB);

      /**
       * some start grip modification
       */
      scrollbar.startGrip.set('scale', 0.7);
      scrollbar.startGrip.get('icon')!.set('stroke', am5.color(fontColor));
      scrollbar.startGrip.get('background')!.set('stroke', am5.color(fontColor));

      /**
       * some end grip modification
       */
      scrollbar.endGrip.set('scale', 0.7);
      scrollbar.endGrip.get('icon')!.set('stroke', am5.color(fontColor));
      scrollbar.endGrip.get('background')!.set('stroke', am5.color(fontColor));
       
     
      const xRendererPre = am5xy.AxisRendererX.new(root, {});
      xRendererPre.labels.template.setAll({
        fontFamily,
        fontSize: 12,
        fill: am5.color(fontColor)
      });      
      const xAxisPre = scrollbar.chart.xAxes.push(am5xy.DateAxis.new(root, {
        groupData: true,
        groupIntervals: [{
          timeUnit: "week",
          count: 1
        }],
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: xRendererPre
      }));
      
      const yAxisPre: am5xy.ValueAxis<am5xy.AxisRendererY> = scrollbar.chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        }),
      );
      
      const seriesPre = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
        valueYField: "valuePre",
        valueXField: "date",
        xAxis: xAxisPre,
        yAxis: yAxisPre,
        stroke: am5.color(fontColor),
      }));
      seriesPre.fills.template.setAll({
        fillOpacity: 0.0
      });      
      seriesPre.strokes.template.set('strokeWidth', 2);

      // write to state
      setSeries([seriesVal, seriesPre]);
      setYAxisPre(yAxisPre);

      xAxisVal.data.setAll([]);            

    }, []);    

    useEffect(() => {

      console.log('source changed, updating chart', props.path);

      DataRepository.getInstance().getOrLoad(props.source).then(data => {

        const names = Object.keys(data.keys);
        let dataPointer: string = '';
        for (let i=0; i<names.length; i++) {
          dataPointer += data.path[names[i]];
        }

        const chartData: unknown[] = [];
        const dates = Object.keys(data.data);
        dates.forEach(dateRaw => {
          const value = data.data[dateRaw][dataPointer][0];
          chartData.push({
            date: TimeUtil.parseCategoryDateFull(dateRaw),
            valueVal: value,
            valuePre: value,
          });

        });

        // console.log('chartData', chartData);
        series.forEach(s => {
          s.data.setAll(chartData);
          s.appear(0);
        });

      });

    }, [props.path]);  

    return (
      <div style={{ flexGrow: openHorizontal ? '2' : '0', transition: 'all 250ms ease-in-out' }}>
        <Card elevation={4}>
          <CardContent style={{ display: 'flex', flexDirection: 'column', width: openHorizontal ? 'inherit' : '150px', overflow: 'hidden', transition: 'all 250ms ease-in-out' }} >
            <div style={{ display: 'flex', flexDirection: 'row', width: 'inherit', height: '22px'}}>
              <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingTop: '1px' }}>{ props.title }</div>
              <Breadcrumbs aria-label="breadcrumb" style={{ display: openHorizontal ? 'block' : 'none', paddingLeft: '12px' }}>
              { breadcrumbProps.map(props => <BreadcrumbComponent {...props} />) }
              </Breadcrumbs>              
            </div>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
              <div style={{ display: 'flex', flexDirection: 'column'}}>
                <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                  <div style={{ fontSize: '2.6em', position: 'relative', top: '7px', height: '40px', width: '110px', textAlign: 'right' }}>{ props.value }</div>
                  <div style={{ textAlign: 'right' }}>{ props.date }</div>
                  <div style={{ fontSize: '1.3em', position: 'relative', top: '10px', height: '40px', width: '110px', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '50%' }}>+10,2%<br /><span style={{ fontSize: '0.4em' }}>gegenüber Vorwoche</span></div>
                </div>
                <CardActions disableSpacing style={{ padding: '0px', margin: 'auto', marginRight: '0px', transform: expandTransform }}>
                  <IconButton key={ props.source } aria-label='share' onPointerUp={ handleExpand }>
                    <ExpandMore style={{ width: '24px', height: '24px', color: 'var(--color-text)' }} />
                  </IconButton>                  
                </CardActions>       
                </div>
              </div>
              <div style={{ overflow: 'hidden', width: '100%', height: openVertical ? '500px' : '90px', transition: 'all 250ms ease-in-out' }}>
                <div id={ 'chartdiv_' + props.source } style={{ width: 'inherit', height: 'inherit', overflow: 'hidden', display: openHorizontal ? 'block' : 'none' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
    )

}

// , transition: 'all 250ms ease-in-out'