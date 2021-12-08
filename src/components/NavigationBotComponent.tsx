import { AppBar, Slider, TextField, Toolbar } from "@mui/material";
import { useTheme } from '@mui/system';
import { LegacyRef, useState } from "react";
import DatePicker from '@mui/lab/DatePicker';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from "@mui/lab";
import DateSliderComponent from "./DateSliderComponent";
import { TimeUtil } from "../util/TimeUtil";

export default () => {

  /**
   * TODO set instantMin and instantMax as of data
   */

  const theme = useTheme();

  const [value, setValue] = useState<Date | null>(null);

  const dateMin = new Date('2020-03-01');
  const dateMax = new Date(TimeUtil.formatCategoryDateFull(Date.now())); // truncate time
  const dateCur = dateMax;

  const handleSliderValueChange = (instant: number) => {
    console.log('slider value changed', TimeUtil.formatCategoryDateFull(instant));
  }

  const handlePickerValueChange = (date: Date | null) => {
    console.log('picker value changed', TimeUtil.formatCategoryDateFull(date!.getTime()));
  }

  return(
    <div style={{ display: 'flex', flexDirection: 'row', boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', position: 'absolute', top: 'auto', bottom: '0px', left: '0px', height: '48px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
      <DateSliderComponent instantMin={ dateMin.getTime() } instantMax={ dateMax.getTime() } instantCur={ dateCur.getTime() } onValueChange={ handleSliderValueChange } />
      <LocalizationProvider dateAdapter={ DateAdapter }>
        <DatePicker
          onAccept={ handlePickerValueChange }
          value={ value }
          onChange={ (newValue) => {
            setValue(newValue);
          }}
          inputFormat={ 'dd.MM.yyyy' }
          mask={ '__.__.____' }
          renderInput={(params) => <TextField style={{ margin: '10px', marginRight: '24px' }} size="small" {...params} variant="standard" />}
        />
      </LocalizationProvider>
    </div>
 );


}