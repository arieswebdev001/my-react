import React, { Component } from 'react';
import Input from '../../ui/controls/Input';
import Select from '../controls/Select';
import TextArea from '../controls/TextArea';
import Toggle from 'react-toggle';
import { InputOptions } from '../../../config';
import RoomInfo from '../containers/RoomInfo';
import RoomFeaturesList from './RoomFeaturesList';
import BedRoomsList from './BedRoomsList';
import Axios from '../../../wrappers/Axios';


class RoomForm extends Component {
    state = {
        room:{
            room_no:'',
            room_notes:'',
            floor_name:'Ground Floor',
            room_type_id:this.props.roomType,
            room_status:'Clean',
            room_data:{}
        }
    }
    
    handleChange(){
        this.setState({
            room:{
                ...this.state.room,
                room_no:window.$("#room_no").val(),
                room_notes:window.$("#room_notes").val(),
                floor_name:window.$("#floor_name").val(),
                room_status:window.$("#room_status").val()
            }
        });
    }

    componentDidMount(){ 
        this.props.onRef(this)

        if(this.props.defaultRoom !== null)
            if(this.props.defaultRoom.id===0)
                this.initState()
            else{
                this.setState({ room: this.props.defaultRoom });
            }
    }

    componentWillReceiveProps = (nextProps) =>{
        if(nextProps.defaultRoom !== null){
            if(nextProps.defaultRoom.id===0)
                this.initState();
            else
                this.setState({ room: nextProps.defaultRoom }); 
        }
    }

    initState(){
        this.setState(
            {
                room:{
                    room_no:'',
                    room_notes:'',
                    floor_name:'Ground Floor',
                    room_type_id:this.props.roomType,
                    room_status:'Clean',
                    room_data:{}
                }
            }
        );
    }

    handleToggle(event){
        this.setState({
            room:{
                ...this.state.room,
                room_data: event.target.checked? 
                    {
                        customized:{
                            bed_rooms:this.props.roomType.bed_rooms,
                            room_type_features:this.props.roomType.room_type_features,
                            max_adult:this.props.roomType.max_adult,
                            max_child:this.props.roomType.max_child
                        }
                    }:{}
            }
        });
    }

    handleChangeCuztomized(value, field){
        this.setState({
            room:{
                ...this.state.room,
                room_data:{
                    customized:{
                        ...this.state.room.room_data.customized,
                        [field]: (field==='max_child'|| field==='max_adult'? Number(value):value)
                    }
                }
            }
        });
    }

    saveRoom(){
        let u = this;
        window.spinButton(document.getElementById('save-room-button'));
        Axios.put('../../api/rooms', this.state.room  )
        .then((response) => {
            u.props.savedRoom(response);
        }).catch(function (error) {
            console.log(error);
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
        }).then(function(){
            window.stopButton(document.getElementById('save-room-button'));
        });
    }

    render(){
        const floors = (this.props.roomType.property.floors !== undefined ? this.props.roomType.property.floors:["Ground Floor"]).map((floor)=>{
            return {
                label:floor,
                value:floor
            }
        });

        const room_states = [
            {label:"Clean", value:"Clean"},
            {label:"Dirty", value:"Dirty"},
            {label:"Unavailable", value:"Unavailable"}
        ];

        const customized = this.state.room.room_data.customized !== undefined;

        return ( 
            <form className="m-form">
                <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <Input label="Room No." _id="room_no" _value={ this.state.room.room_no } onChange={ ()=> this.handleChange() } />
                            </div>
                            <div className="col-md-6">
                                <Select selection={ floors } _id="floor_name" _value={ this.state.room.floor_name } label="Floor" onChange={ ()=> this.handleChange() } />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <TextArea label="Notes" _id="room_notes" _value={ this.state.room.room_notes } onChange={ ()=> this.handleChange() } />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Select selection={ room_states } _id="room_status" _value={ this.state.room.room_status } label="Status" onChange={ ()=> this.handleChange() } />
                            </div>
                            <div className="col-md-6">
                                <div className={InputOptions.containerClass}>
                                    <label>Customized</label>
                                    <br/>
                                    <Toggle
                                        checked={ customized }
                                        onChange={ (e)=> this.handleToggle(e) } 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        {
                            !customized? <RoomInfo roomType={ this.props.roomType } hideRoomCount={true} /> :
                            (<div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Input type="number" label="Max. Adult"_value={ this.state.room.room_data.customized.max_adult }
                                            onChange={ (e)=> this.handleChangeCuztomized(e.target.value, "max_adult") } />
                                    </div>
                                    <div className="col-md-6">
                                        <Input type="number" label="Max. Child"_value={ this.state.room.room_data.customized.max_child }
                                            onChange={ (e)=> this.handleChangeCuztomized(e.target.value, "max_child") } />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <BedRoomsList onChange={(value)=> this.handleChangeCuztomized(value, "bed_rooms")} 
                                            id={this.props.roomType.id} defaultBedRooms={this.state.room.room_data.customized.bed_rooms} />
                                        <hr/>
                                        <RoomFeaturesList onChange={(value)=> this.handleChangeCuztomized(value, "room_type_features") } 
                                            id={this.props.roomType.id} defaultFeatures={this.state.room.room_data.customized.room_type_features} />
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
            </form>
        );
    }
}

export default RoomForm;