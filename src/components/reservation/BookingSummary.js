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
                        <div className="col-md-12">
                            <RoomSelection 
                                roomTypes={[]} 
                                bookedRooms={this.props.booking.booked_rooms} 
                                nights={this.props.booking.nights}
                            />
                            {
                                this.props.booking.booked_extras.length>0?
                                    <table className="table-hover table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Add-On</th>
                                                <th style={{width:85}}>Qty</th>
                                                <th style={{width:85}}>Price</th>
                                                <th style={{width:130}}>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.props.booking.booked_extras.map((extra)=>(
                                                    <tr key={extra.value}>
                                                        <td>{ extra.description }</td>
                                                        <td>{ extra.quantity }</td>
                                                        <td>{ extra.price }</td>
                                                        <td>{ extra.total }</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>:null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="m-widget13">
                                { 
                                    this.props.booking.id!==0? <ItemRow value={ this.props.booking.reference_no } label="Booking ID"/>  :null
                                }
                                <ItemRow value={ window.moment(this.props.booking.booked_start_datetime).format("MM/DD/YYYY") +" - "+ window.moment(this.props.booking.booked_end_datetime).format("MM/DD/YYYY")} label="Date"/>  
                                <ItemRow value={ this.props.booking.nights } label="Nights"/>  
                                <ItemRow value={ this.props.booking.booked_rooms.length } label="Rooms:"/>
                                <ItemRow value={ this.props.booking.booking_status } label="Booking Status"/>  
                                <ItemRow value={ this.props.booking.booking_source } label="Booking Type"/>  
                                <ItemRow value={ window.moment(this.props.booking.checkin_datetime).format("hh:mm A")  } label="Arrival Time"/>  
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="m-widget13">  
                                <ItemRow value={ this.getTotalRooms() } label="Rooms Total:" textAlign="right" type="money"/>
                                <ItemRow value={ this.getTotalExtras() } label="Add-Ons Total" textAlign="right" type="money"/>  
                                <ItemRow value={ this.getTotalExtras() + this.getTotalRooms() } label="Sub Total" textAlign="right" type="money"/>  
                                <ItemRow value={ this.props.booking.booking_data.total_discount } label="Discount" textAlign="right" type="money"/>  
                                <ItemRow value={ (this.getTotalExtras() + this.getTotalRooms()) - this.props.booking.booking_data.total_discount } label="Net Total" textAlign="right" type="money"/>  
                                <ItemRow value={ this.props.booking.invoice.invoice_status } label="Invoice Status" textAlign="right"/>
                            </div>
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
                            <div className="m-widget13">
                                { 
                                    this.props.booking.id!==0? <ItemRow value={ this.props.booking.invoice.reference_no } label="Invoice No."/>  :null
                                }
                                <ItemRow value={ this.props.booking.invoice.amount_due } type="money" label="Amount Due"/>
                                <ItemRow value={ this.props.booking.invoice.amount_paid } type="money" label="Amount Paid"/>
                                { 
                                    this.props.booking.invoice.amount_due > this.props.booking.invoice.amount_paid ? 
                                    <ItemRow value={ this.props.booking.invoice.amount_due - this.props.booking.invoice.amount_paid } type="money" label="Balance"/>  :null
                                }
                                <ItemRow value={ this.props.booking.invoice.payment_method } label="Payment Method"/>
                                <ItemRow value={ this.props.booking.invoice.invoice_notes } label="Notes"/>
                                <ItemRow value={ this.props.booking.invoice.invoice_status } label="Status"/>
                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        );
    }
}
export default BookingConfirmation;