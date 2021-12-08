import { render } from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
render(<App />, rootElement);



/**
 * rough draft
 * 1) breadcrumbs -> which level is showing
 *    -- at, bundesland, bezirk, gemeinde
 *    -- through breadcrumbs allow granularity to be picked (but make clear when a specific granularity is not available)
 * 
 * 2) what is showing (dropdown?)
 *    -- incidence
 *    -- vaccinations
 *    -- icu (what parameters are relavant?)
 *    -- deaths / 100.000
 *    -- 
 * 
 * 3) in prominent location show the value that is selected through the map and the respective area (may be ok through breadcrumbs, find out whats good)
 * 4) ensure that the selected area can be recognized in the map
 * 5) offer some tabular view so the shown area has context numerically
 * 
 * 6) slider / date picker, so historic states can be shown as desired
 * 
 * 
 * 
 * 
 */