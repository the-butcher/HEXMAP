import * as am5 from '@amcharts/amcharts5';
import { IExportingImageOptions } from '@amcharts/amcharts5/.internal/plugins/exporting/Exporting';
import am5locales_de_DE from '@amcharts/amcharts5/locales/de_DE';
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { DataRepository } from '../data/DataRepository';
import { ObjectUtil } from '../util/ObjectUtil';
import { TimeUtil } from '../util/TimeUtil';
import { IChartProps } from './IChartProps';
import { IChartState } from './IChartState';

export type SERIES_TYPE = 'line' | 'step';

export default (props: IChartProps) => {

  const theme = useTheme();

  const fontFamily = 'Courier Prime Sans';
  const fontColor = 0xc1c1aa;

  let { id, source, path, fold, name, instant, instantMin, instantMax, doExport, onInstantRangeChange, onSeriesVisibilityChange } = props;

  const openHorizontal = fold === 'open-horizontal' || fold === 'open-vertical';
  const openVertical = fold === 'open-vertical';
  let expandTransform = 'rotate(-90deg)'
  if (openHorizontal) {
    expandTransform = openVertical ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  const [chartState, setChartState] = useState<IChartState>();
  const handleInstantRangeChange = useRef<(instantMin1: number, instantMax1: number) => void>((instantMin1: number, instantMax1: number) => {
    // no op initially 
  });
  const handleSeriesVisibilityChange = useRef<(name: string, visibility: boolean) => void>((name: string, visibility: boolean) => {
    // no op initially 
  });

  useEffect(() => {

    console.debug('✨ building chart component', props);
    const tsA = Date.now();

    const dataSetting = DataRepository.getInstance().getDataSetting(source);

    const labelColor = am5.color(fontColor);
    const valueCount = dataSetting.getDataset().getIndexKeyset().size(); // data.data[date][dataPointer].length;

    const _root = am5.Root.new(`chartdiv_${id}`);
    _root.setThemes([
      am5themes_Dark.new(_root)
    ]);
    _root.numberFormatter.set('numberFormat', props.valueFormatter.chartFormat);
    _root.dateFormatter.set('dateFormat', 'dd.MM.yyyy');
    _root.locale = am5locales_de_DE;

    let legendRoot = _root;
    if (!doExport) {
      legendRoot = am5.Root.new(`legenddiv_${id}`);
    }

    let _legend = legendRoot.container.children.push(
      am5.Legend.new(legendRoot, {
        width: am5.percent(100),
        x: am5.percent(50),
        y: am5.percent(100),
        centerX: am5.percent(50),
        centerY: am5.percent(100),
        useDefaultMarker: true,
        paddingLeft: doExport ? 50 : 0
      })
    );
    _legend.labels.template.setAll({
      fontFamily,
      fontSize: 10,
      fill: labelColor,
      height: 10
    });
    _legend.markerRectangles.template.setAll({
      width: 16,
      height: 10,
      y: 5
    });

    if (!doExport) {
      _legend.setAll({
        layout: legendRoot.verticalLayout,
      });
      _legend.itemContainers.template.setAll({
        paddingBottom: 0,
        paddingTop: 0
      });
      _legend.markerRectangles.template.setAll({
        x: 115
      });
      _legend.labels.template.setAll({
        x: 116,
        textAlign: 'right',
      });
    }


    const _chart = _root.container.children.push(
      am5xy.XYChart.new(_root, {
        panX: false,
        panY: false,
        // wheelX: 'panX',
        wheelY: 'zoomX',
        layout: _root.verticalLayout,
        stateAnimationDuration: 0,
        paddingTop: 8,
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: doExport ? 25 : 4,
        background: am5.Rectangle.new(_root, {
          fill: am5.color(0x42423a),
          fillOpacity: doExport ? 1.0 : 0.0
        })
      })
    );

    _chart.zoomOutButton.set('scale', 0.7);
    _chart.zoomOutButton.get('background').setAll({
      'fill': am5.color(0x42423a),
      'strokeWidth': 0
    });

    const yRendererVal = am5xy.AxisRendererY.new(_root, {});
    yRendererVal.labels.template.setAll({
      fontFamily,
      fontSize: 10,
      fill: labelColor,
      // text: `{valueY.formatNumber('${props.valueFormatter.chartFormat}')}`          
    });
    const _yAxisVal: am5xy.ValueAxis<am5xy.AxisRendererY> = _chart.yAxes.push(am5xy.ValueAxis.new(_root, {
      renderer: yRendererVal,
      interpolationDuration: 0,
      stateAnimationDuration: 0,
      min: 0,
      // logarithmic: true,
      // treatZeroAs: 0.000001,
      // min: 1
    }));
    const _yAxisLabel = am5.Label.new(_root, {
      text: name,
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
    _yAxisLabel?.set('visible', fold === 'open-vertical' || doExport);
    _yAxisVal?.set('visible', fold === 'open-vertical' || doExport);

    const dateFormats = {
      day: 'dd.MM.yyyy',
      week: 'dd.MM.yyyy',
      month: 'dd.MM.yyyy',
      year: 'dd.MM.yyyy'
    }

    const xRendererVal = am5xy.AxisRendererX.new(_root, {
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
    const _xAxisVal: am5xy.DateAxis<am5xy.AxisRendererX> = _chart.xAxes.push(am5xy.DateAxis.new(_root, {
      maxDeviation: 0.2,
      baseInterval: { timeUnit: "day", count: 1 },
      gridIntervals: [
        { timeUnit: "week", count: 1 },
        { timeUnit: "month", count: 1 },
        { timeUnit: "month", count: 3 }
      ],
      renderer: xRendererVal,
      tooltip: am5.Tooltip.new(_root, {}),
      dateFormats,
      periodChangeDateFormats: dateFormats,
      exportable: true,
      min: instantMin > 0 ? instantMin : undefined,
      max: instantMax > 0 ? instantMax : undefined
    }));
    const _xAxisLabel = am5.Label.new(_root, {
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
    _xAxisLabel?.set('visible', fold === 'open-vertical' || doExport);

    let _chartTitle = am5.Label.new(_root, {
      text: `${ObjectUtil.buildIndicatorTitle(props)}, ${ObjectUtil.buildBreadcrumbTitle(props.breadcrumbProps)}`,
      fontFamily,
      fill: labelColor,
      fontSize: 10,
      x: am5.p50,
      centerX: am5.p50
    });
    _chart.children.moveValue(_chartTitle, 0);
    _chartTitle?.set('visible', doExport);

    let _exporting = am5exporting.Exporting.new(_root, {});

    let positionX: number;
    if (doExport) {
      positionX = (instant + TimeUtil.MILLISECONDS_PER___HOUR * 11 - instantMin) / (instantMax - instantMin);
    }

    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let _cursor = _chart.set('cursor', am5xy.XYCursor.new(_root, {
      behavior: 'zoomX',
      alwaysShow: true, // doExport,
      exportable: true,
      positionX
    }));
    _cursor.lineY.set('visible', false);

    const tooltip = _xAxisVal.get('tooltip')!;
    tooltip.setAll({
      paddingTop: 1,
      paddingRight: 2,
      paddingBottom: 1,
      paddingLeft: 2,
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      getLabelFillFromSprite: false,
      exportable: true
    });
    tooltip.label.setAll({
      fontFamily,
      fontSize: 10,
      fill: labelColor,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 2,
    });
    (tooltip.get('background') as am5.PointedRectangle)?.setAll({
      stroke: am5.color(0x131311),
      fill: am5.color(0x42423a),
      strokeOpacity: 0,
      cornerRadius: 0,
      shadowOffsetX: 3,
      shadowOffsetY: 3,
      shadowColor: am5.color(0x000000),
      shadowBlur: 3,
      shadowOpacity: 0.3,
    });
    tooltip.label.adapters.add('fill', (value, target) => {
      return labelColor;
    });

    const _series: am5xy.LineSeries[] = [];

    for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) {

      let seriesClass = am5xy.LineSeries;

      const seriesLabel = dataSetting.getDataset().getIndexKeyset().getValue(valueIndex);
      const seriesStyle = dataSetting.getDataset().getIndexKeyset().getSeriesStyle(valueIndex);
      if (seriesStyle.type === 'step') {
        seriesClass = am5xy.StepLineSeries;
      }
      // const seriesColor = dataSetting.getDataset().getIndexKeyset().getSeriesColor(valueIndex);

      let visibility = true;
      const visibiltyKeys = Object.keys(props.seriesVisibilities);
      if (visibiltyKeys.indexOf(seriesLabel) >= 0) {
        visibility = props.seriesVisibilities[seriesLabel];
        console.log('got explicit setting for', seriesLabel, props.seriesVisibilities[seriesLabel])
      }

      const seriesVal = _chart.series.push(seriesClass.new(_root, {
        name: seriesLabel,
        xAxis: _xAxisVal,
        yAxis: _yAxisVal,
        valueYField: `value_${valueIndex}`,
        valueXField: 'instant',
        interpolationDuration: 0,
        sequencedInterpolation: false,
        tooltip: am5.Tooltip.new(_root, {}),
        stroke: am5.color(seriesStyle.color),
        fill: am5.color(seriesStyle.fill),
        stacked: seriesStyle.stacked,
        visible: visibility
      }));

      seriesVal.fills.template.setAll({
        fillOpacity: seriesStyle.fillOpacity,
        visible: seriesStyle.fillOpacity > 0,
      });
      seriesVal.strokes.template.set('strokeWidth', seriesStyle.strokeWidth);
      if (seriesStyle.strokeDasharray) {
        seriesVal.strokes.template.set('strokeDasharray', seriesStyle.strokeDasharray);
      }
      _series.push(seriesVal);

      seriesVal.on('visible', (visible, target) => {
        handleSeriesVisibilityChange.current(seriesLabel, visible);
      });

      const tooltip = seriesVal.get('tooltip')!;
      tooltip.setAll({
        labelText: `[fontSize: 10px]${seriesLabel}:[/] {label_${valueIndex}}`, // '{valueY}',
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        paddingLeft: 6,
        getFillFromSprite: false,
        getStrokeFromSprite: false,
        getLabelFillFromSprite: false,
        exportable: true
      });
      tooltip.label.setAll({
        fill: labelColor,
        fontFamily,
        fontSize: 14,
      });
      (tooltip.get('background') as am5.PointedRectangle)!.setAll({
        stroke: am5.color(0xFF0011),
        fill: am5.color(0x42423a),
        strokeOpacity: 0,
        cornerRadius: 0,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowColor: am5.color(0x000000),
        shadowBlur: 3,
        shadowOpacity: 0.3,
      });
      tooltip.label.adapters.add('fill', (value, target) => {
        return labelColor;
      });

    }

    const _chartState: IChartState = {
      root: _root,
      chart: _chart,
      legend: _legend,
      cursor: _cursor,
      series: _series,
      xAxisLabel: _xAxisLabel,
      yAxisLabel: _yAxisLabel,
      xAxisVal: _xAxisVal,
      yAxisVal: _yAxisVal,
      exporting: _exporting
    };

    if (!doExport) {
      _chart.events.on('globalpointermove', e => {
        if (_chart.inPlot(e.point)) {
          _cursor.show();
          _cursor.remove('positionX');
        }
      });
    }

    let instantMinC: number;
    let instantMaxC: number;
    const handleStartEndChanged = (chartState1: IChartState) => {

      const daysShown = (instantMaxC - instantMinC) / TimeUtil.MILLISECONDS_PER____DAY;
      // chartState1.xAxisVal.series.forEach(s => {
      //   if (daysShown > 120 && s instanceof am5xy.StepLineSeries) {
      //     s.hide();
      //   } else {
      //     s.show();
      //   }
      // });
      handleInstantRangeChange.current(instantMinC, instantMaxC);

    };
    _chartState.xAxisVal.adapters.add('start', (value, target) => {
      instantMinC = TimeUtil.trimInstant(_chartState.xAxisVal.positionToValue(value));
      requestAnimationFrame(() => {
        handleStartEndChanged(_chartState);
      });
      return Math.max(0, _chartState.xAxisVal.valueToPosition(instantMinC));
    });
    _chartState.xAxisVal.adapters.add('end', (value, target) => {
      instantMaxC = TimeUtil.trimInstant(_chartState.xAxisVal.positionToValue(value));
      console.log('instantMaxC', TimeUtil.formatCategoryDateFull(instantMaxC));
      requestAnimationFrame(() => {
        handleStartEndChanged(_chartState);
      });
      return Math.min(1, _chartState.xAxisVal.valueToPosition(instantMaxC));
    });

    // write to state
    setChartState(_chartState);

    _xAxisVal.data.setAll([]);



    // https://www.amcharts.com/docs/v5/concepts/exporting/exporting-images/
    if (doExport) {

      // updateInstants(_chartState);

      let exportChartTo = -1;
      const frameendedDisposer = _root.events.on('frameended', () => {

        window.clearTimeout(exportChartTo);
        exportChartTo = window.setTimeout(() => {

          frameendedDisposer.dispose();

          const formatOption: IExportingImageOptions = {
            minWidth: 1200,
            maxWidth: 1200,
            minHeight: 675,
            maxHeight: 675
          }
          _exporting.export("png", formatOption).then(imgData => {

            var a = document.createElement('a');
            var url = imgData;
            a.href = url;
            a.download = `chart____${Date.now()}`;
            a.click();

          });

        }, 500);

        // }

      });

    };

    console.debug('🕓 updating chart component (done)', Date.now() - tsA);

  }, []);


  const updatePath = (chartState: IChartState) => {

    const chartData = DataRepository.getInstance().getChartData(source, Number.MIN_VALUE, Number.MAX_VALUE);
    chartState.series.forEach(s => {
      (s.get('yAxis') as am5xy.ValueAxis<am5xy.AxisRendererY>).set('max', chartData.maxY); // chartData.maxY
      s.data.setAll(chartData.entries);
    });
    chartState.legend.data.setAll(chartState.series);
    chartState.chart?.show();

  };

  const updateFold = (chartState: IChartState) => {

    chartState.xAxisLabel?.set('visible', fold === 'open-vertical' || doExport);
    chartState.yAxisLabel?.set('visible', fold === 'open-vertical' || doExport);
    chartState.yAxisVal?.set('visible', fold === 'open-vertical' || doExport);

  };

  const updateInstants = (chartState: IChartState) => {

    let positionMin = 0;
    let positionMax = 1;

    if (instantMin > 0 && instantMax > 0) {

      positionMin = chartState.xAxisVal.valueToPosition(instantMin);
      positionMax = chartState.xAxisVal.valueToPosition(instantMax);

    }

    let positionDst = (chartState.xAxisVal.valueToPosition(instant) - positionMin) / (positionMax - positionMin);
    if (positionDst < 0 || positionDst > 1) {
      chartState.cursor.hide();
    } else {
      chartState.cursor.show();
    }

    if (!Number.isNaN(positionDst)) {
      chartState.cursor.set('positionX', positionDst);
    }

  }

  const updateCallbacks = () => {

    handleInstantRangeChange.current = (instantMin1: number, instantMax1: number) => {
      if (openHorizontal && (instantMin1 > 0 && instantMin1 !== instantMin) || (instantMax1 > 0 && instantMax1 !== instantMax)) {
        if (!doExport) {
          onInstantRangeChange(instantMin1, instantMax1);
        }
        instantMin = instantMin1;
        instantMax = instantMax1;
      }
    };

    handleSeriesVisibilityChange.current = (name: string, visibility: boolean) => {
      onSeriesVisibilityChange(name, visibility);
    }

  }

  useEffect(() => {

    console.debug('🔧 updating chart component (path)', props);

    if (chartState) {
      updatePath(chartState);
      updateCallbacks();
    }

  }, [path]);

  useEffect(() => {

    console.debug('🔧 updating chart component (fold)', props);

    if (chartState) {
      updateFold(chartState);
      updateCallbacks();
    }

  }, [fold]);

  useEffect(() => {

    console.debug('🔧 updating chart component (instant)', props);
    if (chartState) {
      updateInstants(chartState);
      updateCallbacks();
    }

  }, [instant, instantMin, instantMax]);

  useEffect(() => {

    console.debug('🔧 updating chart component (chartState)', props);
    if (chartState) {
      updatePath(chartState);
      updateFold(chartState);
      updateCallbacks();
    }

  }, [chartState]);

  return (
    <div id={`chartdiv_${id}`} style={props.style} />
  )

}
