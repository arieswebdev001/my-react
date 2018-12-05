import React, { Component } from 'react';
import Axios from '../wrappers/Axios';
import BookingSummary from './reservation/BookingSummary';
import RegularPortlet from './ui/portlets/RegularPortlet';
import * as qs from 'query-string';
import BookingFormClient from './reservation/BookingFormClient';
import { connect } from 'react-redux';

class Summary extends Component {
    state = {
        editing:false,
        booking:{}
    }

    componentDidMount(){
        this.getBooking();
        this.getExtras();
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


    getBooking(){
        let u = this;
        Axios.get('api/booking/' + this.props.match.params.id + '/' + qs.parse(window.location.search).token)
            .then(function (response) {
                u.setState({booking:response.data});
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    cancelBooking(){
        if(!window.confirm("Are you sure you want to cancel this booking?"))
            return false;
        let u = this;
        this.setState({
            booking:{
                ...this.state.booking,
                booking_status:"Cancelled"
            }
        }, ()=>{

            Axios.put('../../api/booking', u.state.booking)
            .then((response) => {
                window.location.reload();
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            window.toastr.error(error.response.data.message);
                }
            })
        })
    }

    render() {
        const buttons = [
            <button className="m-portlet__nav-link btn btn-success m-btn" 
                onClick={()=>window.location.href="../../../booking"}>New Booking</button>
        ];

        return (
            <RegularPortlet title="Booking Details" colorClass="m-portlet--primary" buttons={buttons}>
                <div className="row m-row--no-padding">
                    <div className="col-md-12">
                    {
                        this.state.booking.id !== undefined && !this.state.editing ? 
                            <div>
                                <BookingSummary userType="guest" key={4} booking={this.state.booking}/>
                                <hr/>
                                {
                                    this.state.booking.booking_status === 'Pending'?
                                    <div>
                                        <button className="btn btn-info" onClick={()=>this.setState({editing:true})}>Modify Booking</button>
                                        <button className="btn btn-danger" onClick={()=>this.cancelBooking()}>Cancel Booking</button>
                                    </div>:null
                                }
                            </div>: <div>
                                {
                                    this.state.booking.id !== undefined && this.state.editing?
                                        <BookingFormClient 
                                            savedBooking={((e)=>window.location.reload())} 
                                            extras={this.props.extras} 
                                            defaultID={this.state.booking.id}
                                            bookingSource="Website"
                                            defaultParams={qs.parse(window.location.search)}
                                            token={ qs.parse(window.location.search).token }
                                        />:null
                                }
                            </div> 
                    }
                    </div>
                </div>
            </RegularPortlet>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
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
export default connect(mapStateToProps, mapDispatchToProps)(Summary);