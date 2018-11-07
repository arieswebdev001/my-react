import React, { Component } from 'react';
import ImageGallery from "react-image-gallery";
import { ResourcesPath } from "../../../config";
import ItemRow from '../../ui/misc/ItemRow';
import { connect } from 'react-redux';
import RoomTypeForm from '../../ui/forms/RoomTypeForm';
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
                    <div className="row">
                        <div className="col-md-4">
                            <div className="m-widget13">
                                <ItemRow value={ this.props.room_type.rooms.length } label="Room Count"/> 
                                <ItemRow value={ this.props.room_type.max_adult } label="Max. Adult"/>  
                                <ItemRow value={ this.props.room_type.max_child } label="Max. Child"/>  
                            </div>
                        </div>
                        <div className="col-md-8">
                            <h5>Bed Rooms</h5>
                            <ul>
                                {
                                    this.props.room_type.bed_rooms.map((bed, key)=>{
                                        return <li key={key}>{ bed.bed_type } { bed.description !== null ? (" - " + bed.description):'' }</li>
                                    })
                                }
                            </ul>
                            <h5>Features & Other Info</h5>
                            <ol>
                                {
                                    this.props.room_type.room_type_features.map((feature, key)=>{
                                        return (
                                            <li key={key}>
                                                {feature.group_name}
                                                <ul>
                                                    {
                                                        feature.items.map((item, k)=>{
                                                            return (<li key={k}> {item} </li>)
                                                        })
                                                    }
                                                </ul>
                                            </li>
                                        )
                                    })
                                }
                            </ol>
                        </div>
                    </div>
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