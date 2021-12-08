import MapComponent from './components/MapComponent';
import UserInterfaceComponent from './components/UserInterfaceComponent';

export default () => {

  // TODO find out if this compoment can be the data-hub of the application, otherwise it may make sense to deprecate this component

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent />
      <UserInterfaceComponent />
    </div>
  );
  
};

