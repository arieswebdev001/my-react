import React, { Component } from 'react';
import ToolTipAlert from '../../ui/alerts/ToolTipAlert';
import ReactTable from 'react-table';
import Select from '../../ui/controls/Select';
import Input from '../../ui/controls/Input';
import Axios from '../../../wrappers/Axios';

class HouseKeeping extends Component {
    
    state = {
        loading: false,
        logs:[],
        pages:null,
        selectedRooms:[],
        selectAll:false
    }
    
    getHouseKeepingLogs(state){
        this.setState({ loading: true });
        let u = this;
        let {pageSize,page,sorted} = state;
        Axios.post('api/houseKeeping/logs', {pageSize,page,sorted, rooms: this.props.rooms.map((room)=>room.id) })
            .then(function (response) {
                u.setState({ logs: response.data.rows, pages:response.data.pages, });
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            }).then(()=>{
                u.setState({ loading: false });
            });
    }

    handleSelectAll(all){
        const selected  = !this.state.selectAll;

        this.setState({
            selectAll: selected
        });

        if(!selected)
            this.setState({ selectedRooms:[] });
        else
            this.setState({
                selectedRooms: all.map((room)=>{
                    return {...room, cleaner_name:"", notes:""};
                })
            });
    }

    markRoomsAsClean(){
        let u = this;
        window.spinButton(document.getElementById('clean-button'));
        Axios.post('../../api/houseKeeping', { rooms : this.state.selectedRooms })
        .then(() => {
            window.toastr.success("Successfully marked as clean.");
            u.props.onSave();
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
        }).then(()=>{
            window.stopButton(document.getElementById('clean-button'));
        });
    }

    isSelected(id){
        for(var x= 0; x<this.state.selectedRooms.length;x++){
            if(this.state.selectedRooms[x].id === id)
                return true;
        }

        return false;
    }

    handleSelectChange(room, checked){
        if(!checked){
            var newArray = this.state.selectedRooms.filter((r)=>{
                return r.id!==room.id;
            });
            this.setState({ selectedRooms:newArray, selectAll:false });
        }
        else
            this.setState({ 
                selectedRooms:[
                    ...this.state.selectedRooms, 
                    {...room,
                        cleaner_name:"",
                        notes:""
                    }
                ] 
            });
    }

    handleChange(id, value, field){
        const newArray = this.state.selectedRooms.map((room)=>{
            if(id === room.id)
                room[field] = value;

            return room;
        });

        this.setState({ selectedRooms:newArray });
    }

    render() {
        const dirty_rooms = this.props.rooms.filter((room)=>{
            return room.room_status === 'dirty';
        });

        const house_keepers = [{label:"Unspecified", value:""}]; 
        
        this.props.houseKeepers.forEach((person)=>{
            house_keepers.push({label:person.name, value:person.name});
        });

        return (
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#dirty-rooms">Dirty Rooms</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#logs">House Keeping Logs</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="dirty-rooms" role="tabpanel">
                        {
                            dirty_rooms.length > 0 ? 
                                <div>
                                    <ReactTable
                                        data={ dirty_rooms }
                                        defaultPageSize={5}
                                        className="-striped -highlight"
                                        columns={
                                            [
                                                {
                                                    Header: <input type="checkbox" style={{height:20,width:20}} checked={ this.state.selectAll || dirty_rooms.length === this.state.selectedRooms.length } onChange={ ()=>this.handleSelectAll(dirty_rooms) } />,
                                                    Cell: (row) => <input style={{height:20,width:20}} type="checkbox" checked={ this.isSelected(row.original.id) } onChange={ (e)=>this.handleSelectChange(row.original, e.target.checked) } />,
                                                    width:50,
                                                    sortable:false
                                                },
                                                {
                                                    Header: "Room No. ",
                                                    accessor: "room_no",
                                                    width:100
                                                },
                                                {
                                                    Header: "Floor",
                                                    accessor: "floor_name",
                                                    width:120
                                                },
                                                {
                                                    Header: "Cleaner Name",
                                                    Cell: (row)=>
                                                        (
                                                            this.isSelected(row.original.id)? 
                                                                <Select selection={ house_keepers } _value={ row.original.cleaner_name }
                                                                    onChange={ (e)=> this.handleChange(row.original.id, e.target.value, "cleaner_name") } 
                                                                />:''
                                                        )
                                                    ,
                                                    width:150
                                                },
                                                {
                                                    Header: "Notes",
                                                    Cell: (row)=> (
                                                        this.isSelected(row.original.id) ?
                                                            <Input _value={ row.original.notes  } onChange={ (e)=> this.handleChange(row.original.id, e.target.value, "notes") } />:''
                                                    )
                                                }
                                            ]
                                        }
                                    />
                                    <br/>
                                    {
                                        this.state.selectedRooms.length > 0 ? <button className="btn btn-success" onClick={ ()=>this.markRoomsAsClean() } id="clean-button">Mark As Clean</button>:''
                                    }
                                </div>: 
                                <ToolTipAlert content="All rooms are clean."/>
                        }
                    </div>
                    <div className="tab-pane" id="logs" role="tabpanel">
                        <ReactTable
                            columns={[
                                {
                                    Header: "Room No. ",
                                    accessor: "room_no"
                                },
                                {
                                    Header: "Floor",
                                    accessor: "floor_name"
                                },
                                {
                                    Header: "Cleaner Name",
                                    accessor: "cleaner_name"
                                },
                                {
                                    Header: "Notes",
                                    accessor: "notes"
                                },
                                {
                                    Header: "Date/Time",
                                    accessor: "created_at"
                                }
                            ]}
                            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                            data={this.state.logs}
                            pages={this.state.pages} // Display the total number of pages
                            loading={ this.state.loading } // Display the loading overlay when we need it
                            onFetchData={ this.getHouseKeepingLogs.bind(this) } // Request new data when things change
                            defaultPageSize={5}
                            className="-striped -highlight"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default HouseKeeping;