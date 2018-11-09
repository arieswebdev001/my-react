import React, { Component } from 'react';
import Input from '../controls/Input';
import TextArea from '../controls/TextArea';
import Select from '../controls/Select';
import Axios from '../../../wrappers/Axios';
import GoogleMapReact from 'google-map-react';
import { GoogleApiKey, ResourcesPath, DropZoneStyle } from '../../../config';
import Dropzone from 'react-dropzone';
import ImageGallery from 'react-image-gallery';
import TagsInput from 'react-tagsinput';

class PropertyForm extends Component {
    state = {
        property:null,
        map_draggable:true,
        files:[],
    }

    initState(){
        this.setState(
            {
                property:{
                    id:0,
                    property_name: '',
                    property_address: '',
                    property_contact_number:'',
                    property_contact_person: '',
                    property_email: '',
                    currency: '',
                    floors:[],
                    map_coordinates:{ lat:14.366575, lng:121.041958}
                },
                files:[]
            }
        );
    }

    onDrop(files) {
        files.forEach(file => {
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

    removeFile = () =>{
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

    convertFiles(files){
        return files.map((file)=>{
            return {
                original: ResourcesPath + '/images/properties/' + file,
                thumbnail: ResourcesPath + '/images/properties/' + file,
                type:'path',
                filename:file
            }
        });
    }

    componentDidMount(){ 
        this.props.onRef(this)

        if(this.props.defaultProperty !== null)
            if(this.props.defaultProperty.id===0)
                this.initState()
            else{
                this.setState({ property: this.props.defaultProperty, files: this.convertFiles(this.props.defaultProperty.property_images) });
            }
    }

    componentWillReceiveProps = (nextProps) =>{
        if(nextProps.defaultProperty !== null){
            if(nextProps.defaultProperty.id===0)
                this.initState();
            else
                this.setState({ property: nextProps.defaultProperty,  files: this.convertFiles(nextProps.defaultProperty.property_images) }); 
        }
    }

    handleChange = () => {
        this.setState({
            property:{
                ...this.state.property,
                property_name: window.$("#property_name").val(),
                property_address: window.$("#property_address").val(),
                property_contact_number: window.$("#property_contact_number").val(),
                property_contact_person: window.$("#property_contact_person").val(),
                property_email: window.$("#property_email").val(),
                currency: window.$("#currency").val(),
            }
        });
    }

    saveProperty = ()=>{
        let u = this;
        window.spinButton(document.getElementById('save-property-button'));
        this.setState({
            property:{
                ...this.state.property,
                property_images: this.state.files
            }
        }, ()=>{
            Axios[this.state.property.id===0?'post':'put']('../../api/property', this.state.property)
            .then((response) => {
                u.props.savedProperty(response);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            window.toastr.error(error.response.data.message);
                }
            }).then(function(){
                window.stopButton(document.getElementById('save-property-button'));
            });
        });
    }

    onCircleInteraction3() {
        this.setState({map_draggable: true});
    }

    onCircleInteraction(childKey, childProps, mouse) {
        this.setState({
            map_draggable: false,
            property:{
                ...this.state.property, map_coordinates:{
                    lat: mouse.lat,
                    lng: mouse.lng
                }
            }
        });
    }
    render(){
        const deleteButton = ()=>{
            return <button type="button" onClick={this.removeFile.bind(this) } className='btn btn-danger btn-sm' 
                        style={{position: 'absolute',
                                zIndex: 4,
                                opacity: 0.5}}>Delete </button>
        };

        return (
            <form className="m-form">
                {
                    this.state.property !== null ? (
                        <div>
                            <div className="row">
                                <div className="col-md-7">
                                    <Input label="Property Name" _id="property_name" _value={ this.state.property.property_name } onChange={ ()=> this.handleChange() } />
                                    <TextArea label="Property Address" _id="property_address" _value={ this.state.property.property_address } onChange={ ()=> this.handleChange() } />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Select label="Currency" _id="currency" selection={[{ label:"PHP", value:"PHP" },{  label:"USD", value:"USD" }]} 
                                                _value={ this.state.property.currency } onChange={ ()=> this.handleChange() } />
                                        </div>
                                        <div className="col-md-6">
                                            <Input label="Email" _id="property_email" _value={ this.state.property.property_email } onChange={ ()=> this.handleChange() } />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Input label="Contact No." _id="property_contact_number" _value={ this.state.property.property_contact_number } onChange={ ()=> this.handleChange() } />
                                        </div>
                                        <div className="col-md-6">
                                            <Input label="Contact Person" _id="property_contact_person" _value={ this.state.property.property_contact_person } onChange={ ()=> this.handleChange() } />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label>Floors</label>
                                            <TagsInput inputProps={{
                                                        placeholder: 'Add a floor'
                                                    }} 
                                                onlyUnique={true}
                                                value={ this.state.property.floors } 
                                                onChange={ (e)=> this.setState({ property: { ...this.state.property, floors:e }}) } 
                                            />
                                        </div>   
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label>House Keepers</label>
                                            <TagsInput inputProps={{
                                                        placeholder: 'Add a floor'
                                                    }} 
                                                onlyUnique={true}
                                                value={ this.state.property.floors } 
                                                onChange={ (e)=> this.setState({ property: { ...this.state.property, floors:e }}) } 
                                            />
                                        </div>   
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div style={{ height: '250px', width: '100%' }}>
                                        <GoogleMapReact
                                                bootstrapURLKeys={{ key: GoogleApiKey }}
                                                defaultCenter={ this.state.property.map_coordinates }
                                                defaultZoom={16}
                                                draggable={this.state.map_draggable}
                                                onChildMouseDown={ this.onCircleInteraction.bind(this) }
                                                onChildMouseUp={ this.onCircleInteraction3.bind(this) }
                                                onChildMouseMove={ this.onCircleInteraction.bind(this) }  
                                            >
                                            <img src={ ResourcesPath + "/images/app/marker.png"} alt="marker" style={{transform: 'translate(-50%, -100%)'}} lat={this.state.property.map_coordinates.lat} lng={this.state.property.map_coordinates.lng}/>
                                        </GoogleMapReact>
                                    </div>
                                    <Dropzone onDrop={this.onDrop.bind(this)} accept={["image/jpeg", "image/png"]} style={ DropZoneStyle }>
                                        <p>Try dropping some files here, or click to select files to upload.</p>
                                    </Dropzone>
                                    { this.state.files.length>0?<ImageGallery ref="child" renderCustomControls={ deleteButton } items={this.state.files} showThumbnails={false} showBullets={true} slideInterval={5000}/>:''}
                                </div>
                            </div>
                        </div>
                    ):''
                }
			</form>
        );
    }
}

export default PropertyForm;