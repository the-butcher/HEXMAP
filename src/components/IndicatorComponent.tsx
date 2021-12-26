import { ExpandMore } from '@mui/icons-material';
import { Breadcrumbs, Card, CardActions, CardContent, IconButton, useTheme } from '@mui/material';
import BreadcrumbComponent from './BreadcrumbComponent';
import ChartComponent from './ChartComponent';
import { IIndicatorProps } from './IIndicatorProps';


export default (props: IIndicatorProps) => {

    const theme = useTheme();

    const { source, onExpand, breadcrumbProps } = props;

    const openHorizontal = props.fold === 'open-horizontal' || props.fold === 'open-vertical';
    const openVertical = props.fold === 'open-vertical';
    let expandTransform = 'rotate(-90deg)'
    if (openHorizontal) {
        expandTransform = openVertical ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    const handleExpand = () => {
      onExpand(source);
    }
  
    return (
      <div style={{ flexGrow: openHorizontal ? '2' : '0', transition: 'all 250ms ease-in-out', userSelect: 'none' }}>
        <Card elevation={4}>
          <CardContent style={{ display: 'flex', flexDirection: 'column', width: openHorizontal ? 'inherit' : '180px', overflow: 'hidden', transition: 'all 250ms ease-in-out' }} >
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: 'inherit', minHeight: '21px'}}>
              <div style={{ fontSize: '14px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingTop: '1px', paddingRight: '12px' }}>{ props.name } nach { props.desc }</div>
              <Breadcrumbs aria-label="breadcrumb" style={{ display: openHorizontal ? 'block' : 'none' }}>
              { breadcrumbProps.map(props => <BreadcrumbComponent key={ props.name } {...props} />) }
              </Breadcrumbs>              
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: '140px', flexGrow: '1'}}>
                <div style={{ fontSize: '36px', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '50%', paddingTop: '20px' }}>{ props.value00 }</div>
                <div style={{ fontSize: '10px', textAlign: 'right' }}>{ props.date }</div>
                <div style={{ fontSize: '18px', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '50%', paddingTop: '12px' }}>{ props.value07 }</div>
                <div style={{ fontSize: '10px', textAlign: 'right', whiteSpace: 'nowrap' }}>gegenüber Vorwoche</div>
              </div>
              <CardActions disableSpacing style={{ padding: '0px', transform: expandTransform, minWidth: '40px', width: '40px', height: '40px' }}>
                  <IconButton key={ props.source } aria-label='share' onPointerUp={ handleExpand }>
                    <ExpandMore style={{ width: '24px', height: '24px', color: 'var(--color-text)' }} />
                  </IconButton>                  
              </CardActions>                 
              <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '999' }}>
                <div style={{ overflow: 'hidden', height: openVertical ? '500px' : '90px', transition: 'all 250ms ease-in-out', minWidth: '180px', flexGrow: '99' }}>
                  <ChartComponent { ...props.chartProps } style={{ width: 'inherit', height: 'inherit', overflow: 'hidden', display: openHorizontal ? 'block' : 'none' }} />
                </div>                  
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    
    )

}
