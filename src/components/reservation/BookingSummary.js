import React, { Component } from 'react';
import ItemRow from '../ui/misc/ItemRow';
import RoomSelection from './RoomSelection';
class BookingConfirmation extends Component {

    
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

    render() {
        return (
            <div className="row">
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="m-widget13">
                                <ItemRow value={ this.props.booking.reference_no } label="Booking ID"/>  
                                <ItemRow value={ this.props.booking.booked_start_datetime } label="Check In"/>  
                                <ItemRow value={ this.props.booking.booking_status } label="Booking Status"/>  
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="m-widget13">  
                                <ItemRow value={ this.props.booking.booked_rooms.length } label="Rooms:"/>
                                <ItemRow value={ this.props.booking.booked_end_datetime } label="Check Out"/>  
                                <ItemRow value={ this.props.booking.booking_source } label="Booking Type"/>  
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-12">
                            <RoomSelection 
                                roomTypes={[]} 
                                bookedRooms={this.props.booking.booked_rooms} 
                                nights={this.props.booking.nights}
                            />
                            {
                                this.props.booking.booked_extras.length>0?
                                    <div>
                                        <table className="table-hover table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Add-On</th>
                                                    <th>Qty</th>
                                                    <th>Price</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.props.booking.booked_extras.map((extra)=>(
                                                        <tr>
                                                            <td>{ extra.description }</td>
                                                            <td>{ extra.quantity }</td>
                                                            <td>{ extra.price }</td>
                                                            <td>{ extra.total }</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        <div className="m-widget13">  
                                            <ItemRow value={ this.getTotalRooms() } label="Total Rooms:"/>
                                            <ItemRow value={ this.getTotalExtras() } label="Total Add-Ons:"/>
                                            <ItemRow value={ this.getTotalExtras() + this.getTotalRooms()  } label="Booking Total"/>
                                        </div>
                                        </div>:
                                        <div className="alert alert-info">
                                            No Add-ons.
                                        </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href="#guest">Guest Info</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#invoice">Invoice</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane active" id="guest" role="tabpanel">
                            <div className="m-widget13">
                                <ItemRow value={ (this.props.booking.guest.title===null?"": this.props.booking.guest.title) + " " + this.props.booking.guest.first_name + " " +
                                    (this.props.booking.guest.middle_name===null?"":this.props.booking.guest.middle_name) + " " + this.props.booking.guest.last_name } label="Name"/>  
                                <ItemRow value={ this.props.booking.guest.birth_date } label="Birth Date"/>  
                                <ItemRow value={ this.props.booking.guest.email } label="Email"/>  
                                <ItemRow value={ this.props.booking.guest.company_name } label="Company Name"/>  
                                <ItemRow value={ this.props.booking.guest.position } label="Position"/>   
                                <ItemRow value={ this.props.booking.guest.mobile } label="Mobile"/> 
                                <ItemRow value={ this.props.booking.guest.address } label="Address"/> 
                                <ItemRow value={ (this.props.booking.guest.city===null?"":this.props.booking.guest.city)  + (this.props.booking.guest.state!== null?(" " + this.props.booking.guest.state):"" )} label="Address 2"/> 
                                <ItemRow value={ this.props.booking.guest.country } label="Country"/> 
                                <ItemRow value={ this.props.booking.guest.zip_code } label="Zip code"/> 
                            </div>
                        </div>
                        <div className="tab-pane" id="invoice" role="tabpanel">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BookingConfirmation;