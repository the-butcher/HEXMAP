# Issues in Hexmap
- outline only show partially (maybe an issue connected to key sorting)
- click on undefined data causes error (salzburg only)
- move base config to file (maybe multiple files)

# later
- add median population as indicator
- add hospitalization as indicator
- add cumulative numbers for cases and deaths (?)
- tabular view
- export options for chart, map, data (csv export)

# solved
- ~~show a plus symbol on the percentage change~~
- ~~apply copyright as of indicator~~
- ~~selecting in the map resets fold of the chart~~
- ~~in municipality mode only municipalities of the respective province are outlined~~
- ~~proper zoom around mouse center~~
- ~~find a way to add mortality as datasource~~
- ~~logarithmic option in chart~~
- ~~restore map props rebuild so delayed map props build is possible again~~
- ~~first chart shows only after another path is chosen~~
- ~~adapt date slider tooltip to match chart tooltip~~
- ~~think about how a case-stepline could be implemented~~
- ~~boundaries have offsets in many places~~
- ~~add twitter card to index.html~~
- ~~add shape to scene that the current diagram can be textured on~~
  - ~~move the date-labels to chart 3d (NO)~~
  - ~~deprecate the chart 3D component and properties~~
- ~~add logic to adapt shadow texture size to device capabilities~~
- ~~add morning EMS as datasource~~
- ~~data credits~~
- ~~map is completely broken in mobile~~
  - ~~reason: size of the shadow map, works with 512, 2048~~
- ~~mobile layout~~
  - ~~in portrait the map is too small >> viewport copied from old map~~
  - ~~breadcrumb component should not fold internally (or only after it has wrapped away from the title separately)~~
  - ~~add functionality to button group~~
  - ~~unfolded chart height for mobile~~
  - ~~when switching between large and small indicators need to update all indicators to allow other to show~~
- ~~change date when clicking in arbitrary chart~~
- ~~unfolded chart height for different layouts~~
- ~~add a twitter button linked to @FleischerHannes~~
- ~~legend hexagons are off by a half hexwidth~~
- ~~sorting/grouping in path dropdown~~
- ~~y axis label is visible when collapsed but should not~~
- ~~date in chart x-axis should show year~~
- ~~move chart to specific chart component~~
- ~~Timing in initial rendering~~
  - ~~map shows only after a source or instant change~~
  - ~~the preview chart does not show and only scales to max after a path change~~
- ~~export option~~
  - ~~shadows appear to be clipped to a much smaller area than needed~~


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
