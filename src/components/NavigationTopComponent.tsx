import { SearchRounded } from '@mui/icons-material';
import { AppBar, Breadcrumbs, FormControl, Input, InputAdornment, MenuItem, Select, Toolbar } from "@mui/material";
import { useTheme } from '@mui/system';
import { INavigationTopProps } from './INavigationTopProps';
import BreadcrumbComponent from './BreadcrumbComponent';


export default (props: INavigationTopProps) => {

  const theme = useTheme();

  return(
    <div style={{ width: 'inherit'}}>
      <AppBar elevation={ 4 } position="static">
        <Toolbar>
          <Breadcrumbs aria-label="breadcrumb" style={{ width: '100%' }}>
            { props.breadcrumbProps.map(props => <BreadcrumbComponent {...props} />) }
          </Breadcrumbs>            
          <FormControl variant="standard">
            <Input id="input-with-icon-adornment" endAdornment={
              <InputAdornment position="end">
                <SearchRounded />
              </InputAdornment>
            }/>
          </FormControl>
        </Toolbar>
      </AppBar>
    </div>
 );


}