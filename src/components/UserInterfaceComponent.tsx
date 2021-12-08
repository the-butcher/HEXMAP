import { ExpandMore, LastPage } from "@mui/icons-material";
import { AppBar, Breadcrumbs, Card, CardActions, CardContent, Collapse, createTheme, IconButton, Link, Paper, ThemeProvider, Toolbar } from "@mui/material";
import "./../styles.css";
import NavigationTopComponent from "./NavigationTopComponent";
import NavigationBotComponent from "./NavigationBotComponent";
import IndicatorComponent from "./IndicatorComponent";
import { IIndicatorComponentProps } from "./IIndicatorComponentProps";
import { ObjectUtil } from "../util/ObjectUtil";
import { PointerEvent, useRef, useState } from "react";

export default () => {

  const theme = createTheme({
    components: {
      // Name of the component
      MuiPaper: {
        styleOverrides: {
          // Name of the slot
          root: {
            // fontSize: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            fontFamily: 'Consolas',
            fontSize: '0.95em',
            overflow: 'auto',
            minWidth: '200px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            fontFamily: 'Consolas',
            fontSize: '0.95em',
            overflow: 'auto',
            minWidth: '150px',
            margin: '3px',
            padding: '0px',
            paddingBottom: '0px'
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            backgroundColor: 'unset',
            fontFamily: 'Consolas',
            fontSize: '0.95em',
            overflow: 'auto',
            minWidth: '150px',
            margin: '3px',
            padding: '0px',
            paddingBottom: '0px',
            '&:last-child': {
              paddingBottom: '0px'
            }
          }
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            fontFamily: 'Consolas',
            fontSize: '1.1em',

          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            fontFamily: 'Consolas',
            width: 'unset',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            height: '50px',
            padding: '0px'
            // padding: '6px'
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          // Name of the slot
          root: {
            fontFamily: 'Consolas',
            height: '48px',
            minHeight: '48px',
            '@media (min-width: 600px)': {
              minHeight: "48px"
            }
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          // Name of the slot
          root: {
            fontFamily: 'Consolas'
          },
        },
      }
    },
  });

  const handleExpand = (id: string) => {

    indicatorComponentProps.forEach(indicatorComponentProp => {
      if (indicatorComponentProp.id === id) {
        indicatorComponentProp.state = indicatorComponentProp.state === 'open-horizontal' ? 'open-vertical' : 'open-horizontal';
      } else {
        indicatorComponentProp.state = 'closed';
      }
    });
    setIndicatorComponentProps([...indicatorComponentProps]);    

  }

  const [indicatorComponentProps, setIndicatorComponentProps] = useState<IIndicatorComponentProps[]>([
    {
      id: ObjectUtil.createId(),
      title: 'Inzidenz',
      value: '1.001',
      onExpand: handleExpand,
      state: 'open-horizontal'
    },
    {
      id: ObjectUtil.createId(),
      title: 'Impfquote',
      value: '64.10%',
      onExpand: handleExpand,
      state: 'closed'
    },
    {
      id: ObjectUtil.createId(),
      title: 'Tests/100.000',
      value: '80.000',
      onExpand: handleExpand,
      state: 'closed'
    },
    {
      id: ObjectUtil.createId(),
      title: 'Fälle/100.000',
      value: '80.000',
      onExpand: handleExpand,
      state: 'closed'
    },
    {
      id: ObjectUtil.createId(),
      title: 'Tote/100.000',
      value: '114.20',
      onExpand: handleExpand,
      state: 'closed'
    }
  ]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: '100%', position: 'absolute', display: 'flex', flexDirection: 'column' }}>
        <NavigationTopComponent />
        <div style={{ width: 'calc(100%-24px)', zIndex: 100, display: 'flex', flexDirection: 'row', flex: 1, padding: '12px' }}>
          { indicatorComponentProps.map(indicatorComponentProp => <IndicatorComponent key={ indicatorComponentProp.id } id={ indicatorComponentProp.id } state={ indicatorComponentProp.state } onExpand={ handleExpand } title={ indicatorComponentProp.title } value={ indicatorComponentProp.value }/>) }
        </div>
       </div>
       <NavigationBotComponent />
    </ThemeProvider>
  );

}