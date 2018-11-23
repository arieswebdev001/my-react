import React, { Component } from 'react';
import ItemRow from '../ui/misc/ItemRow';
import Select from '../ui/controls/Select';

class PaymentClient extends Component {
    
    render() {
        return (
            <div>
                <div className="m-widget13">
                    <ItemRow value={ (this.props.booking.guest.title===null?"": this.props.booking.guest.title) + " " + this.props.booking.guest.first_name + " " +
                        (this.props.booking.guest.middle_name===null?"":this.props.booking.guest.middle_name) + " " + this.props.booking.guest.last_name } label="Name"/>  
                    <ItemRow value={ this.props.booking.guest.birth_date } label="Birth Date"/>  
                    <ItemRow value={ this.props.booking.guest.email } label="Email"/>  
                    <ItemRow value={ this.props.booking.guest.company_name } label="Company Name"/>  
                    <ItemRow value={ this.props.booking.guest.position } label="Position"/>   
                    <ItemRow value={ this.props.booking.guest.mobile } label="Mobile"/> 
                    <ItemRow value={ this.props.booking.guest.address } label="Address"/> 
                    <ItemRow value={ (this.props.booking.guest.city===null?"":this.props.booking.guest.city)  + (this.props.booking.guest.state!== null?(" " + this.props.booking.guest.state):"" )} 
                        label="Address 2"/> 
                    <ItemRow value={ this.props.booking.guest.country } label="Country"/> 
                    <ItemRow value={ this.props.booking.guest.zip_code } label="Zip code"/> 
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                        <Select label="Payment Method" onChange={(e)=>this.props.onUpdate(e)}
                            _value={ this.props.booking.invoice.payment_method } selection={['Pay At Hotel', 'PayPal']} />
                    </div>
                </div>
            </div>
        );
    }
}
export default PaymentClient;