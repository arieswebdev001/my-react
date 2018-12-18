import React, { Component } from 'react';
import Input from '../../ui/controls/Input';
import Select from '../../ui/controls/Select';
import Axios from '../../../wrappers/Axios';
import { ResourcesPath, DropZoneStyle } from '../../../config';
import Dropzone from 'react-dropzone';
import ImageGallery from 'react-image-gallery';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class PromoForm extends Component {
    state = {
        promo:null,
        files:[],
    }
    
    onEditorStateChange = (editorState) => {
        this.setState({
            promo:{
                ...this.state.promo,
                editorState,
                promo_description:draftToHtml(convertToRaw(editorState.getCurrentContent()))
            }
        });
    };

    initState(){
        this.setState(
            {
                promo:{
                    id:0,
                    promo_name: '',
                    promo_description: '',
                    promo_type:'Promo',
                    start_date:window.moment().format("YYYY-MM-DD"),
                    end_date:window.moment().format("YYYY-MM-DD"),
                    promo_code:'',
                    promo_data:{
                        discount:0,
                        discount_type:'percentage',
                        limit:0
                    },
                    editorState: EditorState.createEmpty(),
                },
                files:[]
            }
        );
    }

    handleChangeData(field, value){
        this.setState({
            promo:{
                ...this.state.promo,
                promo_data:{
                    ...this.state.promo.promo_data,
                    [field]:value
                }
            }
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

    removeFile = () =>{
        this.setState({ 
            files:[]
        });
    }

    handleChange(field, value){
        this.setState({
            promo:{
                ...this.state.promo,
                [field]:value
            }
        });
    }

    convertFile(file){
        if(file === "")
            return [];

        return [{
            original: ResourcesPath + '/images/promos/' + file,
            type:'path',
            filename:file
        }]
    }

    componentDidMount(){ 
        this.props.onRef(this)
        const html = ContentState.createFromBlockArray(htmlToDraft(this.props.defaultPromo.promo_description === undefined? "":this.props.defaultPromo.promo_description).contentBlocks);
        const f = {
            ...this.props.defaultPromo,
            editorState:EditorState.createWithContent(html)
        };

        if(this.props.defaultPromo !== null)
            if(this.props.defaultPromo.id===0)
                this.initState()
            else{
                this.setState({ promo: f, files: this.convertFile(this.props.defaultPromo.promo_picture) });
            }
    }

    componentWillReceiveProps = (nextProps) =>{
        const html = ContentState.createFromBlockArray(htmlToDraft(nextProps.defaultPromo.promo_description === undefined?"":nextProps.defaultPromo.promo_description).contentBlocks);
        const f = {
            ...nextProps.defaultPromo,
            editorState:EditorState.createWithContent(html)
        };

        if(nextProps.defaultPromo !== null){
            if(nextProps.defaultPromo.id===0)
                this.initState();
            else
                this.setState({ promo: f,  files: this.convertFile(nextProps.defaultPromo.promo_picture) }); 
        }
    }

    savePromo = ()=>{
        let u = this;
        window.spinButton(document.getElementById('save-promo-button'));
        this.setState({
            promo:{
                ...this.state.promo,
                promo_picture: this.state.files
            }
        }, ()=>{
            Axios[this.state.promo.id===0?'post':'put']('../../api/promo', this.state.promo)
            .then((response) => {
                u.props.savedPromo(response);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            window.toastr.error(error.response.data.message);
                }
            }).then(function(){
                window.stopButton(document.getElementById('save-promo-button'));
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
                    this.state.promo !== null ? (
                        <div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Input label="Promo Name" _value={ this.state.promo.promo_name } onChange={(e)=> this.handleChange('promo_name', e)}/>
                                </div>
                                <div className="col-md-6">
                                    <Dropzone onDrop={this.onDrop.bind(this)} accept={["image/jpeg", "image/png"]} multiple={false} style={ DropZoneStyle }>
                                        <p>Try dropping some file here, or click to select a file to upload.</p>
                                    </Dropzone>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    { this.state.files.length>0 ? <ImageGallery  renderCustomControls={ deleteButton } items={this.state.files} showPlayButton={false} 
                                            showThumbnails={false} />:''}
                                </div>
                                <div className="col-md-12">
                                    <div style={{ paddingTop:10, paddingBottom:10}}>
                                        <Editor
                                            editorState={this.state.promo.editorState}
                                            toolbarClassName="toolbarClassName"
                                            wrapperClassName="wrapperClassName"
                                            editorClassName="form-control"
                                            onEditorStateChange={this.onEditorStateChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-md-3">
                                    <Input label="Start Date" type="date" _value={ this.state.promo.start_date } onChange={(e)=> this.handleChange('start_date', e)}/>
                                </div>
                                <div className="col-md-3">
                                    <Input label="End Date" type="date" _value={ this.state.promo.end_date } onChange={(e)=> this.handleChange('end_date', e)}/>
                                </div>
                                <div className="col-md-3">
                                    <Select label="Type" selection={['Promo', 'Regular']} 
                                        _value={ this.state.promo.promo_type } onChange={ (e)=> this.handleChange('promo_type', e) } />
                                </div>
                                <div className="col-md-3">
                                    <Input label="Promo Code" _value={ this.state.promo.promo_code } disabled={this.state.promo.promo_type!=='Promo'} onChange={(e)=> this.handleChange('promo_code', e)}/>
                                </div>
                            </div>
                            {
                                this.state.promo.promo_type === 'Promo' ? 
                                <div className="row">
                                    <div className="col-md-3">
                                        <Select label="Discount Type"  selection={['total', 'percentage']} 
                                            _value={ this.state.promo.promo_data.discount_type } onChange={(e)=> this.handleChangeData('discount_type', e)}/>
                                    </div>
                                    <div className="col-md-3">
                                        <Input label="Discount" type="number" _value={ this.state.promo.promo_data.discount } onChange={(e)=> this.handleChangeData('discount', Number(e))}/>
                                    </div>
                                    <div className="col-md-3">
                                        <Input label="Limit" type="number" _value={ this.state.promo.promo_data.limit } onChange={(e)=> this.handleChangeData('limit', Number(e))}/>
                                    </div>
                                    <div className="col-md-3"></div>
                                </div>:null
                            }
                        </div>
                    ):''
                }
			</form>
        );
    }
}

export default PromoForm;