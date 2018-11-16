import React, { Component } from 'react';
import { DateRange } from 'react-date-range';
import Axios from '../../wrappers/Axios';
import RoomSelection from './RoomSelection';
import AddOnSelection from './AddOnSelection';
import GuestDetails from './GuestDetails';
import PaymentDetails from './PaymentDetails';
import BookingConfirmation from './BookingConfirmation';
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
            checkin_datetime:window.moment().format("YYYY-MM-DD 12:00"),
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
            }],
            booking_source:'Walk-In',
            booked_extras:[],
            guest:{
                title:"",
                first_name:"",
                middle_name:"",
                last_name:"",
                mobile:"",
                email:"",
                company_name:"",
                position:"",
                address:"",
                city:"",
                state:"",
                country:"",
                zip_code:0,
                birth_date:"2000-01-01",
                notes:""
            },
            is_member:0,
            guest_id:0,
            booking_notes:"",
            booking_status:"pending",
            booking_data:{
                discount:
                {
                    //     promo_code:"",
                    //     discount:0,
                    //     discount_type:"total"
                },
                total_discount:0
            },
            invoice:{
                reference_no:"",
                payment_method:"Cash",
                amount_due:0,
                amount_paid:0,
                invoice_status:"Pending",
                invoice_notes:"",
                invoice_data:{
                    cash_received:0
                }
            }
        },
        currentStep:0,
        visited:[0]
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

    getNights(start, end){ return window.moment(end).diff(window.moment(start),"days");}

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

    nextStep(from_key){
        switch(from_key){
            case 0:
                if(this.state.booking.nights === 0){
                    window.toastr.error("Must be at least 1 night of stay.");
                    return false;
                }

                if(this.state.booking.booked_rooms.length === 0){
                    window.toastr.error("Must be add at least 1 room to book.");
                    return false;
                }

                if(this.state.booking.booked_rooms[0].value === 0){
                    window.toastr.error("Please select room.");
                    return false;
                }
            break;
            default:
                
        }

        if(this.state.visited.indexOf(from_key+1) === -1)
            this.setState({ visited: [...this.state.visited, from_key+1] });

        this.setState({ currentStep:from_key+1 })
    }

    saveBooking(){

    }

    recomputeTotal(){

    }

    render() {

        const steps = [
            {
                step_name:"Date and Room",
                content:
                <div className="row" key={0}>
                    <div className="col-lg-5">
                        <h3>Booking for { this.state.booking.nights } Night(s)</h3>
                        <DateRange 
                            onChange={this.handleRangeChange.bind(this, 'dateRange')}
                            moveRangeOnFirstSelection={false}
                            ranges={[this.state.dateRange.selection]}
                            className={'PreviewArea'}  
                            minDate={ new Date(window.moment().format("YYYY-MM-DD")) }
                        />
                    </div>
                    <div className="col-md-7  table-responsive">
                        <RoomSelection 
                            roomTypes={this.state.room_types} 
                            bookedRooms={this.state.booking.booked_rooms} 
                            onUpdate={(e)=> {this.setState({ booking: { ...this.state.booking, booked_rooms:e, booked_extras:[] } }); this.recomputeTotal(); }}
                            nights={this.state.booking.nights}
                        />
                        <br/>
                        <AddOnSelection
                            extras={this.state.extras}
                            bookedExtras={this.state.booking.booked_extras}
                            nights={this.state.booking.nights}
                            bookedRooms={this.state.booking.booked_rooms} 
                            onUpdate={(e)=> {this.setState({ booking: { ...this.state.booking, booked_extras:e } }); this.recomputeTotal(); } }
                        />
                    </div>
                </div>
            },
            {
                step_name:"Guest Details",
                content:<GuestDetails guest={this.state.booking.guest} key={2} checkinTime={this.state.booking.checkin_datetime}
                            onUpdate={ (e, field ) => this.setState({booking:{ ...this.state.booking, guest: { ...this.state.booking.guest, [field]:e } }}) } />
            },
            {
                step_name:"Payment",
                content:<PaymentDetails key={3} booking={this.state.booking} onUpdate={ (e) => { this.setState({booking:e}); this.recomputeTotal(); }}/>
            },
            {
                step_name:"Confirmation",
                content:<BookingConfirmation key={4} />
            },
        ]

        return (
            <div className="m-wizard m-wizard--3 m-wizard--success">
                <div className="row m-row--no-padding">
                    <div className="col-md-3">
                        <div className="m-wizard__head">	 
                            <div className="m-wizard__nav">
                                <div className="m-wizard__steps">
                                    {
                                        steps.map((step, key)=>
                                            <div className={"m-wizard__step " + (this.state.currentStep === key? "m-wizard__step--current":"")} key={key}>
                                                <div className="m-wizard__step-info">
                                                    <span className="m-wizard__step-number" onClick={()=> this.state.visited.indexOf(key) !== -1 ? this.nextStep(key-1):false }>							 
                                                        <span style={{color:"white", fontSize:16, cursor:"pointer"}}>{key+1}</span>						 
                                                    </span>
                                                    <div className="m-wizard__step-line">
                                                        <span></span>
                                                    </div>
                                                    <div className="m-wizard__step-label">
                                                        { step.step_name }								
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>	
                        </div>
                    </div>
                    <div className="col-md-9">
                        {  steps.map((step, key)=>(this.state.currentStep === key ? step.content:'')) }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mm-footer">
                        {   this.state.currentStep < (steps.length-1) ? <button className="btn btn-info" onClick={ ()=>this.nextStep(this.state.currentStep) }> Next </button>:
                                <button className="btn btn-success" id="save-booking-button" onClick={ ()=>this.saveBooking() }> Save </button>
                        }
                        {   this.state.currentStep > 0 ? <button className="btn btn-warning" onClick={ ()=>this.setState({ currentStep:this.state.currentStep-1 })}> Back </button>:
                                <button className="btn" onClick={ () => { window.$("#booking-modal").modal("hide")} } >
                                    Close
                                </button>
                        }
                    </div>
                </div>
            </div>);
    }
}
export default BookingFormAdmin;