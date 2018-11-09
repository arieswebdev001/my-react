import React, { Component } from 'react';
import Select from '../controls/Select';
import Axios from '../../../wrappers/Axios';

class RoomsAddForm extends Component {
    state = {
        rooms:[],
    }

    componentDidMount(){ 
        this.props.onRef(this)
    }

    saveRooms(){
        let u = this;
        window.spinButton(document.getElementById('save-rooms-button'));
        Axios.post('../../api/rooms', this.state)
        .then((response) => {
            u.props.savedRooms(response);
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
        }).then(function(){
            window.stopButton(document.getElementById('save-rooms-button'));
        });
    }

    handleChange(field, event, key){
        const newArray = this.state.rooms.map((item, index)=>{
            if(index === key)
                item[field] = event.target.value;

            return item;
        });
        this.setState({rooms:newArray});
    }

    addRoom(){
        this.setState({
            rooms:[
                ...this.state.rooms,
                {
                    room_no:"",
                    room_notes:"",
                    floor_name:"Ground Floor",
                    room_type_id:this.props.roomType.id
                }
            ]
        });
    }

    removeRoom(index){
        const newArray = this.state.rooms.filter((room, i)=>{
            return i!==index;
        });

        this.setState({
            rooms:newArray
        });
    }

    render() {
        const floors = (this.props.roomType.property.floors !== undefined ? this.props.roomType.property.floors:["Ground Floor"]).map((floor)=>{
            return {
                label:floor,
                value:floor
            }
        });

        return ( 
            <table className="table table-bordered table-condensed">
                <thead>
                    <tr>
                        <th style={{width:180}}>Room No.</th>
                        <th>Notes</th>
                        <th style={{width:180}}>Floor</th>
                        <th style={{width:30}}></th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.rooms.map((room, key)=>{
                        return (<tr key={key}>
                                    <td>
                                        <input type="text" value={room.room_no} onChange={ (event)=> this.handleChange("room_no", event, key) } className="form-control" />
                                    </td>
                                    <td>
                                        <input type="text" className="form-control" onChange={ (event)=> this.handleChange("room_notes", event, key) } value={room.notes} />
                                    </td>
                                    <td>
                                        <Select selection={ floors } _value={ room.floor_name } 
                                            onChange={ (event)=> this.handleChange("floor_name", event, key) } />
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={()=>this.removeRoom(key) }>X</button>
                                    </td>
                                </tr>);
                    })
                }
                </tbody>
            </table>
        );
    }
}

export default RoomsAddForm;