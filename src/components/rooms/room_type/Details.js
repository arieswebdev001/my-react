import React, { Component } from 'react';
import ImageGallery from "react-image-gallery";
import { ResourcesPath } from "../../../config";
import { connect } from 'react-redux';
import RoomTypeForm from '../../ui/forms/RoomTypeForm';
import RoomInfo from '../../ui/containers/RoomInfo';
class Details extends Component {
    state = {
        modalTitle:'',
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

    savedRoomType(response){
        this.hideModal();
        window.toastr.success(response.data.message);
        this.props.onUpdate();
    }

    render() {
        const images = this.props.room_type.room_type_images.map((file)=>{
            return {
                original: ResourcesPath + '/images/rooms/' + file,
                thumbnail: ResourcesPath + '/images/rooms/' + file
            }
        });
        return (
            <div className="row">
                <div className="col-md-5">
                    <ImageGallery items={images} autoPlay={false} showThumbnails={true} slideInterval={5000} showNav={false}/>
                    <br/>
                    <button className="btn btn-info btn-block" onClick={ () => this.showModal("Update Room Type") }>Update Room Type</button>
                    <div className="modal fade" id="room-type-modal" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{ this.state.modalTitle }</h5>
                                </div>
                                { 
                                    this.state.modalVisible ? (
                                        <div className="modal-body">
                                            <RoomTypeForm defaultRoomType={this.props.room_type} savedRoomType={this.savedRoomType.bind(this)} onRef={ref => (this.child = ref)} />
                                        </div>
                                    ):''
                                }
                                <div className="modal-footer">
                                    <button className="btn btn-sm btn-success" id="save-room-type-button" onClick={()=>this.child.saveRoomType()}> Save </button>
                                    <button className="btn btn-sm" onClick={ () => this.hideModal() } >Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <h3>{this.props.room_type.room_type_name}</h3>
                    <p>{this.props.room_type.room_type_description}</p>
                    <hr/>
                    <RoomInfo roomType={this.props.room_type} />
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

export default connect(mapStateToProps, null)(Details);