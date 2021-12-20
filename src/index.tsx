import { render } from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root");
render(<App />, rootElement);



/**
 * 4) ensure that the selected area can be recognized in the map
 * 5) offer some tabular view so the shown area has context numerically
 *    -- decide if tabular replaces map
 * 
 * data could define indicators (maybe one file per indicator)
 * 
 * {
 *   "name": "Inzidenz nach Bezirk", 
 *   "vals": ["Inzidenz"],
 *   "keys": [
 *     {
 *       "20815": "Sittersdorf"
 *     }
 *   ],
 *   "data": { 
 *     "06.12.2021": {
 *       "20815": [300],
 *       "34567": [280],
 *       ...
 *     },
 *     "07.12.2021": {
 *       ...
 *     }
 *   }
 * }
 * 
 * {
 *   "name": "Impfung nach Gemeinde", 
 *   "vals": ["Teilimmunisiert", "Vollimmunisiert"],
 *   "keys": [
 *     {
 *       "20815": "Sittersdorf"
 *     }
 *   ],
 *   "data": { 
 *     "06.12.2021": {
 *       "20815": [20.1, 30.4],
 *       "34567": [20.1, 30.4],
 *       ...
 *     },
 *     "07.12.2021": {
 * 
 *     }
 *   }
 * }
 * 
 * {
 *   "name": "Impfung nach Bundesland und Alter", 
 *   "keys": [
 *      {
 *        "1": "Burgenland",
 *        "2": "Kärnten",
 *        "3": "Niederösterreich",
 *        "4": "Oberösterreich",
 *        "5": "Salzburg",
 *        "6": "Steiermark",
 *        "7": "Tirol",
 *        "8": "Vorarlberg",
 *        "9": "Wien",
 *      },
 *      {
 *        "0": "<= 05",
 *        "1": "05-14",
 *        "2": "15-24",
 *        "3": "25-34",
 *        "4": "35-44",
 *        "5": "45-54",
 *        "6": "55-64",
 *        "7": "65-74",
 *        "8": "75-84",
 *        "9": ">= 84"
 *      }
 *   ],
 *   "vals": ["1st", "2nd", "3rd"],
 *   "data": { 
 *     "06.12.2021": {
 *       "54": [70.1, 60.4, 10.3], <-- salzburg, 35-44
 *       "55": [70.1, 60.4, 10.3], <-- salzburg, 35-44
 *       ...
 *     },
 *     "07.12.2021": {
 * 
 *     }
 *   }
 * }
 * 
 */