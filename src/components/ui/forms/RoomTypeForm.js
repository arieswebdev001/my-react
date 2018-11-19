import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '../../ui/controls/Input';
import TextArea from '../controls/TextArea';
import RoomFeaturesList from './RoomFeaturesList';
import BedRoomsList from './BedRoomsList';
import Axios from '../../../wrappers/Axios';
import { ResourcesPath, DropZoneStyle } from '../../../config';
import Dropzone from 'react-dropzone';
import ImageGallery from 'react-image-gallery';

class RoomTypeForm extends Component {
    state = {
        room_type:null,
        files:[],
        room_type_features:[],
        bed_rooms:[]
    }

    initState(){
        this.setState(
            {
                room_type:{
                    id:0,
                    room_type_name: '',
                    room_type_description: '',
                    max_adult:2,
                    max_child:2,
                    pricing_schedule:[0,0,0,0,0,0,0]
                },
                files:[],
                room_type_features:[],
                bed_rooms:[]
            }
        );
    }

    convertFile(files){
        return files.map((file,key)=>{
            return {
                original: ResourcesPath + '/images/rooms/' + file,
                thumbnail: ResourcesPath + '/images/rooms/' + file,
                type:'path',
                filename:file,
            }
        });
    }

    componentDidMount(){ 
        this.props.onRef(this)

        if(this.props.defaultRoomType !== null)
            if(this.props.defaultRoomType.id===0)
                this.initState()
            else{
                this.setState({ room_type: this.props.defaultRoomType, 
                                files: this.convertFile(this.props.defaultRoomType.room_type_images),
                                room_type_features:this.props.defaultRoomType.room_type_features,
                                bed_rooms:this.props.defaultRoomType.bed_rooms
                            });
            }
    }

    componentWillReceiveProps = (nextProps) =>{
        if(nextProps.defaultRoomType !== null){
            if(nextProps.defaultRoomType.id===0)
                this.initState();
            else
                this.setState({ room_type: nextProps.defaultRoomType, 
                                files: this.convertFile(nextProps.defaultRoomType.room_type_images),
                                room_type_features:nextProps.defaultRoomType.room_type_features,
                                bed_rooms:nextProps.defaultRoomType.bed_rooms
                            });
        }
    }

    handleChange = () => {
        this.setState({
            room_type:{
                ...this.state.room_type,
                room_type_name: window.$("#room_type_name").val(),
                room_type_description: window.$("#room_type_description").val(),
                max_adult: window.$("#max_adult").val(),
                max_child: window.$("#max_child").val(),
            }
        });
    }

    onDrop(files){
        files.forEach( (file,key) => {
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({files:[
                    ...this.state.files,
                    { original: reader.result, thumbnail: reader.result, type:"raw" }
                ]});
            };
            reader.readAsDataURL(file);
        });
    }

    removeFile(){
        var index = this.refs.child.getCurrentIndex();
        if(this.state.files.length === (index+1) && this.state.files.length > 0)
            this.refs.child.slideToIndex(index-1);

        const newList = this.state.files.filter((file, i)=>{
            return  index !== i;
        });

        this.setState({ 
            files:newList
        });
    }

    
    handleEditPrice(key, value){
        const newArray = this.state.room_type.pricing_schedule.map((item,k)=> {
            if(key === k)
                item = value;

            return item;
        });

        this.setState({
            room_type:{
                ...this.state.room_type,
                pricing_schedule:newArray
            }
        });
    }


    makeAsPrimary(){
        var index = this.refs.child.getCurrentIndex();
        this.refs.child.slideToIndex(0);
        
        const newList = [this.state.files[index]];
        newList[0].description = 'Primary';

        this.state.files.forEach((file, i)=>{
            file.description = '';
            if(i !== index)
                newList.push(file);
        });

        this.setState({ 
            files:newList
        });
    }
    
    validateArrays(){
        for(var x=0;x<this.state.room_type_features.length;x++){
            if(this.state.room_type_features[x].group_name.length === 0)
                return "Group name cannot be empty";

            if(this.state.room_type_features[x].items.length === 0)
                return "Items cannot be empty";

            for(var y=0;y<this.state.room_type_features[x].items.length;y++){
                if(this.state.room_type_features[x].items[y].length === 0)
                    return "Item name cannot be empty";
            }
        }

        for(var z=0;z<this.state.bed_rooms.length;z++){
            if(this.state.bed_rooms[z].length === 0)
                return "Bedroom name cannot be empty";
        }

        if(this.state.bed_rooms.length ===0)
            return "Bedrooms cannot be empty";
    }

    saveRoomType(){

        var errors = this.validateArrays();
        if(errors){
            window.toastr.error(errors)
            return false;
        }

        let u = this;
        window.spinButton(document.getElementById('save-room-type-button'));

        this.setState({
            room_type:{
                ...this.state.room_type,
                room_type_images: this.state.files,
                room_type_features: this.state.room_type_features,
                bed_rooms: this.state.bed_rooms
            }
        }, ()=>{
            Axios[this.state.room_type.id===0?'post':'put']('../../api/roomType', this.state.room_type)
            .then((response) => {
                u.props.savedRoomType(response);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            window.toastr.error(error.response.data.message);
                }
            }).then(function(){
                window.stopButton(document.getElementById('save-room-type-button'));
            });
        });
    }

    render() {
        const files = this.state.files.map((file,key)=>{
            if(key === 0)
                file.description = 'Primary';

            return file;
        });

        const customButtons = ()=>{
            return (<span><button type="button" onClick={this.removeFile.bind(this) } className='btn btn-danger btn-sm' 
                        style={{position: 'absolute',
                                zIndex: 4,
                                opacity: 0.5}}>Delete </button>
                            <button type="button" onClick={this.makeAsPrimary.bind(this) } className='btn btn-success btn-sm' 
                                style={{position: 'absolute',
                                        zIndex: 4,
                                        opacity: 0.5,
                                        right:0}}>Mark as Primary </button>
                    </span>);
        };
        return (
            <form className="m-form">
                {
                    this.state.room_type !== null ? (
                        <div>
                            <div className="row">
                                <div className="col-lg-7">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Input label="Room Type" _id="room_type_name" _value={ this.state.room_type.room_type_name } onChange={ ()=> this.handleChange() } />
                                        </div>
                                        <div className="col-md-3">
                                            <Input label="Max Adult" type="number" _id="max_adult" _value={ this.state.room_type.max_adult } onChange={ ()=> this.handleChange() } />
                                        </div>
                                        <div className="col-md-3">
                                            <Input label="Max Child" type="number" _id="max_child" _value={ this.state.room_type.max_child } onChange={ ()=> this.handleChange() } />
                                        </div>
                                    </div>
                                    <BedRoomsList onChange={(value)=> this.setState({ bed_rooms:value }) } id={this.state.room_type.id} defaultBedRooms={this.state.bed_rooms} />
                                    <hr/>
                                    <RoomFeaturesList onChange={(value)=> this.setState({ room_type_features:value }) } id={this.state.room_type.id} defaultFeatures={this.state.room_type_features} />
                                </div>
                                <div className="col-lg-5">
                                    <TextArea label="Description" rows={7} _id="room_type_description" _value={ this.state.room_type.room_type_description } onChange={ ()=> this.handleChange() } />
                                    <Dropzone onDrop={this.onDrop.bind(this)} accept={["image/jpeg", "image/png"]} style={ DropZoneStyle }>
                                        <p>Try dropping some files here, or click to select a files to upload.</p>
                                    </Dropzone>
                                    { this.state.files.length>0 ? <ImageGallery ref="child" renderCustomControls={ customButtons } showThumbnails={false} showBullets={true} items={files} />:''}
                                </div>
                            </div>
                            {
                            this.state.room_type.id === 0 ? <h5 style={{marginTop:20}}>Regular Pricing</h5>:''
                            }
                            <div className="row">
                            {
                                this.state.room_type.id === 0 ?
                                ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((item, key)=>(
                                    <div className="col-md-2" key={key}>
                                        <Input type="number" label={item} _value={ this.state.room_type.pricing_schedule[key] } 
                                            onChange={ (e)=> this.handleEditPrice(key, e) } />
                                    </div>
                                )):''
                            }
                            </div>
                        </div>
                    ):''
                }
            </form>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

export default connect(mapStateToProps)(RoomTypeForm);