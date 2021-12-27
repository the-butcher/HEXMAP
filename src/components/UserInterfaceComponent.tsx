import { Button, ButtonGroup, createTheme, Paper, ThemeProvider } from "@mui/material";
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
            // backgroundColor: 'red'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor,
            color: 'var(--color-text)',      
            fontSize: '10px',
            '&:hover': {
              border: '1px solid #2b2b27',
              backgroundColor: 'rgba(77, 77, 68, 1)'
            }
          }
        }
      },
      MuiButtonGroup: {
        styleOverrides: {
          grouped: {
            minWidth: 'unset',
            boxShadow: 'inherit',
            border: '1px solid #2b2b27',
            '&:not(:last-of-type):hover': {
              borderRightColor: 'transparent'
            }
          }
        }
      },
      // @ts-ignore
      MuiPickersDay: {
        styleOverrides: {
          root: {
            backgroundColor: '#44443c',
            fontFamily,
            color: 'var(--color-text)',            
            paddingTop: '3px',
            '&.Mui-selected': {
              backgroundColor: 'var(--color-text)',
              color: '#44443c',                 
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'var(--color-text)',
              color: '#44443c',                 
            },         
            '&:focus.Mui-selected': {
              backgroundColor: 'var(--color-text)',
              color: '#44443c',                 
            }              
          },
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          // @ts-ignore
          fontSizeMedium: {
            width: '20px',
            height: '20px'
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
            fontSize: '14px',
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
            fontSize: '14px',
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
            fontSize: '14px',
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
            fontSize: '10px',
            color: 'var(--color-text)',            
            height: '1px',
            padding: '10px 0px',
            marginRight: '12px',
            '@media (pointer: coarse)': {
              padding: '10px 0px'
            }
          },
          markLabel: {
            fontFamily,
            fontSize: '10px',
            color: 'var(--color-text)',       
            top: '16px'
          },
          valueLabel: {
            fontFamily,
            fontSize: '12px',
            color: 'var(--color-text)',            
          }
        },
      }   
    },
  });

  const mobileView = window.innerWidth <= 900;
  const handleExpand = (index: number) => {
    indicatorProps[index].onExpand(indicatorProps[index].source);
  }  

  const buttons: JSX.Element[] = [];
  let activeIndicatorSource: string;
  for (let i = 0; i < indicatorProps.length; i++) {
    const marginL = i === 0 ? '12px' : '0px';
    const marginR = i === indicatorProps.length - 1 ? '12px' : '0px';
    if (indicatorProps[i].fold !== 'closed') {
      activeIndicatorSource = indicatorProps[i].source;
    }
    buttons.push(<Button key={ indicatorProps[i].source } style={{ flexGrow: '1', marginLeft: marginL, marginRight: marginR }} onClick={ () => handleExpand(i) }>{ indicatorProps[i].desc }</Button>);
  }

  // console.log('active source', indicatorProps[activeIndicatorIndex]);


  return (
    <ThemeProvider theme={ theme }>
      { mobileView ?
      <ButtonGroup size="small" variant="outlined" style={{ paddingTop: '6px', width: '100%', display: 'flex'}}>
        { buttons }
      </ButtonGroup> : <div style={{ paddingBottom: '7px' }}></div> }
      <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 'calc(100%-18px)', zIndex: 100, display: 'flex', flexDirection: 'row', flex: 1, padding: '2px 9px 9px 9px' }}>
          { indicatorProps.map(props => <IndicatorComponent key={ props.source } {...props} style={{ display: (activeIndicatorSource === props.source || !mobileView) ? 'block' : 'none' }} />) }
        </div>
      </div>
      <Paper elevation={4} style={{ overflow: 'unset', width: 'calc(100%-24px)', display: 'flex', flexDirection: 'row', position: 'absolute', top: 'auto', bottom: '12px', left: '12px', right: '12px', height: '40px', padding: '0px', margin: '0px' }} >
        <DateSliderComponent {...props.navigationBotProps.instantProps} />
        <DatePickerComponent {...props.navigationBotProps.instantProps} />
      </Paper>
    </ThemeProvider>
  );

}

// 