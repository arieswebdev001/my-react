import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from '../../wrappers/Axios';
import ReactTable from 'react-table';
import PropertyDetails from '../ui/containers/PropertyDetails';
import PropertyForm from '../ui/forms/PropertyForm';
import { ResourcesPath } from '../../config';

class PropertiesTab extends Component {
    showModal(title, data) {
        this.setState({ modalTitle:title, modalVisible:true });

        this.setState({
            property: data===undefined ? { id:0 }: data,
            modalMode: title==="Update Property" || title=== "Add Property"?"form":"view"
        });
        window.$("#property-modal").modal("show");
    }

    hideModal() {
        window.$("#property-modal").modal("hide");
        this.setState({ modalVisible:false });
    }

    state = {
        properties:[],
        modalVisible:false,
        modalTitle:'Add Property',
        modalMode:"form",
        property:null
    };

    getProperties = () =>{
        let u = this;
        Axios.get('api/properties')
            .then(function (response) {
                u.setState({properties:response.data});
            });
    }

    savedProperty = (response)=>{
        window.toastr.success(response.data.message, "Saving Success");
        this.hideModal();
        this.getProperties();
    }

    componentDidMount(){
        this.getProperties();
    }

    render() {
        const columns = [
            {
                Header: "",
                Cell: row =>(
                    <img src={ ResourcesPath + "/images/properties/" + (row.original.property_images[0]===undefined?'no-photo.jpg':row.original.property_images[0])} width="70" alt="Extra" />
                ),
                width: 80
            },
            {
                Header: "Property Name",
                accessor: "property_name",
                width: 240
            },
            {
                Header: "Address",
                accessor: "property_address"
            },
            {
                Header: '',
                Cell: row =>(
                    <div>
                        <button className="btn btn-sm btn-info" onClick={ ()=> this.showModal(row.original.property_name, row.original) }>View</button>
                        <button className="btn btn-sm btn-warning" onClick={ ()=> this.showModal("Update Property", row.original) }>Edit</button>
                    </div>
                ),
                width: 120
            }
        ];

        return (
            <div className="PropertiesTab">
                <button className="btn btn-info" onClick={ () => this.showModal("Add Property") }>Add Property</button><br/><br/>

                <div className="modal fade" id="property-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{ this.state.modalTitle }</h5>
                            </div>
                            { 
                                this.state.modalVisible ? (
                                    <div className="modal-body">
                                        { this.state.modalMode === 'view' ? <PropertyDetails property={this.state.property} /> : <PropertyForm defaultProperty={this.state.property} savedProperty={this.savedProperty} onRef={ref => (this.child = ref)} /> }
                                    </div>
                                ):''
                            }
                            <div className="modal-footer">
                                {this.state.modalMode === 'form'?<button className="btn btn-sm btn-success" id="save-property-button" onClick={()=>this.child.saveProperty()}> Save </button>:''}
                                <button className="btn btn-sm" onClick={ () => this.hideModal() } >Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <ReactTable
                    data={this.state.properties}
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

export default connect(mapStateToProps)(PropertiesTab);