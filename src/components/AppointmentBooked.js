import React, { Component } from 'react'
import '../sass/bookingsuccess.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component'

export class AppointmentBooked extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gif: [],
            selectedGif: null,
        };

    }


    componentDidMount() {
        const getGif = 'https://api.giphy.com/v1/gifs/search?api_key=KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI&q=barber';

        // GET GIF

        fetch(getGif)
        .then(response => {
            return response.json();
        })
        .then(response => {
            const gifs = response.data;
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
            this.setState({
                gif: randomGif.images.fixed_height.url
            }, () => console.log(this.state.gif))
        })
        .catch(err => {
            alert("Failed to load gif " + err)
        });

    }

    render() {
        const { gif } = this.state;
        return (
            <div className="section-booking-success">
                <div className="container">

                    <div className="center-wrapper">
                        <h2>Appointment successfully booked</h2>

                        <div className="success-gif-wrapper">
                            
                            <LazyLoadImage
                            alt="Barber gif"
                            src={gif}
                            />

                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default AppointmentBooked
