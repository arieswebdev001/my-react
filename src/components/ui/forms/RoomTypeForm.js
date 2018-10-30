import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '../../ui/controls/Input';
import TextArea from '../controls/TextArea';
import Select from '../controls/Select';
import Axios from '../../../wrappers/Axios';
import { ResourcesPath, DropZoneStyle } from '../../../config';
import Dropzone from 'react-dropzone';
import ImageGallery from 'react-image-gallery';


class RoomTypeForm extends Component {
    state = {
        room_type:null,
        files:[]
    }

    initState(){
        this.setState(
            {
                room_type:{
                    id:0,
                    room_type_name: '',
                    room_type_description: '',
                    bed_type:'King Bed',
                    max_adult:2,
                    max_child:2
                },
                files:[],
                room_type_extras:[]
            }
        );
    }

    convertFile(files){
        return files.map((file,key)=>{
            return {
                original: ResourcesPath + '/images/properties/' + file,
                thumbnail: ResourcesPath + '/images/properties/' + file,
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
                this.setState({ room_type: this.props.defaultRoomType, files: this.convertFile(this.props.defaultRoomType.room_type_images) });
            }
    }

    componentWillReceiveProps = (nextProps) =>{
        if(nextProps.defaultRoomType !== null){
            if(nextProps.defaultRoomType.id===0)
                this.initState();
            else
                this.setState({ room_type: nextProps.defaultRoomType, files: this.convertFile(nextProps.defaultRoomType.room_type_images) });
        }
    }

    handleChange = () => {
        this.setState({
            room_type:{
                ...this.state.room_type,
                room_type_name: window.$("#room_type_name").val(),
                room_type_description: window.$("#room_type_description").val(),
                bed_type: window.$("#bed_type").val(),
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
        console.log(newList);
    }

    saveRoomType(){

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

        const bedTypes = [{ label:"Queen Bed", value:"Queen Bed" },{  label:"King Bed", value:"King Bed" },{  label:"Solo Bed", value:"Solo Bed" }]
        return (
            <form className="m-form">
                {
                    this.state.room_type !== null ? (
                        <div>
                            <div className="row">
                                <div className="col-md-3">
                                    <Input label="Room Type" _id="room_type_name" _value={ this.state.room_type.room_type_name } onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-3">
                                    <Select label="Bed Type" _id="bed_type" selection={ bedTypes } 
                                        _value={ this.state.room_type.bed_type } onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-6">
                                    <TextArea label="Description" _id="room_type_description" _value={ this.state.room_type.room_type_description } onChange={ ()=> this.handleChange() } />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <Input label="Max Adult" type="number" _id="max_adult" _value={ this.state.room_type.max_adult } onChange={ ()=> this.handleChange() } />
                                    <Input label="Max Child" type="number" _id="max_child" _value={ this.state.room_type.max_child } onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-6">

                                </div>
                                <div className="col-md-4">
                                    <Dropzone onDrop={this.onDrop.bind(this)} accept={["image/jpeg", "image/png"]} style={ DropZoneStyle }>
                                        <p>Try dropping some files here, or click to select a files to upload.</p>
                                    </Dropzone>
                                    { this.state.files.length>0 ? <ImageGallery ref="child" renderCustomControls={ customButtons } showThumbnails={false} showBullets={true} items={files} />:''}
                                </div>
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