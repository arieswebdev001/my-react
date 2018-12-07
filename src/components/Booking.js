import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookingFormClient from './reservation/BookingFormClient';
import Axios from '../wrappers/Axios';
import RegularPortlet from './ui/portlets/RegularPortlet';
import * as qs from 'query-string';
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
        else
            window.location.href = '../../ebooking/' + response.booking.id + '?booking_token=' + response.booking_token;
    }

    render() {
        return (
            <div className="Booking">
                <RegularPortlet>
                    <BookingFormClient 
                        savedBooking={((e)=>this.savedBooking(e))} 
                        extras={this.props.extras} 
                        defaultID={this.state.booking_id}
                        bookingSource="Website"
                        defaultParams={qs.parse(window.location.search)}
                    />
                </RegularPortlet>
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