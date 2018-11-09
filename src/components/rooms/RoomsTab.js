import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Axios from '../../wrappers/Axios';
import RoomTypeForm from '../ui/forms/RoomTypeForm';
import { ResourcesPath } from '../../config';
import { Link } from 'react-router-dom';

class RoomsTab extends Component {
    state = {
        modalTitle:'',
        room_type:null,
        modalMode:'form',
        modalVisible:false
    };

    showModal(title, data) {
        this.setState({ modalTitle:title, modalVisible:true });

        this.setState({
            room_type: data===undefined ? { id:0 }: data,
            modalMode: title==="Update Room Type" || title=== "Add Room Type"?"form":"view"
        });
        window.$("#room-type-modal").modal("show");
    }

    hideModal() {
        window.$("#room-type-modal").modal("hide");
        this.setState({ modalVisible:false });
    }

    componentDidMount(){
        this.getRoomTypes();
        this.props.updateRoomType(null);
    }

    getRoomTypes(){
        let u = this;
        Axios.get('api/roomTypes')
            .then(function (response) {
                u.props.updateRoomTypes(response.data);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    savedRoomType(response){
        window.toastr.success(response.data.message, "Saving Success");
        this.hideModal();
        this.getRoomTypes();
    }

    render() {
        const columns = [
            {
                Header: "",
                Cell: row =>(
                    <Link to={"/room-type/" + row.original.id}>
                        <img src={ ResourcesPath + "/images/rooms/" + (row.original.room_type_images.length===0?'no-photo.jpg':row.original.room_type_images[0])} width="70" alt="Room" />
                    </Link> 
                ),
                width: 80
            },
            {
                Header: "Room Type",
                Cell: row =>(
                    <Link to={"/room-type/" + row.original.id} style={{color:"#617284"}}>
                        <span>{ row.original.room_type_name }</span>
                    </Link>  
                ),
                width: 180
            },
            {
                Header: "Description",
                accessor: "room_type_description"
            },
            {
                Header: "Room Count",
                Cell: row =>(
                    row.original.rooms.length
                ),
                width: 100
            },
            {
                Header: "Max. Adult",
                accessor: "max_adult",
                width: 100
            },
            {
                Header: "Max. Child",
                accessor: "max_child",
                width: 100
            },
            {
                Header: "",
                Cell: row =>(
                    <div>
                        <Link to={"/room-type/" + row.original.id}>
                            <button className="btn btn-sm btn-info" type="button">View</button>
                        </Link>  
                    </div>
                ),
                width: 60
            },
        ];

        return (
            <div className="RoomsTab">
                <button className="btn btn-info" onClick={ () => this.showModal("Add Room Type") }>Add Room Type</button><br/><br/>

                <div className="modal fade" id="room-type-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{ this.state.modalTitle }</h5>
                            </div>
                            { 
                                this.state.modalVisible ? (
                                    <div className="modal-body">
                                        <RoomTypeForm defaultRoomType={this.state.room_type} savedRoomType={this.savedRoomType.bind(this)} onRef={ref => (this.child = ref)} /> 
                                    </div>
                                ):''
                            }
                            <div className="modal-footer">
                                {this.state.modalMode === 'form'?<button className="btn btn-sm btn-success" id="save-room-type-button" onClick={()=>this.child.saveRoomType()}> Save </button>:''}
                                <button className="btn btn-sm" onClick={ () => this.hideModal() } >Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ReactTable
                    data={this.props.room_types}
                    columns={ columns }
                    defaultPageSize={5}
                    className="-striped -highlight -bordered"
                />
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user,
        room_types:state.room_types
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        updateRoomTypes: (room_types)=>{dispatch({ type: 'UPDATE_ROOM_TYPES', payload:room_types })},
        updateRoomType: (room_type)=>{dispatch({ type: 'UPDATE_ROOM_TYPE', payload:room_type })},
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RoomsTab);