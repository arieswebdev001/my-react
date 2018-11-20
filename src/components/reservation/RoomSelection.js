import React, { Component } from 'react';
import Select from 'react-select';
import Selector from '../ui/controls/Select';
import RoomInfo from '../ui/containers/RoomInfo';
import NumberFormat from 'react-number-format';

class RoomSelection extends Component {
    state={
        show_info_index: false
    }
    availableOccupants(type, room){
        var array = [];
        if(room.room.room_data !== undefined){
            let is_custom = room.room.room_data.customized !== undefined;
            let data;

            if(is_custom)
                data = room.room.room_data.customized[type==='adults'?'max_adult':'max_child'];
            else
                data = room.room_type[type==='adults'?'max_adult':'max_child'];
    
            for(var x=(type==='adults'?1:0);x<=data;x++)
                array.push(x);
        }

        return array;
    }

    
    alreadyTaken(option, key){
        for(var x=0;x<this.props.bookedRooms.length;x++){
            if(key !== x){
                if(option.value === this.props.bookedRooms[x].value)
                    return true;
            }
        }
        return false;
    }

    deleteRoom(key){
        const newArray = this.props.bookedRooms.filter((room, index)=>{
            return key!==index;
        });
        this.props.onUpdate(newArray);
    }

    addRoom(){
        this.props.onUpdate([
            ...this.props.bookedRooms,
            {
                label:'',
                room_type:{},
                room:{},
                value:0,
                adults:2,
                child:0,
                price:0
            }
        ]);
    }

    handleSelectRoom(e, key){
        const newArray = this.props.bookedRooms.map((room, index)=>{
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

        this.props.onUpdate(newArray);
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

            for(x=0;x<prices.length;x++){
                if(prices[x].pricing_type === 'SEASONAL_AD' || prices[x].pricing_type === 'REGULAR_AD')
                    if(room.child === prices[x].pricing_condition.child && room.adults === prices[x].pricing_condition.adult)
                        p = prices[x]
            }
        }

        return p[0] * this.props.nights;
    }

    
    handleChangeRoomDetail(value, field, key){
        const newArray = this.props.bookedRooms.map((room, index)=>{
            if(key===index)
                room[field] = Number(value);

            if(field !== 'price')
                room.price = this.evaluatePrice(room);

            return room;
        });

        this.props.onUpdate(newArray);
    }

    getRoomInfo(room){
        let e;
        if(room.room.room_data === undefined)
            this.setState({ show_info_index:false });
        else{
            if(room.room.room_data.customized !== undefined)
                e = room.room.room_data.customized;
            else{
                e = {
                    bed_rooms:room.room_type.bed_rooms,
                    room_type_features:room.room_type.room_type_features,
                    max_adult:room.room_type.max_adult,
                    max_child:room.room_type.max_child
                }
            }

            return <RoomInfo roomType={e} hideRoomCount={true} />;
        }

    }

    render() {
        const groupedOptions = this.props.roomTypes.map((room_type)=>{
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

        return (
            <div>
                <table style={{ minWidth:  groupedOptions.length >0 ?500:"100%" }}>
                    <tbody>
                    {
                        this.props.bookedRooms.map((room, key)=>
                            <tr key={key}>
                                <td style={{ padding: 0}}>
                                    <table className="table table-hover table-bordered table-condensed" style={{marginBottom:0}}>
                                        {
                                            key === 0?
                                            <thead>
                                                <tr>
                                                    <th>Room  &nbsp; { groupedOptions.length >0 ?<button className="btn btn-sm btn-info" onClick={()=>this.addRoom()}>+</button>:null }</th>
                                                    <th>Adult</th>
                                                    <th>Child</th>
                                                    <th>Price</th>
                                                    { groupedOptions.length >0 ?<th></th>:null }
                                                </tr>
                                            </thead>:null
                                        }
                                        <tbody>
                                            <tr>
                                                <td>
                                                    { groupedOptions.length >0 ?
                                                    <Select isOptionDisabled={(option) => this.alreadyTaken(option, key)}
                                                            options={groupedOptions} value={room} onChange={(e)=> this.handleSelectRoom(e, key) }/>: <strong>{room.label}</strong>
                                                    }
                                                    {
                                                        room.value !== 0 ? 
                                                        <span>
                                                            {
                                                                this.state.show_info_index !== key?
                                                                    <small style={{ cursor:"pointer", color:"blue" }} onClick={ ()=>this.setState({show_info_index:key}) }> (Show Room Info)</small>:
                                                                    <small style={{ cursor:"pointer", color:"blue" }} onClick={ ()=>this.setState({show_info_index:false}) }> (Hide Room Info)</small>
                                                            }
                                                        </span>:null
                                                    }
                                                </td>
                                                <td style={{width:85}}>
                                                    { groupedOptions.length >0 ?<Selector _value={room.adults} selection={this.availableOccupants('adults', room)}
                                                    onChange={(e)=>this.handleChangeRoomDetail(e,'adults',key)}/>: <strong>{room.adults}</strong> }
                                                </td>
                                                <td style={{width:85}}>
                                                    { groupedOptions.length >0 ?<Selector _value={room.child} selection={this.availableOccupants('child', room)}
                                                        onChange={(e)=>this.handleChangeRoomDetail(e,'child',key)}/>: <strong>{room.child}</strong> }
                                                </td>
                                                <td style={{width:130}}>
                                                    { groupedOptions.length >0 ? <NumberFormat allowNegative={false} value={room.price} displayType={'input'} className="form-control" thousandSeparator={true} prefix={'PHP '} 
                                                        onValueChange={(e)=>this.handleChangeRoomDetail(e.value,'price',key)}/>: <strong>{room.price}</strong> }
                                                </td>
                                                { groupedOptions.length >0 ?
                                                <td style={{width:60}}>
                                                    {
                                                        (key > 0 || this.props.bookedRooms.length>1)?
                                                            <button className="btn btn-danger btn-sm" onClick={()=>this.deleteRoom(key) }>X</button>:null
                                                    }
                                                </td>:null}
                                            </tr>
                                            {
                                                this.state.show_info_index === key?
                                                    <tr>
                                                        <td colSpan="5">
                                                            { this.getRoomInfo(room) }
                                                        </td>
                                                    </tr>:null
                                            }
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default RoomSelection;