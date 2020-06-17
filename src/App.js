import React from 'react';
import AppointmentBooked from './components/AppointmentBooked';
import AppointmentBooking from './components/AppointmentBooking';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route basename="/barber-booking" path={process.env.PUBLIC_URL} exact component={AppointmentBooking}/>
        <Route path={process.env.PUBLIC_URL + '#/barberbooked'} component={AppointmentBooked}/>
      </Switch>
    </Router>
  );
}

export default App;
