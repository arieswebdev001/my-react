import React, { Component } from 'react';
import { connect } from 'react-redux';
import TheScheduler from './reservation/TheScheduler';
import BookingFormAdmin from './reservation/BookingFormAdmin';
import RegularPortlet from './ui/portlets/RegularPortlet';
import Axios from '../wrappers/Axios';
class Reservations extends Component {
    state = {
        selected_slot:{
            booked_start_datetime:window.moment().format("YYYY-MM-DD 12:00"),
            booked_end_datetime:window.moment().add(1,"days").format("YYYY-MM-DD 12:00"),
            room_id:0
        }
    }

    componentDidMount(){
        this.props.updatePageTitle('Reservations');
        this.getRoomTypes();
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
        
    }

    render() {
        var rooms = [];
        this.props.room_types.forEach(room_type => {
            rooms.push(...room_type.rooms);
        });

        const buttons = [
            <button className="m-portlet__nav-link btn btn-success m-btn" onClick={()=>window.$("#booking-modal").modal("show")}>Add Booking</button>
        ];

        return (
            <div className="Reservations">
                <RegularPortlet title="Bookings" colorClass="m-portlet--primary" buttons={buttons}>
                    <TheScheduler onUpdate={(e)=>this.getBookings(e)} resources={ rooms } events={[]}/>
                </RegularPortlet>
                <div className="modal fade" id="booking-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-full" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Booking Form</h5>
                            </div>
                            <div className="modal-body">
                                <BookingFormAdmin onSave={()=>{}}/>
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
        updateRoomTypes: (room_types)=>{dispatch({type:'UPDATE_ROOM_TYPES', payload:room_types})}
    }
}

const mapStateToProps = (state) => {
    return {
        room_types:state.room_types
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Reservations);