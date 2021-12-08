import { ExpandMore, KeyboardTab } from "@mui/icons-material"
import { Card, CardActions, CardContent, IconButton } from "@mui/material"
import { IIndicatorComponentProps } from "./IIndicatorComponentProps"
import { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from "@amcharts/amcharts5/xy";

export default (props: IIndicatorComponentProps) => {

    const { onExpand } = props;

    const openHorizontal = props.state === 'open-horizontal' || props.state === 'open-vertical';
    const openVertical = props.state === 'open-vertical';
    let expandTransform = 'rotate(-90deg)'
    if (openHorizontal) {
        expandTransform = openVertical ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    console.log(props.title, props.state);

    const handleExpand = () => {
      onExpand(props.id);
    }

    useEffect(() => {

      console.log('effect');

      const root = am5.Root.new('chartdiv_' + props.id);
      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {})
      );     
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          categoryField: "category"
        })
      );
      xAxis.data.setAll([
        {
          category: "Research"
        }, {
          category: "Marketing"
        }, {
          category: "Sales"
        }]);            

    }, []);    

    useEffect(() => {

      console.log('props.state has changed', props);

    }, [props.state]);  

    return (
      <div style={{ flexGrow: openHorizontal ? '2' : '0', transition: 'all 250ms ease-in-out' }}>
        <Card elevation={4}>
          <CardContent style={{ display: 'flex', flexDirection: 'row', width: 'inherit' }} >
            <div style={{ display: 'flex', flexDirection: 'column', width: '150px', overflow: 'hidden' }}>
              <div>{ props.title }</div>
              <div style={{ display: 'flex', flexDirection: 'row', height: '40px' }}>
                <div style={{ fontSize: openHorizontal ? '2em' : '1.5em', position: 'relative', top: '7px', height: '33px', transition: 'font-size 250ms ease-in-out' }}>{ props.value }</div>
                <CardActions disableSpacing style={{ padding: '0px', margin: 'auto', marginRight: '0px', transform: expandTransform, transition: 'transform 250ms ease-in-out' }}>
                  <IconButton key={props.id} aria-label="share" onPointerUp={ handleExpand }>
                    <ExpandMore />
                  </IconButton>                  
                </CardActions>       
              </div>
              <div style={{ overflow: 'hidden', height: openVertical ? '300px' : '0px', transition: 'all 250ms ease-in-out' }}/>
            </div>
            <div id={ 'chartdiv_' + props.id } style={{ width: '100%', overflow: 'hidden', display: openHorizontal ? 'block' : 'none' }} />
          </CardContent>
        </Card>
      </div>
    
    )

}