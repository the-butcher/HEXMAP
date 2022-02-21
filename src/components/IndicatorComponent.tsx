import { Download, DownloadForOffline, DownloadForOfflineOutlined, ExpandMore } from '@mui/icons-material';
import { Breadcrumbs, Card, CardActions, CardContent, IconButton, useTheme, FormLabel, FormControl, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { calcPosFromAngles } from '@react-three/drei';
import { invalidate } from '@react-three/fiber';
import { useRef } from 'react';
import { ObjectUtil } from '../util/ObjectUtil';
import { TimeUtil } from '../util/TimeUtil';
import BreadcrumbComponent from './BreadcrumbComponent';
import ChartComponent from './ChartComponent';
import { IIndicatorProps } from './IIndicatorProps';

export default (props: IIndicatorProps & React.CSSProperties) => {

  const theme = useTheme();

  const { id, loaded, logarithmic, onExpand, onExport, onLogarithmicChange, breadcrumbProps } = props;

  const openHorizontal = props.fold === 'open-horizontal' || props.fold === 'open-vertical';
  const openVertical = props.fold === 'open-vertical';
  let expandTransform = 'rotate(-90deg)'
  if (openHorizontal) {
    expandTransform = openVertical ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  const handleExpand = () => {
    onExpand(id);
  }

  const handleExport = () => {
    onExport(id);
  }

  const handleLogarithmicChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onLogarithmicChange(checked);
  }

  const chartBounds = document.getElementById(`chartdiv_${id}`)?.getBoundingClientRect();
  const indicatorMinHeight = '90px';
  const verticalHeight = openVertical ? `${Math.min(window.innerHeight - chartBounds.top - 62, 500)}px` : indicatorMinHeight

  return (
    <div style={{ ...props.style, transition: 'all 500ms ease-in-out', userSelect: 'none' }}>
      <Card elevation={4}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 500ms ease-in-out', pointerEvents: 'visible' }} >
          <div style={{ display: 'flex', justifyContent: 'right', flexDirection: 'row', minHeight: '21px' }}>
            <div style={{ fontSize: '14px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingTop: '1px', paddingRight: '12px' }}>{ObjectUtil.buildIndicatorTitle(props)}</div>
            <div style={{ flexGrow: '1' }}></div>
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              {
                loaded ? <Breadcrumbs aria-label="breadcrumb" style={{ position: 'relative', display: openHorizontal ? 'block' : 'none', paddingRight: '12px', transition: 'all 500ms ease-in-out' }}>
                  {breadcrumbProps.map(props => <BreadcrumbComponent key={props.name} {...props} />)}
                </Breadcrumbs> : null
              }
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', minHeight: indicatorMinHeight }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '140px', flexGrow: '1' }}>
              <div style={{ fontSize: '36px', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '50%', paddingTop: '20px' }}>{props.label00}</div>
              <div style={{ fontSize: '10px', textAlign: 'right' }}>{props.instant ? TimeUtil.formatCategoryDateFull(props.instant) : '##.##.####'}</div>
              <div style={{ fontSize: '18px', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '50%', paddingTop: '12px' }}>{props.label07}</div>
              <div style={{ fontSize: '10px', textAlign: 'right', whiteSpace: 'nowrap' }}>gegenüber Vorwoche</div>
              <div style={{ minHeight: '3px', flexGrow: '100' }} />

              <div style={{ display: 'flex', flexDirection: 'column', height: openVertical ? '260px' : '0px', transition: 'all 500ms ease-in-out' }}>
                <div style={{ flexGrow: '10' }} />
                <FormControl variant="standard" size="small" style={{ left: 'auto', right: '0px', width: '100%' }}>
                  <FormControlLabel label="logarithmic" labelPlacement="start" control={
                    <Switch checked={logarithmic} onChange={handleLogarithmicChange} name="logarithmic" />
                  } />
                </FormControl>
                <div id={`legenddiv_${id}`} style={{ height: '100px' }} />
                <div style={{ minHeight: '30px' }} />
              </div>

            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px', minWidth: '40px', width: '40px' }}>
              <IconButton key={`expand_${props.id}`} aria-label='share' onPointerUp={handleExpand} style={{ transform: expandTransform }}>
                <ExpandMore style={{ width: '24px', height: '24px', color: 'var(--color-text)' }} />
              </IconButton>
              <div style={{ flexGrow: '1' }}></div>
              {
                openHorizontal ? <IconButton key={`export_${props.id}`} aria-label='share' onPointerUp={handleExport}>
                  <Download style={{ width: '24px', height: '24px', color: 'var(--color-text)' }} />
                </IconButton> : null
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '999' }}>
              {
                loaded ? <div style={{ overflow: 'hidden', height: openVertical ? verticalHeight : indicatorMinHeight, transition: 'all 500ms ease-in-out', minWidth: '0px', flexGrow: '99' }}>
                  <ChartComponent {...props} style={{ width: 'inherit', height: 'inherit', overflow: 'hidden', display: openHorizontal ? 'block' : 'block' }} />
                </div> : null
              }
            </div>

          </div>
        </CardContent>
      </Card>
    </div>

  )

}
