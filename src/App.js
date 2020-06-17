import React from 'react';
import AppointmentBooked from './components/AppointmentBooked';
import AppointmentBooking from './components/AppointmentBooking';
import { BrowserRouter as Router, Switch, Route, HashRouter} from 'react-router-dom'

function App() {
  return (
    <HashRouter basename="/">
      <Switch>
        <Route path="/" exact component={AppointmentBooking}/>
        <Route path="/barberbooked" component={AppointmentBooked}/>
      </Switch>
    </HashRouter>
  );
}

export default App;
