import React from 'react';
import AppointmentBooked from './components/AppointmentBooked';
import AppointmentBooking from './components/AppointmentBooking';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AppointmentBooking}/>
        <Route path="/barberbooked" component={AppointmentBooked}/>
      </Switch>
    </Router>
  );
}

export default App;
