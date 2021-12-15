import { DatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterDateFns';
import { TextField } from "@mui/material";
import { IInstantProps } from "./IInstantProps";

export default (props: IInstantProps) => {

    const { onInstantChange } = props;

    const handleInstantChange = (date: Date | null) => {
        onInstantChange(date!.getTime());
    }

    return (
        <LocalizationProvider dateAdapter={ DateAdapter }>
        <DatePicker 
          value={ new Date(props.instantCur) }
          minDate={ new Date(props.instantMin) }
          maxDate={ new Date(props.instantMax) }
          onChange={ handleInstantChange }
          inputFormat={ 'dd.MM.yyyy' }
          mask={ '__.__.____' }
          renderInput={(params) => <TextField style={{ margin: '10px', marginRight: '24px' }} size="small" {...params} variant="standard" />}
        />
      </LocalizationProvider>
    );

}