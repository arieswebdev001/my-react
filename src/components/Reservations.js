import React, { Component } from 'react';
import { connect } from 'react-redux';
import TheScheduler from './reservation/TheScheduler';
import BookingFormAdmin from './reservation/BookingFormAdmin';
import RegularPortlet from './ui/portlets/RegularPortlet';
import Axios from '../wrappers/Axios';
import HouseKeeping from './rooms/room_type/HouseKeeping';

class Reservations extends Component {
    state = {
        selected_slot:{
            booked_start_datetime:window.moment().format("YYYY-MM-DD 12:00"),
            booked_end_datetime:window.moment().add(1,"days").format("YYYY-MM-DD 12:00"),
            room_id:0
        },
        bookings:[],
        booking_id:0
    }

    componentDidMount(){
        this.props.updatePageTitle('Reservations');
        this.getRoomTypes();
        this.getBookings();
        this.getExtras();
    }

    getRoomTypes(){
        let u = this;
        Axios.get('api/roomTypes')
            .then(function (response) {
                u.props.updateRoomTypes(response.data);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    getBookings(data){
        var start_date = window.moment().format("YYYY-MM-01")
        var end_date = window.moment().format("YYYY-MM-" + window.moment().daysInMonth());

        if(data !== undefined){
            start_date = data.startDate;
            end_date = data.endDate;
        }        

        let u = this;
        Axios.get('api/bookings/' + start_date + '/' + end_date)
            .then(function (response) {
                u.setState({bookings:response.data});
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    savedBooking(){
        this.getBookings();
        this.getRoomTypes();
    }

    showBooking(id){
        this.setState({
            booking_id:id
        });
        window.$("#booking-modal").modal("show");
    }

    
    getExtras(){
        let u = this;
        Axios.get('api/extras')
            .then(function (response) {
                u.props.updateExtras(response.data);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    render() {
        var rooms = [];
        this.props.room_types.forEach(room_type => {
            rooms.push(...room_type.rooms);
        });

        const buttons = [
            <button className="m-portlet__nav-link btn btn-success m-btn" 
                onClick={()=>{window.$("#booking-modal").modal("show"); this.setState({ booking_id:0})}}>Add Booking</button>,
            <button className="btn btn-warning" onClick={ () => window.$("#house-keeping-modal").modal("show") }>House Keeping</button>
        ];

        var bookings = []
        this.state.bookings.forEach((booking)=>{
            booking.booked_rooms.forEach((room)=>{
                var color = "#80c5f6";
                switch(booking.booking_status){
                    case "Confirmed":
                        color = "#33b900";
                    break;
                    case "Cancelled":
                    case "No-Show":
                        color = "#ff3d3d";
                    break;
                    case "Checked-In":
                        color = "#e0b125";
                    break;
                    case "Checked-Out":
                        color = "#9816f4";
                    break;
                    default:
                        color = "#80c5f6";
                }
                bookings.push({
                    bgColor:color,
                    start:booking.booked_start_datetime,
                    end:booking.booked_end_datetime,
                    resourceId:Number(room.room_id),
                    title:booking.guest.first_name + " " + booking.guest.last_name + " ("+ room.room_no +")",
                    id:booking.id
                });
            });
        });
        return (
            <div className="Reservations">
                <RegularPortlet title="Hotel Bookings" colorClass="m-portlet--primary" buttons={buttons}>
                    <TheScheduler onUpdate={(e)=>this.getBookings(e)} resources={ rooms } events={bookings} onEventClick={(id)=>this.showBooking(id)}/>
                </RegularPortlet>
                <div className="modal fade" id="booking-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-full" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Booking Form</h5>
                            </div>
                            <div className="modal-body">
                                <BookingFormAdmin savedBooking={((e)=>this.savedBooking(e))} extras={this.props.extras} defaultID={this.state.booking_id}/>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal fade" id="house-keeping-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> House Keeping </h5>
                            </div>
                            <div className="modal-body">
                                {
                                    this.props.default_property !== null ?
                                        <HouseKeeping rooms={rooms} houseKeepers={ this.props.default_property.property_data.house_keepers } onSave={ this.getRoomTypes.bind(this) } />:''
                                }
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-sm" onClick={ ()=> window.$("#house-keeping-modal").modal("hide") }>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
        updateRoomTypes: (room_types)=>{dispatch({type:'UPDATE_ROOM_TYPES', payload:room_types})},
        updateExtras: (extras)=>{dispatch({type:'UPDATE_EXTRAS', payload:extras})}
    }
}

const mapStateToProps = (state) => {
    return {
        room_types:state.room_types,
        extras:state.extras,
        default_property:state.default_property
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Reservations);