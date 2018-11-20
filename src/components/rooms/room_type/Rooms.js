import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from '../../ui/controls/Select';
import ReactTable from 'react-table';
import RoomsAddForm from '../../ui/forms/RoomsAddForm';
import RoomForm from '../../ui/forms/RoomForm';
import RoomDetails from '../../ui/containers/RoomDetails';
import Axios from '../../../wrappers/Axios';
import ToolTipAlert from '../../ui/alerts/ToolTipAlert';
import RoomCard from '../../ui/misc/RoomCard';
import HouseKeeping from './HouseKeeping';
import Restrictions from './Restrictions';
class Rooms extends Component {
    state = {
        addModal:{
            modalVisible:false
        },
        lgModal:{
            modalTitle:'',
            modalVisible:false,
            modalMode: "view"
        },
        floor_filter:'',
        status_filter:'',
        room:null,
    };

    deleteRoom(){
        if(!window.confirm("Are you sure you want to delete this room?")){
            return false;
        }

        window.spinButton(document.getElementById('delete-room-button'));
        Axios.delete('../../api/room/' + this.state.room.id)
        .then((response) => {
            this.props.onSave();
            window.toastr.success(response.data.message);
            this.hideLgModal();
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
        }).then(function(){
            window.stopButton(document.getElementById('delete-room-button'));
        });
    }

    showAddModal() {
        this.setState({ addModal: { modalVisible:true }});

        this.setState({
            room: { id:0, room_data:{} }
        });
        window.$("#add-room-modal").modal("show");
    }

    hideAddModal() {
        window.$("#add-room-modal").modal("hide");
        this.setState({ addModal:{...this.state.addModal, modalVisible:false} });
    }

    handleChange(){
        this.setState({
            floor_filter:window.$("#floor_filter").val(),
            status_filter:window.$("#status_filter").val()
        });
    }

    hasDuplicate(array, value){
        for(var x=0;x<array.length;x++){
            if(array[x].value === value)
                return true;
        }
        return false;
    }

    hideLgModal() {
        window.$("#room-modal").modal("hide");
        this.setState({ lgModal:{...this.state.lgModal, modalVisible:false} });
    }

    showLgModal(title, data, mode) {
        this.setState({ lgModal: { modalTitle:title, modalVisible:true, modalMode: mode }});

        this.setState({
            room: data
        });

        window.$("#room-modal").modal("show");
    }

    savedRooms(response){
        window.toastr.success(response.data.message, "Saving Success");
        this.hideAddModal();
        this.props.onSave();
    }

    savedRoom(response){
        window.toastr.success(response.data.message, "Saving Success");
        this.hideLgModal();
        this.props.onSave();
    }

    render() {
        const rooms = this.props.room_type.rooms;
        const floors = [{label:"All Floors", value:""}]; 
        const statuses = [{label:"All Status", value:""}, {label:"Clean", value:"Clean"}, {label:"Dirty", value:"Dirty"}, {label:"Unavailable", value:"Unavailable"}]; 
        const house_keepers = this.props.room_type.property.property_data.house_keepers;

        this.props.room_type.rooms.forEach((room)=>{
            if(!this.hasDuplicate(floors, room.floor_name))
                floors.push({
                    label:room.floor_name,
                    value:room.floor_name
                }); 
        }); 

        const filtered_rooms = rooms.filter((room)=>{
            return (this.state.floor_filter === '' || room.floor_name === this.state.floor_filter) && (this.state.status_filter === '' || room.room_status === this.state.status_filter);
        });

        const columns = [
            {
                Header: "Room No.",
                Cell: row =>(
                    <span onClick={ ()=> this.showLgModal(row.original.room_no, row.original, "view") } className="clickable">{ row.original.room_no }</span>
                ),
                width: 120
            },
            {
                Header: "Notes",
                accessor: "room_notes"
            },
            {
                Header: "Floor",
                accessor: "floor_name",
                width:120
            },
            {
                Header: "Status",
                Cell: row =>(
                    <div>{ 
                            row.original.room_status==='Clean'?
                                <span className="badge badge-success">Clean</span>:
                                <span className="badge badge-danger">{ row.original.room_status }</span>
                        }
                    </div>),
                width: 80
            },
            {
                Header: "Customized",
                Cell: row => row.original.room_data.customized !== undefined? <span className="badge badge-success">Yes</span>: <span className="badge badge-danger">No</span> ,
                width: 120
            },
            {
                Header: "",
                Cell: row =><button className="btn btn-sm btn-info" onClick={ ()=> this.showLgModal(row.original.room_no, row.original, "view") }>View</button>,
                width: 60
            },
        ];

        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-success" onClick={ () => this.showAddModal("Add Rooms") }> Add Rooms </button>
                        { rooms.length > 0 ?<button className="btn btn-primary" onClick={ ()=> window.$("#house-keeping-modal").modal("show") }> House Keeping </button>:'' }
                        { rooms.length > 0 ?<button className="btn btn-warning" onClick={ ()=> window.$("#restrictions-modal").modal("show") }> Restrictions </button>:'' }

                        <div className="modal fade" id="add-room-modal" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            Add Rooms &nbsp; 
                                            <button className="btn btn-info btn-sm" onClick={()=>this.child.addRoom()}>+</button>
                                        </h5>
                                    </div>
                                    <div className="modal-body">
                                        <RoomsAddForm onRef={ref => (this.child = ref)} savedRooms={this.savedRooms.bind(this)} roomType={this.props.room_type}  />
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-sm btn-success" id="save-rooms-button" onClick={()=>this.child.saveRooms()}> Save </button>
                                        <button className="btn btn-sm" onClick={ () => this.hideAddModal() } >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="room-modal" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{ this.state.lgModal.modalTitle }</h5>
                                    </div>
                                    <div className="modal-body">
                                        {
                                            this.state.room !== null ? (
                                                this.state.lgModal.modalMode === 'view'? 
                                                    <RoomDetails room={this.state.room} roomType={this.props.room_type}/>:
                                                    <RoomForm savedRoom={this.savedRoom.bind(this)} onRef={ref => (this.child2 = ref)} roomType={this.props.room_type} defaultRoom={this.state.room} />
                                            ):''
                                        }
                                    </div>
                                    <div className="modal-footer">
                                        { this.state.lgModal.modalMode === 'view'?
                                            <span>
                                                <button className="btn btn-sm btn-danger" id="delete-room-button" onClick={()=>this.deleteRoom()}>Delete Room</button>
                                                <button className="btn btn-sm btn-info"
                                                    onClick={()=> this.setState({lgModal:{...this.state.lgModal, modalMode:"form" }}) }>Edit Room</button>
                                                    
                                                <button className="btn btn-sm" onClick={ () => this.hideLgModal() } >Close</button>
                                            </span>
                                            :
                                            <span>
                                                <button className="btn btn-sm btn-success" id="save-room-button" onClick={()=>this.child2.saveRoom()}> Save </button>
                                                <button className="btn btn-sm btn-warning"
                                                    onClick={()=> this.setState({lgModal:{...this.state.lgModal, modalMode:"view" }}) }>Cancel</button>
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="house-keeping-modal" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"> House Keeping </h5>
                                    </div>
                                    <div className="modal-body">
                                        <HouseKeeping rooms={rooms} houseKeepers={ house_keepers } onSave={()=>this.props.onSave()} />
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-sm" onClick={ ()=> window.$("#house-keeping-modal").modal("hide") }>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="restrictions-modal" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"> Booking Restrictions </h5>
                                    </div>
                                    <div className="modal-body">
                                        <Restrictions roomType={ this.props.room_type } onSave={()=>this.props.onSave()} />
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-sm" onClick={ ()=> window.$("#restrictions-modal").modal("hide") }>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <Select selection={[{label:"Grid View",value:"grid"}, {label:"Table View",value:"table"}]} _id="view_selector" _value={ this.props.rooms_list_view }  
                            onChange={ (event)=> this.props.updateRoomsListView(event) } />
                    </div>
                    <div className="col-md-2">
                        <Select selection={floors} _id="floor_filter" _value={ this.state.floor_filter }  onChange={ ()=> this.handleChange() } />
                    </div>
                    <div className="col-md-2">
                        <Select selection={statuses} _id="status_filter" _value={ this.state.status_filter }  onChange={ ()=> this.handleChange() } />
                    </div>
                </div>
                <div className="row">
                    {
                    filtered_rooms.length > 0 ? 
                        (this.props.rooms_list_view === 'grid'?
                            filtered_rooms.map((room, key)=>{
                                return  ( <div className="col-md-3 col-sm-4" key={key} style={{ padding:15}}>
                                                <RoomCard room={room} onClick={()=>this.showLgModal(room.room_no, room, "view")}/>
                                            </div>)
                            }):
                            <div className="col-md-12">
                                <ReactTable
                                    data={ filtered_rooms }
                                    columns={ columns }
                                    defaultPageSize={5}
                                    className="-striped -highlight -bordered"
                                />
                            </div>
                        ):
                        <div className="col-md-12">
                            <ToolTipAlert content="No rooms found"/>
                        </div>
                    }
                </div>
            </div>
            
            
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        room_type:state.room_type,
        rooms_list_view:state.rooms_list_view
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateRoomsListView: (view)=>{dispatch({ type: 'UPDATE_ROOMS_LIST_VIEW', payload:view })},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);