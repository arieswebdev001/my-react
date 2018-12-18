import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { ResourcesPath } from '../../config';
import PromoForm from '../ui/forms/PromoForm';
import Axios from '../../wrappers/Axios';
class PromosTab extends Component {
    state = {
        promos:[],
        modalTitle:'',
        promo:null,
        modalMode:'form',
        modalVisible:false
    }

    componentDidMount(){
        this.getPromos();
    }

    getPromos(){
        let u = this;
        Axios.get('api/promos')
            .then(function (response) {
                u.setState({ promos:response.data });
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }
    
    showModal(title, data) {
        this.setState({ modalTitle:title, modalVisible:true });

        this.setState({
            promo: data===undefined ? { id:0 }: data,
            modalMode: title==="Update Promo" || title=== "New Promo"?"form":"view"
        });
        window.$("#promos-modal").modal("show");
    }

    hideModal() {
        window.$("#promos-modal").modal("hide");
        this.setState({ modalVisible:false });
    }

    savedPromo(response){
        window.toastr.success(response.data.message, "Saving Success");
        this.hideModal();
        this.getPromos();
    }

    deletePromo(promo){
        if(!window.confirm("Are you sure you want to delete this promo?"))
            return false;

        let u = this;
        Axios.delete('api/promo/' + promo.id)
            .then(function (response) {
                u.getPromos();  
                window.toastr("Promo has been deleted.")
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    render() {
        const columns = [
            {
                Header: "",
                Cell: row =>(
                    <img onClick={ ()=> this.showModal(row.original.promo_name, row.original) } className="clickable" src={ ResourcesPath + "/images/promos/" + (row.original.extra_image===''?'no-photo.jpg':row.original.promo_picture)} width="70" alt="Extra" />
                ),
                width: 80
            },
            {
                Header: "Name",
                Cell: row =>(
                    <span onClick={ ()=> this.showModal(row.original.promo_name, row.original) } className="clickable">{ row.original.promo_name }</span>
                ),
                width: 180
            },
            {
                Header: "Description",
                accessor: "promo_description"
            },
            {
                Header: "Type",
                accessor: "promo_type"
            },
            {
                Header: "",
                Cell: row =>(
                    <div>
                        <button className="btn btn-sm btn-info" onClick={ ()=> this.showModal(row.original.promo_name, row.original) }>View</button>
                        <button className="btn btn-sm btn-warning" onClick={ ()=> this.showModal("Update Promo", row.original) }>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={ ()=> this.deletePromo(row.original) }>Delete</button>
                    </div>
                ),
                width: 180
            },
        ];

        return (
            <div>
                <button className="btn btn-info" onClick={ () => this.showModal("New Promo") }>New Promo</button><br/><br/>

                <div className="modal fade" id="promos-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{ this.state.modalTitle }</h5>
                            </div>
                            { 
                                this.state.modalVisible ? (
                                    <div className="modal-body">
                                        { this.state.modalMode === 'view' ? null : <PromoForm defaultPromo={this.state.promo} savedPromo={this.savedPromo.bind(this)} onRef={ref => (this.child = ref)} /> }
                                    </div>
                                ):''
                            }
                            <div className="modal-footer">
                                {this.state.modalMode === 'form'?<button className="btn btn-sm btn-success" id="save-promo-button" onClick={()=>this.child.savePromo()}> Save </button>:''}
                                <button className="btn btn-sm" onClick={ () => this.hideModal() } >Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <ReactTable
                    data={this.state.promos}
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
        room_type:state.room_type
    }
};

export default connect(mapStateToProps, null)(PromosTab);