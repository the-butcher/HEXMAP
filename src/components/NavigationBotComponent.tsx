import { useTheme } from '@mui/system';
import DatePickerComponent from "./DatePickerComponent";
import DateSliderComponent from "./DateSliderComponent";
import { INavigationBotProps } from './INavigationBotProps';

export default (props: INavigationBotProps) => {

  const { instantProps } = props;
  /**
   * TODO set instantMin and instantMax as of data
   */

  const theme = useTheme();

  // const handleInstantChange = (instant: number) => {
  //   onValueChange(instant);
  //   // setDateProps({
  //   //   ...dateProps,
  //   //   instantCur: instant
  //   // });
  // }

  // const [dateProps, setDateProps ] = useState<IDateComponentProps>({
  //   instantCur: Date.now(),
  //   instantMin: new Date('2020-03-01').getTime(),
  //   instantMax: Date.now(),
  //   onValueChange: handleValueChange
  // });

  return(
    <div style={{ display: 'flex', flexDirection: 'row', boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', position: 'absolute', top: 'auto', bottom: '0px', left: '0px', height: '48px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
      <DateSliderComponent {...instantProps} />
      <DatePickerComponent {...instantProps} />
    </div>
 );


}