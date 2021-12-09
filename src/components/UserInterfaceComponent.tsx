import { createTheme, ThemeProvider } from "@mui/material";
import { ObjectUtil } from "../util/ObjectUtil";
import "./../styles.css";
import IndicatorComponent from "./IndicatorComponent";
import { IUserInterfaceProps } from "./IUserInterfaceProps";
import NavigationBotComponent from "./NavigationBotComponent";
import NavigationTopComponent from "./NavigationTopComponent";

export default (props: IUserInterfaceProps) => {

  const { indicatorProps, navigationTopProps, navigationBotProps } = props;

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

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: '100%', position: 'absolute', display: 'flex', flexDirection: 'column' }}>
        <NavigationTopComponent {...navigationTopProps} />
        <div style={{ width: 'calc(100%-24px)', zIndex: 100, display: 'flex', flexDirection: 'row', flex: 1, padding: '12px' }}>
          { indicatorProps.map(props => <IndicatorComponent key={ props.id } {...props} />) }
        </div>
       </div>
       <NavigationBotComponent {...navigationBotProps} />
    </ThemeProvider>
  );

}