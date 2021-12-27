import * as am5 from '@amcharts/amcharts5';
import am5locales_de_DE from '@amcharts/amcharts5/locales/de_DE';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataRepository } from '../data/DataRepository';
import { TimeUtil } from '../util/TimeUtil';
import { IChartProps } from './IChartProps';

export default (props: IChartProps) => {

  const theme = useTheme();

  const fontFamily = 'Courier Prime Sans';
  const fontColor = 0xc1c1aa;

  const { source, path, fold, onInstantChange } = props;

  const [chart, setChart] = useState<am5xy.XYChart>();
  const [series, setSeries] = useState<am5xy.LineSeries[]>([]);
  const [xAxisVal, setXAxisVal] = useState<am5xy.DateAxis<am5xy.AxisRendererX>>();
  const [yAxisVal, setYAxisVal] = useState<am5xy.ValueAxis<am5xy.AxisRendererY>>();
  const [xAxisLabel, setXAxisLabel] = useState<am5.Label>();
  const [yAxisLabel, setYAxisLabel] = useState<am5.Label>();
  // const [lastCursorInstant, setLastCursorInstant] = useState<number>();

  const handleInstantChange = (instant: number) => {
    console.log('firing chart instant change');
    onInstantChange(instant);
  };

  useEffect(() => {

    console.log('building chart', source, path);

    DataRepository.getInstance().getOrLoad(source).then(data => {

      const labelColor = am5.color(fontColor);
      let lastCursorInstant: number;

      // current data pointer
      const names = Object.keys(data.keys);
      let dataPointer: string = '';
      for (let i = 0; i < names.length; i++) {
        dataPointer += data.path[names[i]];
      }
      const date = data.date;
      const valueCount = data.data[date][dataPointer].length;
      // console.log('valueCount', valueCount);

      const root = am5.Root.new('chartdiv_' + source);
      root.setThemes([
        am5themes_Dark.new(root)
      ]);
      root.numberFormatter.set('numberFormat', props.valueFormatter.chartFormat);
      root.dateFormatter.set('dateFormat', 'dd.MM.yyyy');
      root.locale = am5locales_de_DE;

      const _chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          // wheelX: 'panX',
          wheelY: 'zoomX',

          layout: root.verticalLayout,
          stateAnimationDuration: 0,
          paddingTop: 8,
          paddingRight: 5,
          paddingLeft: 5,
          paddingBottom: 4
        })
      );
      // _chart.events.on('click', () => {
      //   handleInstantChange(lastCursorInstant);
      // });

      const yRendererVal = am5xy.AxisRendererY.new(root, {});
      yRendererVal.labels.template.setAll({
        fontFamily,
        fontSize: 10,
        fill: labelColor,
        // text: `{valueY.formatNumber('${props.valueFormatter.chartFormat}')}`          
      });
      const _yAxisVal: am5xy.ValueAxis<am5xy.AxisRendererY> = _chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: yRendererVal,
        interpolationDuration: 0,
        stateAnimationDuration: 0,
        min: 0
        // logarithmic: true,
        // treatZeroAs: 0.000001,            
        // min: 1
      }));
      const _yAxisLabel = am5.Label.new(root, {
        text: props.title,
        rotation: -90,
        y: am5.p50,
        centerX: am5.p50,
        centerY: 30,
        fontFamily,
        fill: labelColor,
        fontSize: 10,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0
      });
      _yAxisVal.children.moveValue(_yAxisLabel, 0);
      _yAxisLabel?.set('visible', fold === 'open-vertical');
      _yAxisVal?.set('visible', fold === 'open-vertical');


      const dateFormats = {
        day: 'dd.MM.yyyy',
        week: 'dd.MM.yyyy',
        month: 'dd.MM.yyyy',
        year: 'dd.MM.yyyy'
      }

      const xRendererVal = am5xy.AxisRendererX.new(root, {
        // pan: 'zoom',
      });
      xRendererVal.labels.template.setAll({
        fontFamily,
        fontSize: 10,
        fill: labelColor,
        minPosition: 0.01,
        maxPosition: 0.99,
        paddingTop: 5,
        paddingBottom: 0
        // inside: true
      });
      const _xAxisVal: am5xy.DateAxis<am5xy.AxisRendererX> = _chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: 'day',
          count: 1
        },
        renderer: xRendererVal,
        tooltip: am5.Tooltip.new(root, {}),
        dateFormats,
        periodChangeDateFormats: dateFormats
      }));
      const _xAxisLabel = am5.Label.new(root, {
        text: 'Datum',
        x: am5.p50,
        centerX: am5.p50,
        fontFamily,
        fill: labelColor,
        fontSize: 10,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0
      });
      _xAxisVal.children.moveValue(_xAxisLabel, 1);
      _xAxisLabel?.set('visible', fold === 'open-vertical');


      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      var cursor = _chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'none'
      }));
      cursor.lineY.set('visible', false);
      // cursor.events.on('cursormoved', e => {
      //   const axisPosition = xAxisVal.toAxisPosition(cursor.getPrivate("positionX"));
      //   const date = xAxisVal.positionToDate(axisPosition);
      //   lastCursorInstant = date.getTime();
      // });

      const tooltip = _xAxisVal.get('tooltip')!; // xAxisVal.get('tooltip')!;
      tooltip.setAll({
        paddingTop: 1,
        paddingRight: 2,
        paddingBottom: 1,
        paddingLeft: 2,
        getFillFromSprite: false,
        getStrokeFromSprite: false,
        getLabelFillFromSprite: false
      });
      tooltip.label.setAll({
        fontFamily,
        fontSize: 10,
        fill: labelColor,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      });
      tooltip.get('background')?.setAll({
        stroke: am5.color(0x131311),
        fill: am5.color(0x42423a),
      });
      tooltip.label.adapters.add('fill', (value, target) => {
        return labelColor;
      });

      const allSeries: am5xy.LineSeries[] = [];

      for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) {

        const seriesVal = _chart.series.push(am5xy.LineSeries.new(root, {
          name: `seriesVal_${valueIndex}`,
          xAxis: _xAxisVal,
          yAxis: _yAxisVal,
          valueYField: `valueVal_${valueIndex}`,
          valueXField: 'date',
          interpolationDuration: 0,
          sequencedInterpolation: false,
          tooltip: am5.Tooltip.new(root, {}),
          stroke: am5.color(fontColor),
          fill: am5.color(fontColor),
        }));
        seriesVal.strokes.template.set('strokeWidth', 2);
        seriesVal.fills.template.setAll({ fillOpacity: 0.2, visible: true });

        allSeries.push(seriesVal);


        const tooltip = seriesVal.get('tooltip')!;
        tooltip.setAll({
          labelText: '{valueY}',
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          paddingLeft: 4,
          getFillFromSprite: false,
          getStrokeFromSprite: false,
          getLabelFillFromSprite: false,
        });
        tooltip.label.setAll({
          fill: labelColor,
          fontFamily,
          fontSize: 14,
        });
        (tooltip.get('background') as am5.PointedRectangle)!.setAll({
          stroke: am5.color(0x131311),
          fill: am5.color(0x42423a),
          cornerRadius: 0
        });
        tooltip.label.adapters.add('fill', (value, target) => {
          return labelColor;
        });

      }

      // chart.rightAxesContainer.set("layout", root.verticalLayout);

      // const scrollbar = chart.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
      //   orientation: 'horizontal',
      //   height: 73,
      //   paddingTop: 0
      // }));
      // scrollbar.get('background')!.setAll({
      //   fill: am5.color(0x42423a),
      // });
      // scrollbar.chart.set('paddingTop', 0);

      // const gStI = scrollbar.startGrip.get('icon');
      // const gStB = scrollbar.startGrip.get('background')
      // // console.log(gStI, gStB);

      // /**
      //  * some start grip modification
      //  */
      // scrollbar.startGrip.set('scale', 0.7);
      // scrollbar.startGrip.get('icon')!.set('stroke', am5.color(fontColor));
      // scrollbar.startGrip.get('background')!.set('stroke', am5.color(fontColor));

      // /**
      //  * some end grip modification
      //  */
      // scrollbar.endGrip.set('scale', 0.7);
      // scrollbar.endGrip.get('icon')!.set('stroke', am5.color(fontColor));
      // scrollbar.endGrip.get('background')!.set('stroke', am5.color(fontColor));


      // const xRendererPre = am5xy.AxisRendererX.new(root, {});
      // xRendererPre.labels.template.setAll({
      //   fontFamily,
      //   fontSize: 10,
      //   fill: labelColor
      // });      
      // const xAxisPre = scrollbar.chart.xAxes.push(am5xy.DateAxis.new(root, {
      //   groupData: true,
      //   groupIntervals: [{
      //     timeUnit: "week",
      //     count: 1
      //   }],
      //   baseInterval: {
      //     timeUnit: "day",
      //     count: 1
      //   },
      //   renderer: xRendererPre,
      //   dateFormats,
      //   periodChangeDateFormats: dateFormats
      // }));
      // // xAxisPre.get("dateFormats")["day"] = "dd.MM.yyyy";

      // const yAxisPre: am5xy.ValueAxis<am5xy.AxisRendererY> = scrollbar.chart.yAxes.push(
      //   am5xy.ValueAxis.new(root, {
      //     renderer: am5xy.AxisRendererY.new(root, {}),
      //     min: 0,
      //     // logarithmic: true,
      //     // treatZeroAs: 0.000001,
      //     // min: 1
      //   }),
      // );

      // for (let valueIndex = 0; valueIndex < valueCount; valueIndex ++) {

      //   const seriesPre = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
      //     valueYField: `valuePre_${valueIndex}`,
      //     valueXField: "date",
      //     xAxis: xAxisPre,
      //     yAxis: yAxisPre,
      //     stroke: am5.color(fontColor),
      //   }));
      //   seriesPre.fills.template.setAll({
      //     fillOpacity: 0.0
      //   });      
      //   seriesPre.strokes.template.set('strokeWidth', 2);

      //   allSeries.push(seriesPre);

      // }

      // write to state
      setChart(_chart);
      setSeries(allSeries);
      setXAxisLabel(_xAxisLabel);
      setYAxisLabel(_yAxisLabel)
      setXAxisVal(_xAxisVal);
      setYAxisVal(_yAxisVal);

      _xAxisVal.data.setAll([]);

    });



  }, []);

  useEffect(() => {

    console.log('updating chart (path)', source, path);

    const handleClick = () => {
      let cursor = chart.get('cursor');
      const axisPosition = xAxisVal.toAxisPosition(cursor.getPrivate("positionX"));
      const date = xAxisVal.positionToDate(axisPosition);
      handleInstantChange(date.getTime());
    }

    chart?.events.on('pointerdown', handleClick);
    chart?.get('cursor').events.on('pointerdown', handleClick);

    DataRepository.getInstance().getOrLoad(source).then(data => {

      const names = Object.keys(data.keys);
      let dataPointer: string = '';
      for (let i = 0; i < names.length; i++) {
        dataPointer += data.path[names[i]];
      }
      const date = data.date;

      /**
       * how many series are going to be needed
       */
      const valueCount = data.data[date][dataPointer].length;

      const chartData: unknown[] = [];
      const dates = Object.keys(data.data);
      let maxValue = Number.MIN_VALUE;
      dates.forEach(dateRaw => {
        const dataVals = data.data[dateRaw][dataPointer];
        const dataItem = {
          date: TimeUtil.parseCategoryDateFull(dateRaw),
        };
        for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) {
          if (dataVals[valueIndex] !== 0) {
            const valueY = dataVals[valueIndex];
            dataItem[`valueVal_${valueIndex}`] = valueY;
            maxValue = Math.max(maxValue, valueY);
          }
        }
        chartData.push(dataItem);
      });

      // console.log('chartData', chartData);
      series.forEach(s => {
        (s.get('yAxis') as am5xy.ValueAxis<am5xy.AxisRendererY>).set('max', maxValue);
        s.data.setAll(chartData);
        s.appear(0);
      });
      chart?.show();

    });

  }, [path]);

  useEffect(() => {

    console.log('updating chart (fold)', source, path);

    xAxisLabel?.set('visible', fold === 'open-vertical');
    yAxisLabel?.set('visible', fold === 'open-vertical');
    yAxisVal?.set('visible', fold === 'open-vertical');

  }, [fold]);

  return (
    <div id={'chartdiv_' + source} style={props.style} />
  )

}
