import { DatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterDateFns';
import { TextField } from "@mui/material";
import { useState } from "react";
import { IInstantProps } from "./IInstantProps";

export default (props: IInstantProps) => {

  const { onInstantChange } = props;
  const [callbackTimeout, setCallbackTimeout] = useState<number>(-1);

  /**
   * fires twice upon change for unknown reasons
   * there timeout implemented to catch first call and fire upon second
   * @param date 
   */
  const handleInstantChange = (date: Date | null) => {
    window.clearTimeout(callbackTimeout);
    const _callbackTimeout = window.setTimeout(() => {
      onInstantChange(date!.getTime());
    }, 10);
    setCallbackTimeout(_callbackTimeout);
  }

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DatePicker

        value={new Date(props.instantCur)}
        minDate={new Date(props.instantMin)}
        maxDate={new Date(props.instantMax)}
        onChange={handleInstantChange}
        inputFormat={'dd.MM.yyyy'}
        mask={'__.__.____'}
        renderInput={(params) => <TextField style={{ margin: '10px', marginRight: '24px' }} size="small" {...params} variant="standard" />}
      />
    </LocalizationProvider>
  );

}