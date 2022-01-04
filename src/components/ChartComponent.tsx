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

    console.log('✨ building chart component', props);

    DataRepository.getInstance().getOrLoadDataSetting(source).then(dataSetting => {

      const labelColor = am5.color(fontColor);
      let lastCursorInstant: number;

      // current data pointer
      const names = dataSetting.getDataset().getKeysetKeys();
      let dataPointer: string = '';
      for (let i = 0; i < names.length; i++) {
        dataPointer += dataSetting.getPath(names[i]);
      }
      const valueCount = dataSetting.getDataset().getIndexKeyset().size(); // data.data[date][dataPointer].length;

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
        // min: -4000,
        // strictMinMax: true
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

        let seriesClass = am5xy.LineSeries;

        const indexName = dataSetting.getDataset().getIndexKeyset().getValue(valueIndex.toString());
        if (indexName === DataRepository.FAELLE) {
          seriesClass = am5xy.StepLineSeries;
        }

        const seriesVal = _chart.series.push(seriesClass.new(root, {
          name: `seriesVal_${valueIndex}`,
          xAxis: _xAxisVal,
          yAxis: _yAxisVal,
          valueYField: `value_${valueIndex}`,
          valueXField: 'instant',
          interpolationDuration: 0,
          sequencedInterpolation: false,
          tooltip: am5.Tooltip.new(root, {}),
          stroke: am5.color(fontColor),
          fill: am5.color(fontColor),
        }));

        if (indexName === DataRepository.FAELLE) {
          seriesVal.strokes.template.set('strokeWidth', 1);
          seriesVal.fills.template.setAll({ fillOpacity: 0.0, visible: true });
        } else {
          seriesVal.strokes.template.set('strokeWidth', 2);
          seriesVal.fills.template.setAll({ fillOpacity: 0.2, visible: true });
        }

        allSeries.push(seriesVal);


        const tooltip = seriesVal.get('tooltip')!;
        tooltip.setAll({
          labelText: `{label_${valueIndex}}`, // '{valueY}',
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

    console.log('🔧 updating chart component (path)', props);

    const handleClick = () => {
      let cursor = chart.get('cursor');
      const axisPosition = xAxisVal.toAxisPosition(cursor.getPrivate("positionX"));
      const date = xAxisVal.positionToDate(axisPosition);
      handleInstantChange(date.getTime());
    }

    chart?.events.on('pointerdown', handleClick);
    chart?.get('cursor').events.on('pointerdown', handleClick);

    DataRepository.getInstance().getOrBuild(source, Number.MIN_VALUE, Number.MAX_VALUE).then(chartData => {

      series.forEach(s => {
        (s.get('yAxis') as am5xy.ValueAxis<am5xy.AxisRendererY>).set('max', chartData.maxY);
        // (s.get('yAxis') as am5xy.ValueAxis<am5xy.AxisRendererY>).set('min', -4000);
        s.data.setAll(chartData.entries);
        s.appear(0);
      });
      chart?.show();

    });

  }, [path]);

  useEffect(() => {

    console.log('🔧 updating chart component (fold)', source, path);

    xAxisLabel?.set('visible', fold === 'open-vertical');
    yAxisLabel?.set('visible', fold === 'open-vertical');
    yAxisVal?.set('visible', fold === 'open-vertical');

  }, [fold]);

  return (
    <div id={'chartdiv_' + source} style={props.style} />
  )

}
