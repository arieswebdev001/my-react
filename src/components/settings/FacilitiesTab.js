import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Axios from '../../wrappers/Axios';
import FacilityDetails from '../ui/containers/FacilityDetails';
import FacilityForm from '../ui/forms/FacilityForm';
import { ResourcesPath } from '../../config';

class FacilitiesTab extends Component {
    state = {
        facilities:[],
        modalVisible:false,
        modalMode:'form',
        modalTitle:'',
        facility:null
    }

    showModal(title, data) {
        this.setState({ modalTitle:title, modalVisible:true });

        this.setState({
            facility: data===undefined ? { id:0 }: data,
            modalMode: title==="Update Facility" || title=== "Add Facility"?"form":"view"
        });
        window.$("#facility-modal").modal("show");
    }

    hideModal() {
        window.$("#facility-modal").modal("hide");
        this.setState({ modalVisible:false });
    }

    getFacilities = () =>{
        let u = this;
        Axios.get('api/facilities')
            .then(function (response) {
                u.setState({facilities:response.data});
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    savedFacility = (response)=>{
        window.toastr.success(response.data.message, "Saving Success");
        this.hideModal();
        this.getFacilities();
    }

    componentDidMount(){
        this.getFacilities();
    }

    render() {
        const columns = [
            {
                Header: "",
                Cell: row =>(
                    <img onClick={ ()=> this.showModal(row.original.facility_name, row.original) } className="clickable" src={ ResourcesPath + "/images/facilities/" + (row.original.facility_image===''?'no-photo.jpg':row.original.facility_image)} width="70" alt="Facility" />
                ),
                width: 80
            },
            {
                Header: "Facility Name",
                Cell: row =>(
                    <span onClick={ ()=> this.showModal(row.original.facility_name, row.original) } className="clickable">{ row.original.facility_name }</span>
                ),
                width: 240
            },
            {
                Header: "Description",
                accessor: "facility_description"
            },
            {
                Header: '',
                Cell: row =>(
                    <div>
                        <button className="btn btn-sm btn-info" onClick={ ()=> this.showModal(row.original.facility_name, row.original) }>View</button>
                        <button className="btn btn-sm btn-warning" onClick={ ()=> this.showModal("Update Facility", row.original) }>Edit</button>
                    </div>
                ),
                width: 120
            }
        ];

        return (
            <div className="FacilitiesTab">
                <button className="btn btn-info" onClick={ () => this.showModal("Add Facility") }>Add Facility</button><br/><br/>

                <div className="modal fade" id="facility-modal" tabIndex="-1" role="dialog">
                    <div className={"modal-dialog " + (this.state.modalMode==='form'? 'modal-lg':'')} role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{ this.state.modalTitle }</h5>
                            </div>
                            { 
                                this.state.modalVisible ? (
                                    <div className="modal-body">
                                    { this.state.modalMode === 'view' ? <FacilityDetails facility={this.state.facility} /> : <FacilityForm defaultFacility={this.state.facility} savedFacility={this.savedFacility} onRef={ref => (this.child = ref)} /> }
                                    </div>
                                ):''
                            }
                            <div className="modal-footer">
                                {this.state.modalMode === 'form'?<button className="btn btn-sm btn-success" id="save-facility-button" onClick={()=>this.child.saveFacility()}> Save </button>:''}
                                <button className="btn btn-sm" onClick={ () => this.hideModal() } >Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <ReactTable
                    data={this.state.facilities}
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

export default connect(mapStateToProps)(FacilitiesTab);