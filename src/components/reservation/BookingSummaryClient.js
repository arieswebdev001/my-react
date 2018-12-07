import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
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

    
    removeRoom(key){
        const newArray = this.props.booking.booked_rooms.filter((room, index)=>{
            return key!==index;
        });
        this.props.onUpdateRoom(newArray);
    }

    removeExtra(key){
        const newArray = this.props.booking.booked_extras.filter((extra, index)=>{
            return key!==index;
        });
        this.props.onUpdateExtra(newArray);
    }

    handleChangeCode(value){
        this.props.onUpdate({
            ...this.props.booking,
            booking_data:{
                ...this.props.booking.booking_data,
                discount:{
                    ...this.props.booking.booking_data.discount,
                    promo_code:value
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

    resolvePromoCode(){
        var resolved = this.props.promos.find((promo)=>
            promo.promo_code === this.props.booking.booking_data.discount.promo_code
        );
        var discount = 0;
        var discount_type = "total";
        if(resolved !== undefined){
            discount_type = resolved.discount_type;
            if(discount_type === "total")
                discount = resolved.promo_data.discount;
            else if(discount_type === "percentage")
                discount = this.getTotal() * (resolved.promo_data.discount/100);
        }

        if(discount > 0){
            this.props.onUpdate({
                ...this.props.booking,
                booking_data:{
                    ...this.props.booking.booking_data,
                    discount:{
                        ...this.props.booking.booking_data.discount,
                        discount:discount,
                        discount_type:discount_type,
                    },
                    total_discount:discount
                }
            });
            window.toastr.success("Promo Code OK");
        }
        else
            window.toastr.error("Promo Code did not exist");
    }

    cancelPromoCode(){
        this.props.onUpdate({
            ...this.props.booking,
            booking_data:{
                ...this.props.booking.booking_data,
                discount:{
                    promo_code:"",
                    discount:0,
                    discount_type:"total"
                },
                total_discount:Number(0)
            }
        });
    }

    render() {
        return (
            <div style={{padding:15, color:"white",backgroundColor:"#464646"}}>
                <h4 style={{textAlign:"center", color:"white"}}>Booking Summary</h4>
                <strong>
                    Date: { window.moment(this.props.booking.booked_start_datetime).format("MM/DD/YYYY") } - { window.moment(this.props.booking.booked_end_datetime).format("MM/DD/YYYY") }
                    {
                        this.props.showChange? <small className="click-change" onClick={()=>this.onClickDate()}> (Change)</small> : null
                    }
                </strong><br/>
                <strong>
                    { this.props.booking.nights } Night{ this.props.booking.nights>1?'s':null },&nbsp;
                    { this.bookedRooms() } Room{ this.bookedRooms() > 1?'s':null }
                </strong><br/><br/>
                {
                    this.props.booking.booked_rooms.length > 0?<h6 style={{ color:"white"}}>Booked Rooms</h6>:null
                }
                <table className="table table-bordered table-condensed" style={{width:"100%", backgroundColor:"white", color:"black"}}>
                    <tbody>
                    {
                        this.props.booking.booked_rooms.map((room, key)=>(
                            <tr key={key}>
                                <td>
                                    { room.room_type.room_type_name }<br/>
                                    <small>Adults: {room.adults}, Child: { room.child }</small>
                                </td>
                                <td style={{width:80}}>
                                    <NumberFormat value={ room.price} displayType={'text'} thousandSeparator={true} prefix={'PHP '} />
                                </td>
                                <td style={{width:50}}>
                                    <button disabled={!this.props.showChange} className="btn btn-sm btn-danger" onClick={()=>this.removeRoom(key)}>X</button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                {
                    this.props.booking.booked_extras.length > 0?<h6 style={{ color:"white"}}>Add-Ons</h6>:null
                }
                <table className="table table-bordered table-condensed" style={{width:"100%", backgroundColor:"white", color:"black"}}>
                    <tbody>
                    {
                        this.props.booking.booked_extras.map((extra, key)=>(
                            <tr key={key}>
                                <td>
                                    { extra.description }<br/>
                                    <small>{extra.quantity} @ { extra.price }</small>
                                </td>
                                <td style={{width:80}}>
                                    <NumberFormat value={ extra.total } displayType={'text'} thousandSeparator={true} prefix={'PHP '} />
                                </td>
                                <td style={{width:50}}>
                                    <button className="btn btn-sm btn-danger" onClick={()=>this.removeExtra(key)}>X</button>
                                </td>
                            </tr>
                        ))  
                    }
                    </tbody>
                </table>
                <table className="table table-bordered table-condensed" style={{width:"100%", backgroundColor:"white", color:"black"}}>
                    <tbody>
                        <tr>
                            <td>
                                <h6 style={{ textAlign:"right" }}>Sub Total:</h6>
                            </td>
                            <td>
                                <h6 style={{ textAlign:"right" }}><NumberFormat value={ this.getTotalExtras() + this.getTotalRooms() } displayType={'text'} thousandSeparator={true} prefix={'PHP '} /></h6>  
                            </td>
                        </tr>
                        <tr>
                            <td> 
                                <h6 style={{ textAlign:"right" }}> Promo Code: </h6>
                            </td>
                            <td> 
                                <div className="form-group">
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={ this.props.booking.booking_data.discount.promo_code } placeholder="Code" 
                                            disabled={ this.props.booking.booking_data.discount.discount>0 } 
                                            onChange={(e)=>this.handleChangeCode(e.target.value)} />
                                        <div className="input-group-append">
                                            {
                                                this.props.booking.booking_data.discount.discount === 0?
                                                    <button className="btn btn-primary btn-sm" type="button" 
                                                        onClick={()=>this.resolvePromoCode()}>Apply</button>:
                                                    <button className="btn btn-danger btn-sm" type="button" 
                                                        onClick={()=>this.cancelPromoCode()}>Remove</button>
                                            }
                                            
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.props.booking.booking_data.discount.discount>0 ?
                                        <small style={{ color:"blue" }}> 
                                            Promo Code Applied!
                                        </small>:null
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h6 style={{ textAlign:"right" }}> Discount:</h6>
                            </td>
                            <td>
                                <h6 style={{ textAlign:"right" }}>
                                    <NumberFormat allowNegative={false} disabled={ this.props.booking.booking_data.discount.discount > 0 }
                                        value={ this.props.booking.booking_data.total_discount} displayType="text" thousandSeparator={true} prefix={'PHP '} />
                                </h6>
                            </td>
                        </tr>
                        <tr>
                            <td style={{border:0}}> 
                                <h6 style={{ textAlign:"right" }}> Net Total: </h6>
                            </td>
                            <td> 
                                <h6 style={{ textAlign:"right" }}> 
                                    <NumberFormat allowNegative={false} value={(this.getTotal() - this.props.booking.booking_data.total_discount)} displayType={'text'} thousandSeparator={true} prefix={'PHP '} />
                                </h6> 
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default BookingSummaryClient;