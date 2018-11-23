import React, { Component } from 'react';
import { ResourcesPath } from "../../config";
import Selector from '../ui/controls/Select';
import RoomInfo from '../ui/containers/RoomInfo';
import NumberFormat from 'react-number-format';
import ImageGallery from "react-image-gallery";
import Axios from '../../wrappers/Axios'

class RoomSelection extends Component {
    state={
        show_info_index: 0,
        selected:{
            adults:1,
            child:0
        }
    }

    componentWillReceiveProps(nextProps){
        let u = this;
        if(nextProps.bookedRooms !== this.props.bookedRooms)
            Axios.put('../../api/holdRooms', {rooms:nextProps.bookedRooms})
            .then((response) => {
                u.props.refreshRooms();
            });
    }

    availableOccupants(type, room){
        var array = [];
        var data = room[type==='adults'?'max_adult':'max_child'];
    
        for(var x=(type==='adults'?1:0);x<=data;x++)
            array.push(x);

        return array;
    }


    startHoldingRooms(){
        let u = this;
        setInterval(()=>{
            if(u.props.bookedRooms.length > 0)
                Axios.put('../../api/holdRooms', {rooms:u.props.bookedRooms})
                .then((response) => {
                    u.props.refreshRooms();
                });
        },50000);
    }

    addRoom(room){
        room.roomsset = room.rooms.filter((e)=>(
            !e.is_reserved && e.is_operational
        )).map((e)=>e.id);

        let u = this;
        Axios.put('../../api/holdRoom', room)
        .then((response) => {
            if(u.props.bookedRooms.length === 0)
                u.startHoldingRooms();

            u.props.onUpdate([
                ...u.props.bookedRooms,
                {
                    label:response.data.room.room_no,
                    room_type:room,
                    room:response.data.room,
                    value:response.data.room.id,
                    adults:u.state.selected.adults,
                    child:u.state.selected.child,
                    price:u.evaluatePrice(room)
                }
            ]);
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
        });
    }

    evaluatePrice(room){
        let prices = room.pricing;
        if(prices.length === 1)
            var p = prices[0].pricing_schedule;
        else{
            //get standard pricing
            for(var x=0;x<prices.length;x++){
                if(prices[x].pricing_type === 'SEASONAL' || prices[x].pricing_type === 'REGULAR')
                    p = prices[x];
            }

            for(x=0;x<prices.length;x++){
                if(prices[x].pricing_type === 'SEASONAL_AD' || prices[x].pricing_type === 'REGULAR_AD')
                    if(room.child === prices[x].pricing_condition.child && room.adults === prices[x].pricing_condition.adult)
                        p = prices[x]
            }
        }

        return p[0] * this.props.nights;
    }

    
    handleChangeRoomDetail(value, field){
        this.setState({
            selected:{
                ...this.state.selected,
                [field] : Number(value)
            }
        });
    }

    render() {
        const roomType = this.props.roomTypes[this.state.show_info_index];
        if(roomType !== undefined)
            var images = roomType.room_type_images.map((file)=>{
                return {
                    original: ResourcesPath + '/images/rooms/' + file,
                    thumbnail: ResourcesPath + '/images/rooms/' + file
                }
            });
            if(roomType !== undefined)
console.log(roomType.rooms);
        return (
            <div>
                <div className="row">
                    {
                        this.props.roomTypes.map((room, key)=>
                            <div className="col-md-3" key={room.id}>
                                <button onClick={()=>this.setState({ show_info_index:key })} className={"btn btn-block " + (this.state.show_info_index === key?'btn-warning':'btn-info')}>
                                    {room.room_type_name}
                                </button>
                            </div>
                        )
                    }
                </div>
                {
                    roomType !== undefined ?
                        <div className="row" style={{paddingTop:20}}>
                            <div className="col-md-5">
                                {
                                    images.length > 0 ? <ImageGallery items={images} autoPlay={false} showThumbnails={true} slideInterval={5000} showNav={false}/>:
                                        <img src={ ResourcesPath + "/images/rooms/no-photo.jpg"} alt="Room" className="img img-responsive" style={{ width:"100%", marginBottom:10 }}/>
                                }
                            </div>
                            <div className="col-md-7">
                                <h4>{roomType.room_type_name}</h4>
                                <p>
                                    { roomType.room_type_description } 
                                    <span className="clickable" style={{color:"#36a3f7"}} onClick={()=>window.$("#info-modal").modal("show")}> More Info... </span>
                                </p>
                                
                                <h5>
                                    Price for { this.props.booking.nights } night{ this.props.booking.nights>1?'s':null } :  <NumberFormat value={ this.evaluatePrice(roomType) } displayType={'text'} thousandSeparator={true} prefix={'PHP '} />
                                </h5>
                                {
                                    roomType.rooms.filter((x)=>x.is_operational&&!x.is_reserved).length > 0? 
                                        <div className="row" >
                                            <div className="col-md-3">
                                                <Selector label="Adults" _value={this.state.selected.adults} selection={this.availableOccupants('adults', roomType)}
                                                    onChange={(e)=>this.handleChangeRoomDetail(e,'adults')}/>
                                            </div>
                                            <div className="col-md-3">
                                                <Selector label="Child" _value={this.state.selected.child} selection={this.availableOccupants('child', roomType)}
                                                    onChange={(e)=>this.handleChangeRoomDetail(e,'child')}/>
                                            </div>
                                            <div className="col-md-6">
                                                <label>&nbsp;</label>
                                                <button onClick={()=>this.addRoom(roomType)} className="btn btn-block btn-warning">Book Room</button>
                                            </div>
                                        </div>:
                                        <div className="alert alert-info">No Rooms Available</div>
                                }
                                
                                <div className="modal fade" id="info-modal" tabIndex="-1" role="dialog">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">{ roomType.room_type_name }</h5>
                                            </div>
                                            <div className="modal-body">
                                                <RoomInfo roomType={ roomType } hideRoomCount={true} />
                                            </div>
                                            <div className="modal-footer">
                                                <button className="btn btn-sm" onClick={ () => window.$("#info-modal").modal("hide") } >Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>:null
                }
            </div>
        );
    }
}

export default RoomSelection;