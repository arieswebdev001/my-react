import React, { Component } from 'react';
import ToolTipAlert from '../../ui/alerts/ToolTipAlert';
import Axios from '../../../wrappers/Axios';
import TextArea from '../../ui/controls/TextArea';
import Select from '../../ui/controls/Select';
import MultiSelect from "@kenshooui/react-multi-select";
import ReactTable from 'react-table';
import { DateRange } from 'react-date-range';

class Restrictions extends Component {
    componentDidMount(){
        this.getUnavailableRooms();
    }

    getUnavailableRooms(){
        let u = this;
        Axios.get('api/unavailable' + (this.props.roomType !== undefined? '/' + this.props.roomType.id:''))
            .then(function (response) {
                u.setState({ unavailable_rooms: response.data });
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            }).then(()=>{
                u.setState({ loading: false });
            });
    }

    handleRangeChange(which, payload) {
        this.setState({
            [which]: {
            ...this.state[which],
            ...payload,
            },
            unavailability:{
                ...this.state.unavailability,
                start_date:window.moment(payload.selection.startDate).format("YYYY-MM-DD"),
                end_date:window.moment(payload.selection.endDate).format("YYYY-MM-DD")
            }
        });
    }

    state = {
        unavailable_rooms:[],
        view_mode:'view',
        unavailability:{
            id:0,
            start_date:window.moment().format("YYYY-MM-DD"),
            end_date:window.moment().format("YYYY-MM-DD"),
            room_ids:[],
            notes:'',
            unavailability_type:'all',
            room_type_id:this.props.roomType.id
        },
        dateRange: {
            selection: {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
            },
        },
    }

    addRestriction(){
        this.setState({ view_mode:'form' });
        this.setState({
            unavailability:{
                id:0,
                start_date:window.moment().format("YYYY-MM-DD"),
                end_date:window.moment().format("YYYY-MM-DD"),
                room_ids:[],
                notes:'',
                unavailability_type:'all',
                room_type_id:this.props.roomType.id
            },
            dateRange: {
                selection: {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection',
                },
            }
        });
    }

    handleChangeRoom(items){
        this.setState({ unavailability:{
            ...this.state.unavailability,
            room_ids:items
        } });
    }

    handleChange(){
        this.setState({
            unavailability:{
                ...this.state.unavailability,
                start_date: window.$("#start_date").val(),
                end_date: window.$("#end_date").val(),
                notes: window.$("#notes").val(),
                unavailability_type: window.$("#unavailability_type").val(),
            }
        });
    }
    
    saveRestriction(){
        window.spinButton(document.getElementById('save-unavailability-button'));
        Axios[this.state.unavailability.id===0?'post':'put']('../../api/unavailable', this.state.unavailability )
        .then(() => {
            window.toastr.success("Successfully saved.");
            this.setState({ view_mode:'view' });
            this.getUnavailableRooms();
            this.props.onSave();
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
            
            window.stopButton(document.getElementById('save-unavailability-button'));
        });
    }

    deleteRestriction(data){
        if(!window.confirm("Are you sure you want to delete this restriction?"))
            return false;

        Axios.delete('../../api/unavailable/' + data.id )
        .then(() => {
            window.toastr.success("Successfully deleted.");
            this.setState({ view_mode:'view' });
            this.getUnavailableRooms();
            this.props.onSave();
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

    editRestriction(data){
        this.setState({
            view_mode:'form',
            unavailability:{
                id:data.id,
                start_date:data.start_date,
                end_date:data.end_date,
                room_ids:data.room_ids,
                notes:data.notes,
                unavailability_type:data.unavailability_type,
                room_type_id:data.room_type_id
            },
            dateRange: {
                selection: {
                    startDate: new Date(data.start_date),
                    endDate: new Date(data.end_date),
                    key: 'selection',
                },
            },
        });
    }

    render() {
        const items = this.props.roomType.rooms.map((room)=>(
            {id:room.id, label:room.room_no}
        ));

        const columns = [
            {
                Header: "Start Date",
                accessor: "start_date",
                width: 100
            },
            {
                Header: "End Date",
                accessor: "end_date",
                width: 100
            },
            {
                Header: "Rooms",
                Cell:row =>  (
                    row.original.room_ids.map(room=>room.label).join(', ')
                )
            },
            {
                Header: "Type",
                accessor: "unavailability_type",
                width: 120
            },
            {
                Header: "Notes",
                accessor: "notes"
            },
            {
                Header: '',
                Cell: (row) => (
                    <div>
                        <button className="btn btn-sm btn-warning" onClick={ ()=>this.editRestriction(row.original) }>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={ ()=>this.deleteRestriction(row.original) }>Delete</button>
                    </div>
                ),
                width: 120
            }
        ];

        const types = [
            {label:"All", value:"all"},
            {label:"Website Booking", value:"website"},
            {label:"Member Booking", value:"member"},
            {label:"Website and Member", value:"website_member"}
        ];

        return (
            <div className="row">
            {
                this.state.view_mode === 'view'? 
                <div className="col-md-12">
                    <button className="btn btn-info" onClick={()=> this.addRestriction() }>Add Restriction</button><br/><br/>
                    {
                        this.state.unavailable_rooms.length > 0 ? 
                            <ReactTable
                                data={this.state.unavailable_rooms}
                                columns={ columns }
                                defaultPageSize={5}
                                className="-striped -highlight -bordered"
                            />:
                            <ToolTipAlert content="All rooms are available for booking."/>
                    }
                </div>:
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-lg-9">
                            <div className="row">
                                <div className="col-lg-7">
                                    <DateRange 
                                        onChange={this.handleRangeChange.bind(this, 'dateRange')}
                                        moveRangeOnFirstSelection={false}
                                        ranges={[this.state.dateRange.selection]}
                                        className={'PreviewArea'}
                                    />
                                </div>
                                <div className="col-lg-5">
                                    <Select selection={ types } label="Block Bookings From" _id="unavailability_type" _value={ this.state.unavailability.unavailability_type }  
                                        onChange={ ()=> this.handleChange() } />
                                    <TextArea label="Reason for Unavailability" _value={ this.state.unavailability.notes } _id="notes" onChange={ ()=> this.handleChange() }/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <label>Selected Rooms</label>
                            <MultiSelect
                                items={items}
                                selectedItems={this.state.unavailability.room_ids}
                                onChange={(e)=>this.handleChangeRoom(e)}
                                showSelectedItems={false}
                                height={200}
                            />
                        </div>
                    </div> 
                    <button className="btn btn-warning" onClick={()=> this.setState({ view_mode:'view' }) }>Cancel</button>
                    <button className="btn btn-success" onClick={()=>this.saveRestriction() } id="save-unavailability-button">Save</button>
                </div>
            }
                
            </div>
        );
    }
}

export default Restrictions;