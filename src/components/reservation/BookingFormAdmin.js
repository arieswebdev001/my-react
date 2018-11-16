import React, { Component } from 'react';
import { DateRange } from 'react-date-range';
import Select from 'react-select';
import Selector from '../ui/controls/Select';
import Input from '../ui/controls/Input';
import Axios from '../../wrappers/Axios';
import MultiSelect from "@kenshooui/react-multi-select";
import BookingSummary from '../ui/misc/BookingSummary';

class BookingFormAdmin extends Component {
    state = {
        room_types:[],
        extras:[],
        dateRange: {
            selection: {
                startDate: new Date(),
                endDate: new Date(window.moment().add(1,"days").format("YYYY-MM-DD")),
                key: 'selection',
            },
        },
        booking:{
            booked_start_datetime:window.moment().format("YYYY-MM-DD 12:00"),
            booked_end_datetime:window.moment().add(1,"days").format("YYYY-MM-DD 12:00"),
            nights:1,
            booked_rooms:[{
                label:'',
                room_type:{},
                room:{},
                value:0,
                adults:2,
                child:0,
                price:0
            }]
        },
        currentStep:0
    }

    componentDidMount(){
        this.getRoomTypes(this.state.booking.booked_start_datetime, this.state.booking.booked_end_datetime);
        this.getExtras();
    }

    getExtras(){
        let u = this;
        Axios.get('api/extras')
            .then(function (response) {
                u.setState({extras:response.data});
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    getNights(start, end){
        return window.moment(end).diff(window.moment(start),"days");
    }

    getRoomTypes(start, end){
        let u = this;
        Axios.get('api/roomTypes/'+ window.moment(start).format("YYYY-MM-DD") +'/'+ window.moment(end).format("YYYY-MM-DD") +'/all')
            .then(function (response) {
                u.setState({room_types:response.data});
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    handleRangeChange(which, payload) {
        this.setState({
            [which]: {
            ...this.state[which],
            ...payload,
            },
            booking:{
                ...this.state.booking,
                booked_start_datetime:window.moment(payload.selection.startDate).format("YYYY-MM-DD 12:00"),
                booked_end_datetime:window.moment(payload.selection.endDate).add(1,"days").format("YYYY-MM-DD 12:00"),
                nights:this.getNights(payload.selection.startDate, payload.selection.endDate),
                booked_rooms:[{
                    label:'',
                    room_type:{},
                    room:{},
                    value:0,
                    adults:2,
                    child:0,
                    price:0
                }],
                booked_extras:[]
            }
        });
        this.getRoomTypes(payload.selection.startDate, payload.selection.endDate);
    }

    nextStep(){
        switch(this.state.currentStep){
            case 0:
                if(this.state.booking.nights === 0){
                    window.toastr.error("Must be at least 1 night of stay.");
                    return false;
                }
            break;
            default:
                
        }

        this.setState({ currentStep:this.state.currentStep+1 })
    }

    saveBooking(){

    }

    deleteRoom(key){
        const newArray = this.state.booking.booked_rooms.filter((room, index)=>{
            return key!==index;
        });
        this.setState({
            booking:{
                ...this.state.booking,
                booked_rooms:newArray
            }
        });
    }

    addRoom(){
        this.setState({
            booking:{
                ...this.state.booking,
                booked_rooms:[
                    ...this.state.booking.booked_rooms,
                    {
                        label:'',
                        room_type:{},
                        room:{},
                        value:0,
                        adults:2,
                        child:0,
                        price:0
                    }
                ]
            }
        });
    }

    handleSelectRoom(e, key){
        const newArray = this.state.booking.booked_rooms.map((room, index)=>{
            if(key===index)
                room = {
                    ...room,
                    label:e.label,
                    room_type:e.room_type,
                    room:e.room,
                    value:e.value,
                    price:this.evaluatePrice(e)
                }
            return room;
        });

        this.setState({
            booking:{
                ...this.state.booking,
                booked_rooms:newArray
            }
        });
    }

    evaluatePrice(room){
        let prices = room.room_type.pricing;
        if(prices.length === 1)
            var p = prices[0].pricing_schedule;
        else{
            //get standard pricing
            for(var x=0;x<prices.length;x++){
                if(prices[x].pricing_type === 'SEASONAL' || prices[x].pricing_type === 'REGULAR')
                    p = prices[x];
            }

            for(var x=0;x<prices.length;x++){
                if(prices[x].pricing_type === 'SEASONAL_AD' || prices[x].pricing_type === 'REGULAR_AD')
                    if(room.child === prices[x].pricing_condition.child && room.adults === prices[x].pricing_condition.adult)
                        p = prices[x]
            }
        }



        return p[0] * this.state.booking.nights;
    }

    handleChangeRoomDetail(value, field, key){
        const newArray = this.state.booking.booked_rooms.map((room, index)=>{
            if(key===index)
                room[field] = Number(value);

            if(field !== 'price')
                room.price = this.evaluatePrice(room);

            return room;
        });

        this.setState({
            booking:{
                ...this.state.booking,
                booked_rooms:newArray
            }
        });
    }

    availableOccupants(type, room){
        var array = [];
        if(room.room.room_data !== undefined){
            let is_custom = room.room.room_data.customized !== undefined;
            if(is_custom)
                var data = room.room.room_data.customized[type==='adults'?'max_adult':'max_child'];
            else
                var data = room.room_type[type==='adults'?'max_adult':'max_child'];
    
            for(var x=(type==='adults'?1:0);x<=data;x++)
                array.push(x);
        }

        return array;
    }

    alreadyTaken(option, key){
        for(var x=0;x<this.state.booking.booked_rooms.length;x++){
            if(key !== x){
                if(option.value === this.state.booking.booked_rooms[x].value)
                    return true;
            }
        }
        return false;
    }

    handleChangeExtras(items){
        this.setState({ booking:{
            ...this.state.booking,
            booked_extras:items
        } });
    }

    getComputation(extra, what){
        if(extra.pricing_type==='Per Day')
            return what==='value'?this.state.booking.nights * extra.selling_price: (" * (" + this.state.booking.nights + ") = " + ( this.state.booking.nights * extra.selling_price ).toFixed(2))
        else if(extra.pricing_type==='Per Head')
            return what==='value'? ( this.getOccupantCount() * extra.selling_price ):(" * (" + this.getOccupantCount() + ") = " + ( this.getOccupantCount() * extra.selling_price ).toFixed(2))
        else if(extra.pricing_type==='Per Head/Day')
            return what==='value'?(this.state.booking.nights * this.getOccupantCount()) * extra.selling_price :(" * (" + this.getOccupantCount() + ") * (" + this.state.booking.nights + ") = " + ((this.state.booking.nights * this.getOccupantCount()) * extra.selling_price ).toFixed(2))
        else if(extra.pricing_type==='Per Booking')
            return what==='value'? extra.selling_price:(" = " +  extra.selling_price.toFixed(2));
    }

    getOccupantCount(){
        var x = 0;
        this.state.booking.booked_rooms.forEach((item)=>{
            if(item.value !== 0)
                x+= (item.child + item.adults);
        });
        return x;
    }

    render() {
        const groupedOptions = this.state.room_types.map((room_type)=>{
            return { 
                    label:room_type.room_type_name,
                    options:room_type.rooms.filter((room)=>{
                        return room.is_operational && !room.is_reserved;
                    }).map((room)=>{
                        return {
                            label:room.room_no,
                            value:room.id,
                            room:room,
                            room_type:room_type
                        }
                    })
                }
        });
        const extras = this.state.extras.map((extra)=>{
            return {
                label:extra.extra_name + " (PHP "+ extra.selling_price +" "+ extra.pricing_type +")  "+ this.getComputation(extra, 'label') +" " ,
                id: extra.id, 
                price: extra.selling_price,
                pricing_type: extra.pricing_type,
                total:this.getComputation(extra, 'value')
            }
        });
        const steps = [
            {
                step_name:"Date and Room",
                content:
                <div className="row" key={0}>
                    <div className="col-lg-4">
                        <h5>Book for { this.state.booking.nights } Night(s)</h5>
                        <DateRange 
                            onChange={this.handleRangeChange.bind(this, 'dateRange')}
                            moveRangeOnFirstSelection={false}
                            ranges={[this.state.dateRange.selection]}
                            className={'PreviewAreaBooking'}
                            minDate={ new Date(window.moment().format("YYYY-MM-DD")) }
                        />
                    </div>
                    <div className="col-md-5">
                        <h5> 
                            {this.state.booking.booked_rooms.length} Room(s) &nbsp; 
                            <button className="btn btn-sm btn-info" onClick={()=>this.addRoom()}>+</button>
                        </h5>
                        <table className="table table-hover table-bordered table-condensed">
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th style={{width:90}}>Adult</th>
                                    <th style={{width:90}}>Child</th>
                                    <th style={{width:120}}>Price</th>
                                    <th style={{width:20}}></th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.booking.booked_rooms.map((room, key)=>
                                    <tr key={key}>
                                        <td>
                                            <Select isOptionDisabled={(option) => this.alreadyTaken(option, key)} 
                                                options={groupedOptions} value={room} onChange={(e)=> this.handleSelectRoom(e, key) }/>
                                        </td>
                                        <td>
                                            <Selector _value={room.adults} selection={this.availableOccupants('adults', room)}
                                                onChange={(e)=>this.handleChangeRoomDetail(e,'adults',key)}/>
                                        </td>
                                        <td>
                                            <Selector _value={room.child} selection={this.availableOccupants('child', room)}
                                                onChange={(e)=>this.handleChangeRoomDetail(e,'child',key)}/>
                                        </td>
                                        <td>
                                            <Input type="number" _value={room.price} onChange={(e)=>this.handleChangeRoomDetail(e,'price',key)}/>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={()=>this.deleteRoom(key) }>X</button>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                        <h5> Add-ons</h5>
                        <MultiSelect
                            items={extras}
                            selectedItems={this.state.booking.booked_extras}
                            onChange={(e)=>this.handleChangeExtras(e)}
                            showSelectedItems={false}
                            height={250}
                        />
                    </div>
                    <div className="col-md-3">
                        <BookingSummary/>
                    </div>
                </div>
            },
            {
                step_name:"Guest Details",
                content:
                <div className="row" key={2}>
                            
                </div>
            },
            {
                step_name:"Confirmation",
                content:
                <div className="row" key={3}>
                            
                </div>
            }
        ]

        return (
            <div>
                {   steps.map((step, key)=>{
                        return this.state.currentStep === key ? step.content:'';
                    })
                }
                
                <div className="modal-footer">
                    {   this.state.currentStep > 0 ? <button className="btn btn-warning" onClick={ ()=>this.setState({ currentStep:this.state.currentStep-1 })}> Back </button>:
                            <button className="btn" onClick={ () => { window.$("#booking-modal").modal("hide")} } >
                                Close
                            </button>
                    }
                    {   this.state.currentStep < (steps.length-1) ? <button className="btn btn-info" onClick={ ()=>this.nextStep() }> Next </button>:
                            <button className="btn btn-success" id="save-booking-button" onClick={ ()=>this.saveBooking() }> Save </button>
                    }
                </div>
            </div>);
    }
}


export default BookingFormAdmin;