import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { setMinutes, setHours, addMonths } from 'date-fns';
import moment from 'moment'
import { baseUrl } from './BookAppointment';
import '../sass/bookappointment.scss';


export class TimePicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      startDate: null,
      startHour: null,
      endHour: null,
      timeDisabled: this.props.timeDisabled,
      time: null,
      appointments: null,
      excludedTimes: [],
    }
  }

  handleChange = (val, e) => {
    this.setState({
      startDate: val,
      timeDisabled: false,
      time: null,
      excludedTimes: [],
    });

    const getDay = val.getDay();

    if (getDay === 1) {
      this.setState({
        startHour: this.props.getWorkingHours.map(day => day[0].startHour),
        endHour: this.props.getWorkingHours.map(day => day[0].endHour)
      });
    } else if (getDay === 2) {
      this.setState({
        startHour: this.props.getWorkingHours.map(day => day[1].startHour),
        endHour: this.props.getWorkingHours.map(day => day[1].endHour)
      });
    } else if (getDay === 3) {
      this.setState({
        startHour: this.props.getWorkingHours.map(day => day[2].startHour),
        endHour: this.props.getWorkingHours.map(day => day[2].endHour)
      });
    } else if (getDay === 4) {
      this.setState({
        startHour: this.props.getWorkingHours.map(day => day[3].startHour),
        endHour: this.props.getWorkingHours.map(day => day[3].endHour)
      });
    } else {
      this.setState({
        startHour: this.props.getWorkingHours.map(day => day[4].startHour),
        endHour: this.props.getWorkingHours.map(day => day[4].endHour)
      });
    }
    this.props.callbackGetDateValue(val)

    var i;
    for (i = 0; i < this.state.appointmentsDate.length; i++) {
      if (`${val.toLocaleDateString()}` === this.state.appointmentsDate[i].toLocaleDateString()) {
        const selectedDate = this.state.appointmentsDate[i];
        const getHours = selectedDate.getHours();
        const getMinutes = selectedDate.getMinutes();
/*         console.log(this.props.serviceId)
 */       
        if (this.props.serviceId == 3 && getMinutes === 30) {
          return this.setState({
            excludedTimes: [setHours(setMinutes(new Date(), getMinutes), getHours), setHours(setMinutes(new Date(), getMinutes - 30), getHours + 1)],
          },  /* () => console.log(this.state.excludedTimes) */ )          
        } else if (this.props.serviceId == 3 && getMinutes === 0) {
          return this.setState({
            excludedTimes: [setHours(setMinutes(new Date(), getMinutes), getHours), setHours(setMinutes(new Date(), getMinutes + 30), getHours)],
          },  /* () => console.log(this.state.excludedTimes)  */)   
        } else {
          return this.setState({
            excludedTimes: [setHours(setMinutes(new Date(), getMinutes), getHours)],
          },/*  () => console.log(this.state.excludedTimes) */)
        }
      }
    }
  };

  handleTime = (value) => {
      this.setState({
      time: value,
    }, /* () => console.log(this.state.time) */);
    this.props.callbackGetTimeValue(value)
  }

  componentDidMount() {

     // GET APPOINTMENTS

     fetch(baseUrl + '/appointments')
     .then(getAppointments => {
         return getAppointments.json();
     })
     .then(getAppointments => {
        const unix = getAppointments.map(appointment => appointment.startDate)
      
        const newValue = unix.map(value => new Date(value * 1000));

         this.setState({
             appointmentsDate: newValue,
         }, /* () => console.log(newValue) */)
     })
     .catch(err => {
         alert("Failed to load our appointments" + err)
     });

  }

  render() {
    const { startDate, startHour, endHour} = this.state;
    const now = moment().toDate();
    const isWeekday = date => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    };
 
    return (
      <div>
        <div className="input-wrapper">
          <DatePicker
              selected={startDate}
              onChange={this.handleChange.bind(this)}
              filterDate={isWeekday}
              minDate={new Date()}
              maxDate={addMonths(new Date(), 5)}
              disabled={this.props.datedisabled}
              placeholderText="Select Date"
              dateFormat="MMMM d, yyyy"
          />
          <span className="error">{this.props.errors['date']}</span>
        </div>
        <div className="input-wrapper">
          <DatePicker 
            selected={this.state.time}
            onChange={this.handleTime.bind(this)}
            showTimeSelect
            showTimeSelectOnly
            minTime={setHours(setMinutes(now, 0), startHour)}
            maxTime={setHours(setMinutes(now, 30), endHour - 1)}
            timeIntervals={this.props.serviceDuration}
            disabled={this.state.timeDisabled}
            timeCaption="Time"
            dateFormat="h:mm aa"
            placeholderText="Select Time"
            excludeTimes={this.state.excludedTimes}
          />
          <span className="error">{this.props.errors['time']}</span>
        </div>
      </div>
    )
  }
}

export default TimePicker
