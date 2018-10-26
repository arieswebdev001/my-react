import React, { Component } from 'react';
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
        files:[]
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
        this.setState({ profile: this.props.profile, files: this.convertFile(this.props.profile.picture) });
    }

    componentWillReceiveProps = (nextProps) =>{
        this.setState({ profile: nextProps.profile, files: this.convertFile(nextProps.profile.picture) });
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
                birth_date: window.$("#birth_date").val(),
            }
        });
    }

    saveProfile  = ()=>{
        let u = this;
        window.spinButton(document.getElementById('save-profile-button'));
        this.setState({
            profile:{
                ...this.state.profile,
                profile_images: this.state.files
            }
        }, ()=>{
            Axios.put('../../api/profile', this.state.profile)
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
                                <div className="col-md-4">
                                    <Select selection={[{label:"Male", value:"male"}, {label:"Female", value:"female"}]} 
                                        label="Gender" _id="gender" _value={ this.state.profile.gender }  onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-6">
                                    <Input label="Birth Date" type="date" _id="birth_date" _value={ this.state.profile.birth_date }  onChange={ ()=> this.handleChange() } />
                                </div>
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

export default ProfileForm;