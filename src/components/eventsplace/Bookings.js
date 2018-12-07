import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

class Bookings extends Component {
    render() {
        return (
            <div className="Bookings" style={{"height":450}}>
                <BigCalendar
                    localizer={localizer}
                    events={[]}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        );
    }
}

export default Bookings;