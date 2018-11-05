import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Axios from '../../wrappers/Axios';
import RoomTypeDetails from '../ui/containers/RoomTypeDetails';
import RoomTypeForm from '../ui/forms/RoomTypeForm';

class RoomsTab extends Component {
    state = {
        room_types:[],
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
    }

    getRoomTypes(){
        let u = this;
        Axios.get('api/roomTypes')
            .then(function (response) {
                u.setState({room_types:response.data});
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
                Header: "Room Type",
                accessor: "room_type_name",
                width: 280
            },
            {
                Header: "Description",
                accessor: "room_type_description"
            },
            {
                Header: "Room Count",
                accessor: "room_count",
                width: 120
            },
            {
                Header: "",
                width: 120
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
                                        { this.state.modalMode === 'view' ? <RoomTypeDetails room_type={this.state.room_type} /> : <RoomTypeForm defaultRoomType={this.state.room_type} savedRoomType={this.savedRoomType.bind(this)} onRef={ref => (this.child = ref)} /> }
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
                    data={this.state.room_types}
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
        user:state.user
    }
};

export default connect(mapStateToProps)(RoomsTab);