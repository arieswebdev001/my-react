import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Axios from '../../wrappers/Axios';
import { ResourcesPath } from '../../config';
import ExtraDetails from '../ui/containers/ExtraDetails';
import ExtraForm from '../ui/forms/ExtraForm';

class ExtrasTab extends Component {
    state = {
        extras:[],
        modalTitle:'',
        extra:null,
        modalMode:'form',
        modalVisible:false
    };

    getPricingType(pricing_type){
        if(pricing_type === 'per_head_per_day')
            return 'Per Head/Per Day';
        else if(pricing_type === 'per_head')
            return 'Per Head';
        else if(pricing_type === 'per_day')
            return 'Per Day';
    }

    showModal(title, data) {
        this.setState({ modalTitle:title, modalVisible:true });

        this.setState({
            extra: data===undefined ? { id:0 }: data,
            modalMode: title==="Update Extra" || title=== "Add Extra"?"form":"view"
        });
        window.$("#extras-modal").modal("show");
    }

    hideModal() {
        window.$("#extras-modal").modal("hide");
        this.setState({ modalVisible:false });
    }

    componentDidMount(){
        this.getExtras();
    }

    getExtras(){
        let u = this;
        Axios.get('api/extras')
            .then(function (response) {
                u.setState({ extras:response.data });
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }
    
    savedExtra(response){
        window.toastr.success(response.data.message, "Saving Success");
        this.hideModal();
        this.getExtras();
    }

    render() {
        const columns = [
            {
                Header: "",
                Cell: row =>(
                    <img onClick={ ()=> this.showModal(row.original.extra_name, row.original) } className="clickable" src={ ResourcesPath + "/images/extras/" + (row.original.extra_image===''?'no-photo.jpg':row.original.extra_image)} width="70" alt="Extra" />
                ),
                width: 80
            },
            {
                Header: "Name",
                Cell: row =>(
                    <span onClick={ ()=> this.showModal(row.original.extra_name, row.original) } className="clickable">{ row.original.extra_name }</span>
                ),
                width: 180
            },
            {
                Header: "Description",
                accessor: "extra_description"
            },
            {
                Header: "Type",
                accessor: "extra_type"
            },
            {
                Header: "Price",
                Cell: row =>(
                    row.original.selling_price + " (" + this.getPricingType(row.original.pricing_type) + ")"
                )
            },
            {
                Header: "",
                Cell: row =>(
                    <div>
                        <button className="btn btn-sm btn-info" onClick={ ()=> this.showModal(row.original.extra_name, row.original) }>View</button>
                        <button className="btn btn-sm btn-warning" onClick={ ()=> this.showModal("Update Extra", row.original) }>Edit</button>
                    </div>
                ),
                width: 120
            },
        ];

        return (
            <div className="ExtrasTab">
                <button className="btn btn-info" onClick={ () => this.showModal("Add Extra") }>Add Extra</button><br/><br/>

                <div className="modal fade" id="extras-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{ this.state.modalTitle }</h5>
                            </div>
                            { 
                                this.state.modalVisible ? (
                                    <div className="modal-body">
                                        { this.state.modalMode === 'view' ? <ExtraDetails extra={this.state.extra} /> : <ExtraForm defaultExtra={this.state.extra} savedExtra={this.savedExtra.bind(this)} onRef={ref => (this.child = ref)} /> }
                                    </div>
                                ):''
                            }
                            <div className="modal-footer">
                                {this.state.modalMode === 'form'?<button className="btn btn-sm btn-success" id="save-extra-button" onClick={()=>this.child.saveExtra()}> Save </button>:''}
                                <button className="btn btn-sm" onClick={ () => this.hideModal() } >Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <ReactTable
                    data={this.state.extras}
                    columns={ columns }
                    defaultPageSize={5}
                    className="-striped -highlight -bordered"
                />
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

export default connect(mapStateToProps)(ExtrasTab);