import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookingFormAdmin from './reservation/BookingFormAdmin';
import Axios from '../wrappers/Axios';
class Booking extends Component {

    state = {
        booking_id:0
    }

    componentDidMount(){
        this.props.updatePageTitle('Booking');
        this.showBooking();
        this.getRoomTypes();
        this.getExtras()
    }

    showBooking(){
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

    savedBooking(response){
        if(response.paypal !== null)
            window.location.href = response.paypal.original.approval_url;
    }

    render() {
        return (
            <div className="Booking">
                <div className="modal fade" id="booking-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-full" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Booking Form</h5>
                            </div>
                            <div className="modal-body">
                                <BookingFormAdmin 
                                    savedBooking={((e)=>this.savedBooking(e))} 
                                    extras={this.props.extras} 
                                    defaultID={this.state.booking_id}
                                    bookingSource="Website"
                                    userType="guest"
                                />
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
export default connect(mapStateToProps, mapDispatchToProps)(Booking);