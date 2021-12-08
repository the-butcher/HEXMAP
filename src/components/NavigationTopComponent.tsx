import { AccountCircle, InputRounded, SearchRounded } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

import { AppBar, Breadcrumbs, IconButton, Link, Toolbar, Typography, Input, FormControl, InputLabel, InputAdornment } from "@mui/material";
import Box from '@mui/material/Box';
import { useTheme } from '@mui/system';

export default () => {

  const theme = useTheme();

  return(
    <div style={{ width: 'inherit'}}>

        <AppBar elevation={ 4 } position="static">
          <Toolbar>
            <Breadcrumbs aria-label="breadcrumb" style={{ width: '100%' }}>
              <Link underline="hover" color="inherit" href="/">
                Österreich
              </Link>
              <Link
                underline="hover"
                color="inherit"
                href="/getting-started/installation/"
              >
                Bundesland
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                href="/components/breadcrumbs/" 
                aria-current="page"
              >
                Bezirk
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                href="/components/breadcrumbs/" 
                aria-current="page"
              >
                Gemeinde
              </Link>              
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