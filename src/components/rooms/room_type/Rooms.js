import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from '../../ui/controls/Select';

class Rooms extends Component {
    state = {
        modalTitle:'',
        modalVisible:false,
        floor_filter:'',
        status_filter:''
    };

    handleChange(){
        this.setState({
            floor_filter:window.$("#floor_filter").val()
        });
    }

    hasDuplicate(array, value){
        for(var x=0;x<array.length;x++){
            if(array[x].value === value)
                return true;
        }
        return false;
    }

    render() {
        const rooms = this.props.room_type.rooms;
        const floors = [{label:"All Floors", value:""}]; 

        this.props.room_type.rooms.forEach((room)=>{
            if(!this.hasDuplicate(floors, room.floor_name))
                floors.push({
                    label:room.floor_name,
                    value:room.floor_name
                }); 
        }); 

        return (
            <div>
                <div className="row">
                    <div className="col-md-8">
                        <button className="btn btn-success"> Add Room </button>
                        { rooms.length > 0 ?<button className="btn btn-primary"> House Keeping </button>:'' }
                    </div>
                    <div className="col-md-4">
                        <Select selection={floors}  _id="floor_filter" _value={ this.state.floor_filter }  onChange={ ()=> this.handleChange() } />
                    </div>
                </div>
                <div className="row">
                    {
                        rooms.map((room, key)=>{
                            return this.state.floor_filter === '' || room.floor_name === this.state.floor_filter ?(<div className="col-md-3 col-sm-4" key={key} style={{ padding:15}}>
                                        <div className="room-card" style={{ backgroundColor:"#3a63db" }}>
                                            <h3>{ room.room_no }</h3>
                                            <h5> ({ room.floor_name }) </h5>
                                            <h5>
                                                { 
                                                    room.room_status==='clean'?
                                                        <span className="badge badge-success">Status: Clean</span>:
                                                        <span className="badge badge-danger">Status: { room.room_status }</span>
                                                }
                                            </h5>
                                        </div>
                                    </div>):''
                        })
                    }
                </div>
            </div>
            
            
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        room_type:state.room_type
    }
};

export default connect(mapStateToProps, null)(Rooms);