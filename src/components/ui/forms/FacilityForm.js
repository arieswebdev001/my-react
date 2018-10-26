import React, { Component } from 'react';
import Input from '../../ui/controls/Input';
import TextArea from '../controls/TextArea';
import Axios from '../../../wrappers/Axios';
import { ResourcesPath, DropZoneStyle } from '../../../config';
import Dropzone from 'react-dropzone';
import ImageGallery from 'react-image-gallery';

class FacilityForm extends Component {
    state = {
        facility:null,
        files:[]
    }

    initState(){
        this.setState(
            {
                facility:{
                    id:0,
                    facility_name: '',
                    facility_description: '',
                }
            }
        );
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
            original: ResourcesPath + '/images/facilities/' + file,
            type:'path',
            filename:file
        }]
    }

    componentDidMount(){ 
        this.props.onRef(this)

        if(this.props.defaultFacility !== null)
            if(this.props.defaultFacility.id===0)
                this.initState()
            else{
                this.setState({ facility: this.props.defaultFacility, files: this.convertFile(this.props.defaultFacility.facility_image) });
            }
    }

    componentWillReceiveProps = (nextProps) =>{
        if(nextProps.defaultFacility !== null){
            if(nextProps.defaultFacility.id===0)
                this.initState();
            else
                this.setState({ facility: nextProps.defaultFacility,  files: this.convertFile(nextProps.defaultFacility.facility_image) }); 
        }
    }

    handleChange = () => {
        this.setState({
            facility:{
                ...this.state.facility,
                facility_name: window.$("#facility_name").val(),
                facility_description: window.$("#facility_description").val(),
            }
        });
    }

    saveFacility = ()=>{
        let u = this;
        window.spinButton(document.getElementById('save-facility-button'));
        this.setState({
            facility:{
                ...this.state.facility,
                facility_images: this.state.files
            }
        }, ()=>{
            Axios[this.state.facility.id===0?'post':'put']('../../api/facility', this.state.facility)
            .then((response) => {
                u.props.savedFacility(response);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            window.toastr.error(error.response.data.message);
                }
            }).then(function(){
                window.stopButton(document.getElementById('save-facility-button'));
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
            <form className="m-form">
                {
                    this.state.facility !== null ? (
                        <div>
                            <div className="row">
                                <div className="col-md-12">
                                    <Input label="Facility Name" _id="facility_name" _value={ this.state.facility.facility_name } onChange={ ()=> this.handleChange() } />
                                    <TextArea label="Description" _id="facility_description" _value={ this.state.facility.facility_description } onChange={ ()=> this.handleChange() } />
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-md-6">
                                    <Dropzone onDrop={this.onDrop.bind(this)} accept={["image/jpeg", "image/png"]} multiple={false} style={ DropZoneStyle }>
                                        <p>Try dropping some file here, or click to select a file to upload.</p>
                                    </Dropzone>
                                </div>
                                <div className="col-md-6">
                                    { this.state.files.length>0 ? <ImageGallery  renderCustomControls={ deleteButton } items={this.state.files} showPlayButton={false} showThumbnails={false} />:''}
                                </div>
                            </div>
                        </div>
                    ):''
                }
			</form>
        );
    }
}

export default FacilityForm;