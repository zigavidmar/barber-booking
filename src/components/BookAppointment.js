import React, { Component } from 'react'
import '../sass/bookappointment.scss';
import { TimePicker } from './TimePicker';
import { Redirect } from 'react-router-dom';

export const baseUrl = 'https://api.npoint.io/0d5f88f0335d773fb0c5';

export class BookAppointment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {},
            barbers: [],
            services: [],
            startDate: new Date(),
            price: null,
            servicePrice: "Service Price",
            dateDisabled: true,
            timeDisabled: true,
            serviceDuration: 0,
            serviceDisable: true,
            getWorkingHours: null,
            test: [],
            formValidated: null,
            dateValue: null,
            timeValue: null,
            postId: null,
        };

    }

    callbackGetDateValue = (date) => {
        this.setState({dateValue: date.toLocaleDateString()}, /* () => console.log(this.state.dateValue) */)
        let fields = this.state.fields;
        fields['date'] = date;        
        this.setState({fields});
    }

    callbackGetTimeValue = (time) => {
        this.setState({timeValue: time.toLocaleTimeString()}, /* () => console.log(this.state.timeValue) */)
        let fields = this.state.fields;
        fields['time'] = time;        
        this.setState({fields});
    }

    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        /* console.log(this.state.dateValue) */

        //Name
        if(!fields["name"] || !fields["surname"]){
          formIsValid = false;
          errors["name"] = "Please enter your full name";
        }
    
        if(typeof fields["name"] !== "undefined"){
          if(!fields["name"].match(/^[a-zA-Z]+$/)){
            formIsValid = false;
            errors["name"] = "Only letters";
          }      	
        }
    
        //Email
        if(!fields["email"]){
          formIsValid = false;
          errors["email"] = "Please enter your email";
        }
    
        if(typeof fields["email"] !== "undefined"){
          let lastAtPos = fields["email"].lastIndexOf('@');
          let lastDotPos = fields["email"].lastIndexOf('.');
    
          if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
            formIsValid = false;
            errors["email"] = "Please enter a valid email";
          }
        }

        //Phone
        if(!fields["phone"]){
            formIsValid = false;
            errors["phone"] = "Please enter phone number";
          }

        //Barber
        if(!fields["barber"]){
            formIsValid = false;
            errors["barber"] = "Please select a barber";
        }

        //Service
        if(!fields["service"]){
            formIsValid = false;
            errors["service"] = "Please select a service";
        }

        // Date
        if(!fields["date"]){
            formIsValid = false;
            errors["date"] = "Please select a date";
        }

        // Time
        if(!fields["time"]){
            formIsValid = false;
            errors["time"] = "Please select the time";
        }
        
        /* console.log(this.state.fields) */
        this.setState({errors: errors});
        return formIsValid;

    }
    
    handleChange(field, e){    		
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        if(this.handleValidation()){
            this.setState({
                formValidated: true,
            });

            const date = new Date(Date.parse(this.state.dateValue + " " + this.state.timeValue));
            const unixTimestamp = Math.floor(date.getTime() / 1000);

            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer my-token',
                    'My-Custom-Header': 'foobar'
                },
                body: JSON.stringify({
                    startDate: unixTimestamp,
                    barberId:   parseInt(this.state.fields['barber']),
                    serviceId: parseInt(this.state.fields['service']),
                })};

            fetch('http://localhost:3004/appointments', requestOptions)
                .then(response => response.json())
                .then(data => this.setState({ postId: data.id }))
        
            } else {
            this.setState({
                formValidated: false,
            })
        }
    }

    handleClick = (field,e) => {
        let fields = this.state.fields;
        fields['service'] = e.target.value;        
        this.setState({fields});

        this.setState({
            price: e.target.value,
            dateDisabled: false,
        }, /*  () => console.log(this.state.selectedService) */ )
        
        if (e.target.value === "1") {
            this.setState({
                servicePrice: "Price is 15$"
            })
        } else if (e.target.value === "2") {
            this.setState({
                servicePrice: "Price is 20$"
            })
        } else if (e.target.value === "3") {
            this.setState({
                servicePrice: "Price is 30$"
            })
        } else {
            
        }
    }

    onChange = ( field, e) => {
        this.setState({
            getWorkingHours: this.state.barbers.map(barber => barber.workHours),
            serviceDisable: false,
        });

        let fields = this.state.fields;
        fields['barber'] = e.target.value;        
        this.setState({fields});
    }

    componentDidMount() {

        // GET BARBERS

        fetch(baseUrl + '/barbers')
        .then(getBarbers => {
            return getBarbers.json();
        })
        .then(getBarbers => {
            this.setState({
                barbers: getBarbers
            })
        })
        .catch(err => {
            alert("Failed to load our Barbers" + err)
        });

        // GET SERVICES

        fetch(baseUrl + '/services')
        .then(getServices => {
            return getServices.json();
        })
        .then(getServices => {
            this.setState({
                services: getServices
            })
        })
        .catch(err => {
            alert("Failed to load our Services" + err)
        });

    }

    

    render() {
        const { barbers, services, servicePrice, fields, errors, getWorkingHours, dateDisabled, timeDisabled } = this.state;
        if (this.state.formValidated === true) {
            return <Redirect to="barberbooked/"/>
        } else {
            
        }
        return (
            <div className="booking-app-wrapper">
                <div className="booking-app-title">
                    <h2>Book your appointment</h2>
                </div>

                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="input-wrapper">
                        <input type="text" placeholder="First Name" onChange={this.handleChange.bind(this, "name")} value={fields["name"] || ''}/>
                        <span className="error">{errors["name"]}</span>
                    </div>

                    <div className="input-wrapper">
                        <input type="text" placeholder="Last Name" onChange={this.handleChange.bind(this, "surname")} value={fields["surname"] || ''}/>
                    </div>

                    <div className="input-wrapper">
                        <input placeholder="Email" onChange={this.handleChange.bind(this, "email")} value={fields["email"] || ''} />
                        <span className="error">{errors["email"]}</span>
                    </div>

                    <div className="input-wrapper">
                        <input pattern="[0][0-9]{8}" placeholder="Phone Number" onChange={this.handleChange.bind(this, "phone")} value={fields["phone"] || ''}/>
                        <span className="error">{errors["phone"]}</span>
                    </div>

                    <div className="input-wrapper">
                       <select value={fields["barber"] || ''} onChange={this.onChange.bind(this, "barber")}>
                           <option hidden>Select Barber</option>
                           {barbers.map(barber => (
                                <option value={barber.id} key={barber.id}>
                                {barber.firstName} {barber.lastName}
                                </option>
                            ))}
                       </select>
                       <span className="error">{errors["barber"]}</span>
                    </div>

                    <div className="input-wrapper">
                       <select value={fields["service"] || ''} onChange={this.handleClick.bind(this, "service")} disabled={(this.state.serviceDisable === true ) ? "disabled" : null}>
                           <option hidden>Select Service</option>
                           {services.map(service => (
                                <option value={service.id}
                                    key={service.id}>
                                    {service.name}
                                </option>
                            ))}
                       </select>
                       <span className="error">{errors["service"]}</span>
                    </div>

                    <TimePicker 
                    serviceId={this.state.price}
                    errors={this.state.errors}
                    callbackGetTimeValue={this.callbackGetTimeValue}
                    callbackGetDateValue={this.callbackGetDateValue} 
                    getWorkingHours={getWorkingHours} 
                    datedisabled={dateDisabled} 
                    timeDisabled={timeDisabled}
                    />

                    <div className="input-wrapper price">
                        <input value={servicePrice} disabled/>
                    </div>
                    
                    <input type="submit" value="Book appointment" />
                </form>
            </div>
        )
    }
}

export default BookAppointment