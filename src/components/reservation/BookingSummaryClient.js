import React, { Component } from 'react';
class BookingSummaryClient extends Component {
    getTotalExtras(){
        var total = 0;
        this.props.booking.booked_extras.forEach((item)=>total += item.total);
        return total;
    }

    getTotalRooms(){
        var total = 0;
        this.props.booking.booked_rooms.forEach((item)=>total += item.price);
        return total;
    }

    bookedRooms(){
        var count = 0;
        this.props.booking.booked_rooms.forEach((item)=>{
            if(item.value !== 0)
                count++;
        });
        return count;
    }

    onClickDate(){
        this.props.onClickDate();
    }

    render() {
        return (
            <div style={{padding:15, color:"white",backgroundColor:"#464646"}}>
                <h4 style={{textAlign:"center", color:"white"}}>Booking Summary</h4>
                <strong>
                    Date: { window.moment(this.props.booking.booked_start_datetime).format("MM/DD/YYYY") } - { window.moment(this.props.booking.booked_end_datetime).format("MM/DD/YYYY") }
                    <small className="click-change" onClick={()=>this.onClickDate()}> (Change)</small> 
                </strong><br/>
                <strong>
                    { this.props.booking.nights } Night{ this.props.booking.nights>1?'s':null },&nbsp;
                    { this.bookedRooms() } Room{ this.bookedRooms() > 1?'s':null }
                </strong><br/><br/>

                <h6 style={{ color:"white"}}>Booked Rooms</h6>
                {
                    this.props.booking.booked_rooms.map((room, key)=>(
                        <div style={{color:"white"}} key={key}>
                            { room.label }
                        </div>
                    ))
                }
            </div>
        );
    }
}
export default BookingSummaryClient;