import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '../../ui/controls/Input';
import Select from '../../ui/controls/Select';
import TextArea from '../controls/TextArea';
import Axios from '../../../wrappers/Axios';
import { ResourcesPath, DropZoneStyle } from '../../../config';
import Dropzone from 'react-dropzone';
import ImageGallery from 'react-image-gallery';

class ProfileForm extends Component {
    state = {
        profile:null,
        files:[],
        new_password:'',
    }

    onDrop(files) {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({files:
                    [{ original: reader.result, type:"raw" }]
                });
            };
            reader.readAsDataURL(file);
        });
    }

    removeFile = () =>{
        this.setState({ 
            files:[]
        });
    }

    convertFile(file){
        if(file === "")
            return [];
            
        return [{
            original: ResourcesPath + '/images/users/' + file,
            type:'path',
            filename:file
        }]
    }

    componentDidMount(){ 
        this.props.onRef(this)
        this.setState({ profile: this.props.profile, files: this.convertFile(this.props.profile.picture), new_password:'' });
    }

    componentWillReceiveProps = (nextProps) =>{
        this.setState({ profile: nextProps.profile, files: this.convertFile(nextProps.profile.picture), new_password:'' });
    }

    handleChange = () => {
        this.setState({
            profile:{
                ...this.state.profile,
                first_name: window.$("#first_name").val(),
                middle_name: window.$("#middle_name").val(),
                last_name: window.$("#last_name").val(),
                gender: window.$("#gender").val(),
                mobile: window.$("#mobile").val(),
                address: window.$("#address").val(),
                email: window.$("#email").val(),
                birth_date: window.$("#birth_date").val()
            }
        });
    }

    handleChangeLevel = ()=>{
        this.setState({
            profile:{
                ...this.state.profile,
                level: window.$("#level").val(),
            }
        });
    }

    handleChangePassword = () =>{
        this.setState({
            new_password:window.$("#new_password").val()
        });
    }

    saveProfile  = ()=>{
        let u = this;
        window.spinButton(document.getElementById('save-profile-button'));
        this.setState({
            profile:{
                ...this.state.profile,
                profile_images: this.state.files,
                new_password:this.state.new_password
            },
        }, ()=>{
            Axios[this.props.method](this.props.endpointUrl, this.state.profile)
            .then((response) => {
                u.props.savedProfile(response);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            window.toastr.error(error.response.data.message);
                }
            }).then(function(){
                window.stopButton(document.getElementById('save-profile-button'));
            });
        });
    }

    render(){
        const deleteButton = ()=>{
            return <button type="button" onClick={this.removeFile.bind(this) } className='btn btn-danger btn-sm' 
                        style={{position: 'absolute',
                                zIndex: 4,
                                opacity: 0.5}}>Delete </button>
        };

        const levels = this.props.levels.map((level)=>{
            return {
                value:level.id,
                label:level.level_name
            }
        });

        const properties = this.props.properties.map((property)=>{
            return {
                value:property.id,
                label:property.property_name
            }
        });

        return (
            this.state.profile !== null ? 
                <form className="m-form">
                    <div className="row">
                        <div className="col-md-4">
                            <Input label="First Name" _id="first_name" _value={ this.state.profile.first_name }  onChange={ ()=> this.handleChange() } />
                        </div>
                        <div className="col-md-4">
                            <Input label="Middle Name" _id="middle_name" _value={ this.state.profile.middle_name } onChange={ ()=> this.handleChange() } />
                        </div>
                        <div className="col-md-4">
                            <Input label="Last Name" _id="last_name" _value={ this.state.profile.last_name } onChange={ ()=> this.handleChange() } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-12">
                                    <TextArea label="Address" _id="address" _value={ this.state.profile.address }  onChange={ ()=> this.handleChange() } />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Input label="Mobile" _id="mobile" _value={ this.state.profile.mobile }  onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-6">
                                    <Input label="Email" _id="email" _value={ this.state.profile.email }  onChange={ ()=> this.handleChange() } />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <Select selection={[{label:"Male", value:"male"}, {label:"Female", value:"female"}]} 
                                        label="Gender" _id="gender" _value={ this.state.profile.gender }  onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-5">
                                    <Input label="Birth Date" type="date" _id="birth_date" _value={ this.state.profile.birth_date }  onChange={ ()=> this.handleChange() } />
                                </div>
                                {
                                    this.props.showLevelOption?
                                        <div className="col-md-4">
                                            <Select selection={ levels } 
                                                label="Level" _id="level" _value={ this.state.profile.level }  onChange={ ()=> this.handleChangeLevel() } />
                                        </div>:''
                                }
                            </div>
                            <div className="row">
                                {
                                    this.props.showPasswordChanger?
                                    <div className="col-md-6">
                                        <Input label="New Password" _id="new_password" _value={ this.state.new_password }  onChange={ ()=> this.handleChangePassword() } />
                                        {
                                            (this.state.new_password!=='' && this.props.profile.id !==0)?
                                                <small>Note: You're about to change this user's password.</small>:''
                                        }{
                                            (this.props.profile.id ===0)?
                                                <small>Note: Password is required for new User.</small>:''
                                        }
                                    </div>:''
                                }{
                                    this.props.showPropertyOption?
                                    <div className="col-md-6">
                                        <Select selection={ properties } 
                                                label="Default Property" _id="property_id" _value={ this.state.profile.property_id }  onChange={ ()=> this.handleChangeProperty() } />
                                    </div>:''
                                }
                            </div>
                        </div>
                        <div className="col-md-4">
                            <Dropzone onDrop={this.onDrop.bind(this)} accept={["image/jpeg", "image/png"]} multiple={false} style={ DropZoneStyle }>
                                <p>Try dropping some file here, or click to select a file to upload.</p>
                            </Dropzone>
                            <br/>
                            { this.state.files.length>0 ? <ImageGallery  renderCustomControls={ deleteButton } items={this.state.files} showPlayButton={false} showThumbnails={false} />:''}
                        </div>
                    </div>
                </form>
            :''
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        levels:state.levels,
        properties:state.properties
    }
};

export default connect(mapStateToProps)(ProfileForm);