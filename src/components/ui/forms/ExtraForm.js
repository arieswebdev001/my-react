import React, { Component } from 'react';
import Input from '../../ui/controls/Input';
import TextArea from '../controls/TextArea';
import Select from '../controls/Select';
import Axios from '../../../wrappers/Axios';
import { ResourcesPath, DropZoneStyle, InputOptions } from '../../../config';
import Dropzone from 'react-dropzone';
import ImageGallery from 'react-image-gallery';
import Toggle from 'react-toggle';

class ExtraForm extends Component {
    state = {
        extra:null,
        files:[]
    }

    removeFile = () =>{
        this.setState({ 
            files:[]
        });
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

    convertFile(file){
        if(file === "")
            return [];

        return [{
            original: ResourcesPath + '/images/extras/' + file,
            type:'path',
            filename:file
        }]
    }

    componentDidMount(){ 
        this.props.onRef(this)

        if(this.props.defaultExtra !== null)
            if(this.props.defaultExtra.id===0)
                this.initState()
            else{
                this.setState({ extra: this.props.defaultExtra, files: this.convertFile(this.props.defaultExtra.extra_image) });
            }
    }

    componentWillReceiveProps = (nextProps) =>{
        if(nextProps.defaultExtra !== null){
            if(nextProps.defaultExtra.id===0)
                this.initState();
            else
                this.setState({ extra: nextProps.defaultExtra,  files: this.convertFile(nextProps.defaultExtra.extra_image) }); 
        }
    }

    saveExtra(){
        let u = this;
        window.spinButton(document.getElementById('save-extra-button'));
        this.setState({
            extra:{
                ...this.state.extra,
                extra_images: this.state.files
            }
        }, ()=>{
            Axios[this.state.extra.id===0?'post':'put']('../../api/extra', this.state.extra)
            .then((response) => {
                u.props.savedExtra(response);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            window.toastr.error(error.response.data.message);
                }
            }).then(function(){
                window.stopButton(document.getElementById('save-extra-button'));
            });
        });
    }

    handleChange(){
        this.setState({
            extra:{
                ...this.state.extra,
                extra_name: window.$("#extra_name").val(),
                extra_description: window.$("#extra_description").val(),
                extra_type: window.$("#extra_type").val(),
                pricing_type: window.$("#pricing_type").val(),
                unit_price: window.$("#unit_price").val(),
                selling_price: window.$("#selling_price").val()
            }
        });
    }
    
    initState(){
        this.setState(
            {
                extra:{
                    id:0,
                    extra_name: '',
                    extra_description: '',
                    with_vat:0,
                    is_active:1,
                    unit_price:100,
                    selling_price:120,
                    extra_type:'goods',
                    pricing_type:'per_head'
                },
                files:[]
            }
        );
    }

    render() {
        const deleteButton = ()=>{
            return <button type="button" onClick={this.removeFile.bind(this) } className='btn btn-danger btn-sm' 
                        style={{position: 'absolute',
                                zIndex: 4,
                                opacity: 0.5}}>Delete </button>
        };

        const types = [{ label:"Goods", value:"goods" },{  label:"Services", value:"services" }];
        const pricing_types = ["Per Head","Per Day","Per Head/Day","Per Booking"];
        return ( 
            <form className="m-form">
                {
                    this.state.extra !== null ? (
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-5">
                                    <Input label="Add-on Name" _id="extra_name" _value={ this.state.extra.extra_name } onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-7">
                                    <TextArea label="Description" _id="extra_description" _value={ this.state.extra.extra_description } onChange={ ()=> this.handleChange() } />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <Select label="Type" _id="extra_type" selection={ types } 
                                        _value={ this.state.extra.extra_type } onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-4">
                                    <Input label="Unit Price" type="number" _id="unit_price" _value={ this.state.extra.unit_price } onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-4">
                                    <Input label="Selling Price" type="number" _id="selling_price" _value={ this.state.extra.selling_price } onChange={ ()=> this.handleChange() } />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Select label="Pricing Type" _id="pricing_type" selection={ pricing_types } 
                                        _value={ this.state.extra.pricing_type } onChange={ ()=> this.handleChange() } />
                                </div>
                                <div className="col-md-3">
                                    <div className={InputOptions.containerClass}>
                                        <label>With Vat</label>
                                        <br/>
                                        <Toggle
                                            checked={this.state.extra.with_vat===1}
                                            onChange={ (e)=> this.setState({ extra:{ ...this.state.extra, with_vat: e.target.checked?1:0 } })} 
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className={InputOptions.containerClass}>
                                        <label>Active</label>
                                        <br/>
                                        <Toggle
                                            checked={this.state.extra.is_active===1}
                                            onChange={ (e)=> this.setState({ extra:{ ...this.state.extra, is_active: e.target.checked?1:0 } })} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <Dropzone onDrop={this.onDrop.bind(this)} accept={["image/jpeg", "image/png"]} multiple={false} style={ DropZoneStyle }>
                                <p>Try dropping some file here, or click to select a file to upload.</p>
                            </Dropzone>
                            { this.state.files.length>0 ? <ImageGallery  renderCustomControls={ deleteButton } items={this.state.files} showPlayButton={false} showThumbnails={false} />:''}
                        </div>
                    </div>
                    ):''
                }
            </form>
        );
    }
}

export default ExtraForm;