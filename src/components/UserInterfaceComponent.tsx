import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup, createTheme, Paper, ThemeProvider } from "@mui/material";
import "./../styles.css";
import DatePickerComponent from "./DatePickerComponent";
import DateSliderComponent from "./DateSliderComponent";
import ExportSceneComponent from "./ExportSceneComponent";
import IndicatorComponent from "./IndicatorComponent";
import { IUserInterfaceProps } from "./IUserInterfaceProps";


export default (props: IUserInterfaceProps) => {

  const { indicatorProps, navigationBotProps, exportSceneProps, onThemaChange: onThematicChange } = props;

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
          ol: {
            flexWrap: 'nowrap'
          }
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
            fontSize: '14px',
            color: 'var(--color-text)',
            backgroundColor: '#42423a',
            boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)'
          }
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 'unset',
            padding: '12px 14px 10px 3px'
          },
          thumb: {
            marginTop: '4px',
            marginLeft: '0px',
            height: '10px',
            width: '10px',
            borderRadius: '2px',
          },
          track: {
            height: '12px',
            borderRadius: '3px',
            width: '18px',
            backgroundColor: '#36362f',
          },
          switchBase: {
            padding: '9px 4px',
            color: '#616155',
            '&.Mui-checked': {
              color: '#c1c1aa',
              transform: 'translateX(6px)',
              '&+.MuiSwitch-track': {
                backgroundColor: '#36362f',
              }
            }
          }
        }
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            // width: '100%'
          }
        }
      },
      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            fontFamily,
            fontSize: '10px',
            color: 'var(--color-text)'
          }
        }
      }
    },
  });

  const mobileView = window.innerWidth <= 900;
  const handleExpand = (index: number) => {
    indicatorProps[index].onExpand(indicatorProps[index].id);
  }

  const handleThematicChange = (thema: string) => {
    onThematicChange(thema);
  }

  const buttons: JSX.Element[] = [];
  let activeIndicatorSource: string;
  for (let i = 0; i < indicatorProps.length; i++) {
    const marginL = i === 0 ? '12px' : '0px';
    const marginR = i === indicatorProps.length - 1 ? '12px' : '0px';
    if (indicatorProps[i].fold !== 'closed') {
      activeIndicatorSource = indicatorProps[i].source;
    }
    buttons.push(<Button key={`expandmobile_${indicatorProps[i].id}`} style={{ flexGrow: '1', marginLeft: marginL, marginRight: marginR }} onClick={() => handleExpand(i)}>{indicatorProps[i].desc}</Button>);
  }

  const availableIndicatorWidth = window.innerWidth - 60;
  const closedWidth = mobileView ? 0 : 190;
  const openedWidth = availableIndicatorWidth - (indicatorProps.length - 1) * closedWidth;

  // console.log(availableIndicatorWidth, indicatorProps.length, (indicatorProps.length - 1) * closedWidth, closedWidth, openedWidth);

  return (
    <ThemeProvider theme={theme}>
      {mobileView ?
        <ButtonGroup size="small" variant="outlined" style={{ paddingTop: '6px', width: '100%', display: 'flex' }}>
          {buttons}
        </ButtonGroup> : <div style={{ paddingBottom: '7px' }}></div>}
      <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        <div style={{ width: 'calc(100%-18px)', zIndex: 100, display: 'flex', flexDirection: 'row', flex: 1, padding: '2px 9px 9px 9px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', pointerEvents: 'visible' }}>
            <FontAwesomeIcon icon="chart-line" className="contextIcon" onClick={e => handleThematicChange('INCIDENCE')} />
            <FontAwesomeIcon icon="syringe" className='contextIcon' onClick={e => handleThematicChange('VACCINATION')} />
            <FontAwesomeIcon icon="bed-pulse" className='contextIcon' onClick={e => handleThematicChange('HOSPITALIZATION')} />
          </div>
          {indicatorProps.map(props => <IndicatorComponent key={`indicator_${props.id}`} {...props} style={{ minWidth: `${props.fold === 'open-horizontal' || props.fold === 'open-vertical' ? openedWidth : closedWidth}px`, display: (activeIndicatorSource === props.source || !mobileView) ? 'block' : 'none' }} />)}
        </div>
      </div>
      <div style={{ width: 'calc(100%-24px)', display: 'flex', pointerEvents: 'none', flexDirection: 'row', position: 'absolute', top: 'auto', bottom: '12px', left: '12px', right: '12px', height: '120px', padding: '0px', margin: '0px' }}>

        <ExportSceneComponent {...exportSceneProps} />
        <div style={{ minWidth: '6px ' }}></div>
        <Paper elevation={4} style={{ overflow: 'unset', pointerEvents: 'visible', flexGrow: 100, display: 'flex', flexDirection: 'row', position: 'relative', height: '40px', top: '80px' }} >
          <DateSliderComponent {...navigationBotProps.instantProps} />
          <DatePickerComponent {...navigationBotProps.instantProps} />
        </Paper>
      </div>
    </ThemeProvider>
  );

}
