import { createTheme, ThemeProvider } from "@mui/material";



function UserInterfaceComponent() { // props: IUserInterfaceProps

  // const { indicatorProps } = props;

  const backgroundColor = 'rgba(77, 77, 68, 0.85)';
  const fontFamily = '"Courier Prime Sans", Consolas, Courier-New, monospace';
  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(70, 70, 62, 0.85)',
            color: 'var(--color-text)',
            fontFamily,
            fontSize: '1.2em',
            // textTransform: 'unset'
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
      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            fontFamily,
            '&.Mui-disabled': {
              color: 'unset'
            },
            fontSize: '1.2em',
            paddingTop: '3px'
          }
        }
      },
      MuiSwitch: {
        styleOverrides: {
          root: {

          },
          thumb: {

          },
          track: {
            backgroundColor: '#151515',
          },
          switchBase: { //MuiButtonBase-root-MuiSwitch-switchBase
            '&.Mui-disabled+.MuiSwitch-track': {
              opacity: '1'
            },
          }
        }
      }
    }
  });


  return (
    <ThemeProvider theme={theme}>
      {/* <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        <div style={{ width: 'calc(100%-18px)', zIndex: 100, display: 'flex', flexDirection: 'row', flex: 1, padding: '2px 9px 9px 13px' }}>
          <IndicatorComponent key={`indicator_${indicatorProps.id}`} {...indicatorProps} style={{ display: 'block' }} />
        </div>
      </div> */}
    </ThemeProvider>
  );

}

export default UserInterfaceComponent;
