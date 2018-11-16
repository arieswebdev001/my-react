import React, { Component } from 'react';
import Input from '../ui/controls/Input';
import TextArea from '../ui/controls/TextArea';
import Select from '../ui/controls/Select';

class PaymentDetails extends Component {
    handleChangeRoomDetail(value, field, key){
        const newArray = this.props.booking.booked_rooms.map((room, index)=>{
            if(key===index)
                room[field] = Number(value);

            return room;
        });
        this.props.onUpdate({
            ...this.props.booking,
            booked_rooms:newArray
        });
    }

    handleChangeExtraDetail(value, field, key){
        const newArray = this.props.booking.booked_extras.map((room, index)=>{
            if(key===index)
                room[field] = Number(value);

            room.total = room.price * room.quantity;
            
            return room;
        });
        this.props.onUpdate({
            ...this.props.booking,
            booked_extras:newArray
        });
    }

    handleUpdateDiscount(value){
        this.props.onUpdate({
            ...this.props.booking,
            booking_data:{
                ...this.props.booking.booking_data,
                discounts:[],
                total_discount:Number(value)
            }
        });
    }

    handleChangePaymentDetail(value, field, is_number=false){
        this.props.onUpdate({
            ...this.props.booking,
            invoice:{
                ...this.props.booking.invoice,
                [field]: is_number?Number(value):value
            }
        });
    }

    handleChange(value, field){
        this.props.onUpdate({
            ...this.props.booking,
            [field]:value
        });
    }

    handleChangeCashReceived(value){
        this.props.onUpdate({
            ...this.props.booking,
            invoice:{
                ...this.props.booking.invoice,
                invoice_data:{
                    ...this.props.booking.invoice.invoice_data,
                    cash_received:Number(value)
                }
            }
        });
    }

    getTotal(){
        var total = 0;
        this.props.booking.booked_rooms.forEach((item)=>total += item.price);
        this.props.booking.booked_extras.forEach((item)=>total += item.total);
        return total;
    }

    render() {
        return (
                <div className="row">
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-6">
                                <Select label="Booking Source" onChange={(e)=>this.handleChange(e, 'booking_source')} 
                                    _value={ this.props.booking.booking_source } selection={["Walk-In", "Phone", "Email"]} />
                            </div>
                            <div className="col-md-6">
                                <Input type="time" label="Arrival Time" onChange={(e)=>this.handleChange(e, 'checkin_datetime')} 
                                    _value={ this.props.booking.checkin_datetime }/>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered table-condensed">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th style={{width:90}}>Qty</th>
                                        <th style={{width:120}}>Price</th>
                                        <th style={{width:160}}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.booking.booked_rooms.map((room, key)=>(
                                            room.room !== undefined?
                                            <tr key={key}>
                                                <td>
                                                    { room.room_type.room_type_name }
                                                </td>
                                                <td>
                                                    <Input type="number" disabled={true} _value={ 1 }/>
                                                </td> 
                                                <td>
                                                    <Input type="number" onChange={(e)=>this.handleChangeRoomDetail(e,'price',key)} _value={ room.price }/>
                                                </td>
                                                <td>
                                                    <Input type="number" disabled={true} _value={ room.price.toFixed(2) }/>
                                                </td>
                                            </tr>:null
                                        ))
                                    }
                                    {
                                        this.props.booking.booked_extras.map((extra, key)=>(
                                            <tr key={key}>
                                                <td>
                                                    { extra.description }
                                                </td>
                                                <td>
                                                    <Input type="number" onChange={(e)=>this.handleChangeExtraDetail(e,'quantity',key)} _value={ extra.quantity }/> 
                                                </td>
                                                <td>
                                                    <Input type="number" onChange={(e)=>this.handleChangeExtraDetail(e,'price',key)} _value={ extra.price }/>
                                                </td>
                                                <td>
                                                    <Input type="number" disabled={true} _value={ (extra.price * extra.quantity).toFixed(2) }/>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    <tr>
                                        <td colSpan={3}> 
                                            <h5 style={{ textAlign:"right" }}> Sub Total: </h5>
                                        </td>
                                        <td colSpan={3}> 
                                            <h5 style={{ textAlign:"right" }}> { this.getTotal().toFixed(2) } </h5> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3}>
                                            <h5 style={{ textAlign:"right" }}> Discount:</h5>
                                        </td>
                                        <td colSpan={3}>
                                            <h5 style={{ textAlign:"right" }}>
                                                <Input type="number" onChange={(e)=>this.handleUpdateDiscount(e)} _value={ this.props.booking.booking_data.total_discount }/>
                                            </h5>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3}> 
                                            <h5 style={{ textAlign:"right" }}> Net Total: </h5>
                                        </td>
                                        <td colSpan={3}> 
                                            <h5 style={{ textAlign:"right" }}> { (this.getTotal() - this.props.booking.booking_data.total_discount).toFixed(2) } </h5> 
                                        </td>
                                    </tr>
                                </tbody>
                            </table>            
                        </div>
                    </div>
                    <div className="col-md-3">
                        <Input type="number" label="Amount Paid" onChange={(e)=>this.handleChangePaymentDetail(e, 'amount_paid', true)} 
                            _value={ this.props.booking.invoice.amount_paid }/>
                        {
                            (this.getTotal() - this.props.booking.booking_data.total_discount) > this.props.booking.invoice.amount_paid?
                                <small style={{ color:"red" }}> 
                                    Balance: { (this.getTotal() - this.props.booking.booking_data.total_discount) - this.props.booking.invoice.amount_paid } 
                                </small>:null
                        }
                        <Select label="Payment Method" onChange={(e)=>this.handleChangePaymentDetail(e, 'payment_method')} 
                            _value={ this.props.booking.invoice.payment_method } selection={["Cash", "Card"]} />
                        {
                            this.props.booking.invoice.payment_method==='Cash'?
                            <div>
                                <Input type="number" label="Cash Received" onChange={(e)=>this.handleChangeCashReceived(e) } 
                                    _value={ this.props.booking.invoice.invoice_data.cash_received }/>

                                {
                                    this.props.booking.invoice.amount_paid > this.props.booking.invoice.invoice_data.cash_received ?
                                        <small style={{ color:"red" }}> 
                                            Insufficient Cash!
                                        </small>:null
                                }

                                {
                                    this.props.booking.invoice.invoice_data.cash_received > this.props.booking.invoice.amount_paid?
                                    <Input type="number" label="Change" disabled={true} _value={ this.props.booking.invoice.invoice_data.cash_received - this.props.booking.invoice.amount_paid }/>
                                        :null
                                }
                            </div>:null
                        }
                        <TextArea label="Notes" rows={3} onChange={(e)=>this.handleChangePaymentDetail(e, 'invoice_notes')} 
                            _value={ this.props.booking.invoice.invoice_notes }/>
                    </div>
                </div>
        );
    }
}
export default PaymentDetails;