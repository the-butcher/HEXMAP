import { useTheme } from '@mui/system';
import DatePickerComponent from "./DatePickerComponent";
import DateSliderComponent from "./DateSliderComponent";
import { INavigationBotProps } from './INavigationBotProps';

/**
 * functional react component holding a date-slider and date-picker
 * TODO cleanup css
 * 
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: INavigationBotProps) => {

  const { instantProps } = props;
  const theme = useTheme();

  return(
    <div style={{ display: 'flex', flexDirection: 'row', boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', position: 'absolute', top: 'auto', bottom: '0px', left: '0px', height: '48px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
      <DateSliderComponent {...instantProps} />
      <DatePickerComponent {...instantProps} />
    </div>
 );


}