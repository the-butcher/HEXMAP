import { createTheme, Paper, ThemeProvider } from "@mui/material";
import "./../styles.css";
import DatePickerComponent from "./DatePickerComponent";
import DateSliderComponent from "./DateSliderComponent";
import IndicatorComponent from "./IndicatorComponent";
import { IUserInterfaceProps } from "./IUserInterfaceProps";

export default (props: IUserInterfaceProps) => {

  const { indicatorProps, navigationBotProps } = props;

  const backgroundColor = 'rgba(77, 77, 68, 0.85)';
  const fontFamily = '"Courier Prime Sans", Consolas, Courier-New, monospace';
  const theme = createTheme({
    components: {
      // Name of the component
      MuiButtonBase: {
        styleOverrides: {
          root: {
            backgroundColor: 'red'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          // Name of the slot
          root: {
            // fontSize: '12px',
            backgroundColor,
            fontFamily,
            color: 'var(--color-text)',
            fontSize: '0.95em',
            overflow: 'auto',
            minWidth: '200px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor,
            fontFamily,
            color: 'var(--color-text)',
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
            fontFamily,
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
            fontFamily,
            fontSize: '1.0em',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            fontFamily,
            width: 'unset',
            backgroundColor,
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
            fontFamily,
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
            fontFamily,
            fontSize: '0.95em',
            color: 'var(--color-text)',
            '&:after': {
              borderBottom: '2px solid var(--color-text)'
            }
          },
          input: {
            padding: '0px'
          }
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily,
            fontSize: '0.95em',
            color: 'var(--color-text)',            
            backgroundColor,
            padding: '2px 6px 2px 6px'
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            fontFamily,
            fontSize: '0.95em',
            color: 'var(--color-text)',            
            height: '1px',
            padding: '10px 0px',
            marginRight: '12px'
          },
          markLabel: {
            fontFamily,
            fontSize: '0.75em',
            color: 'var(--color-text)',       
            top: '16px'
          }
        },
      }   
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: '100%', position: 'absolute', display: 'flex', flexDirection: 'column' }}>
        {/* <NavigationTopComponent {...navigationTopProps} /> */}
        <div style={{ width: 'calc(100%-24px)', zIndex: 100, display: 'flex', flexDirection: 'row', flex: 1, padding: '12px' }}>
          { indicatorProps.map(props => <IndicatorComponent key={ props.source } {...props} />) }
        </div>
       </div>
       <Paper elevation={4} style={{ overflow: 'unset', width: 'calc(100%-24px)', display: 'flex', flexDirection: 'row', position: 'absolute', top: 'auto', bottom: '12px', left: '12px', right: '12px', height: '40px', padding: '0px', margin: '0px' }} >
          <DateSliderComponent {...props.navigationBotProps.instantProps} />
          <DatePickerComponent {...props.navigationBotProps.instantProps} />
        </Paper>

       {/* <div style={{ width: 'calc(100%-24px)', zIndex: 100, display: 'flex', flexDirection: 'row', flex: 1, padding: '12px', position: 'absolute', top: 'auto', bottom: '0px', left: '0px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>

       </div> */}
       {/* <NavigationBotComponent {...navigationBotProps} /> */}
    </ThemeProvider>
  );

}

// , backgroundColor: 'rgba(255, 255, 255, 0.75)'