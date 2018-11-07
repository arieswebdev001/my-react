import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { ResourcesPath } from '../../config';
import Axios from '../../wrappers/Axios';
import ProfileForm from '../ui/forms/ProfileForm';
import ProfileDetails from '../ui/containers/ProfileDetails';

class UsersTab extends Component {
    state = {
        users:[],
        modalVisible:false,
        modalMode:'form',
        modalTitle:'',
        user:null
    };

    componentDidMount(){
        this.getUsers();
    }

    showModal(title, data) {
        this.setState({ modalTitle:title, modalVisible:true });

        this.setState({
            user: data===undefined ?
                {
                    id:0,
                    birth_date:'2000-01-01',
                    picture:'',
                    level:1,
                    address:'',
                    first_name:'',
                    middle_name:'',
                    last_name:'',
                    mobile:'',
                    email:'',
                    gender:'female'
                }: data,
            modalMode: title==="Update User" || title=== "Add User"?"form":"view"
        });
        window.$("#user-modal").modal("show");
    }

    getUsers(){
        let u = this;
        Axios.get('api/users')
            .then(function (response) {
                u.setState({users:response.data});
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    hideModal() {
        window.$("#user-modal").modal("hide");
        this.setState({ modalVisible:false });
    }

    savedUser(response){
        window.toastr.success(response.data.message, "Saving Success");
        this.hideModal();
        this.getUsers();
    }

    render() {
        const columns = [
            {
                Header: "",
                Cell: row =>(
                    <img onClick={ ()=> this.showModal(row.original.name, row.original) } className="clickable" src={ ResourcesPath + "/images/users/" + row.original.picture } width="40" alt="User" />
                ),
                width: 50,
                filterable:false
            },
            {
                Header: "Name",
                Cell: row =>(
                    <span onClick={ ()=> this.showModal(row.original.name, row.original) } className="clickable">{ row.original.name }</span>
                ),
                width: 280,
                accessor:"name"
            },
            {
                Header: "Level",
                accessor: "level_name",
                width: 120
            },
            {
                Header: "Mobile",
                accessor: "mobile"
            },
            {
                Header: "Email",
                accessor: "email"
            },
            {
                Header: '',
                Cell: row =>(
                    <div>
                        <button className="btn btn-sm btn-info" onClick={ ()=> this.showModal(row.original.name, row.original) }>View</button>
                        <button className="btn btn-sm btn-warning" onClick={ ()=> this.showModal("Update User", row.original) }>Edit</button>
                    </div>
                ),
                width: 120,
                filterable:false
            }
        ];
        return (
            <div className="UsersTab">
                <button className="btn btn-info" onClick={ () => this.showModal("Add User") }>Add User</button><br/><br/>

                <div className="modal fade" id="user-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{ this.state.modalTitle }</h5>
                            </div>
                            { 
                                this.state.modalVisible ? (
                                    <div className="modal-body">
                                        {
                                            this.state.modalMode === 'form'?
                                            <ProfileForm endpointUrl="../../api/user" 
                                                profile={this.state.user} 
                                                savedProfile={this.savedUser.bind(this)} 
                                                onRef={ref => (this.child = ref)} 
                                                showLevelOption={true}
                                                showPasswordChanger={true}
                                                showPropertyOption={true}
                                                method={this.state.user.id===0?'post':'put'}
                                            />:
                                            <ProfileDetails profile={this.state.user} />
                                        }
                                        
                                    </div>
                                ):''
                            }
                            <div className="modal-footer">
                                {this.state.modalMode === 'form'?<button className="btn btn-sm btn-success" id="save-profile-button" onClick={()=>this.child.saveProfile()}> Save </button>:''}
                                <button className="btn btn-sm" onClick={ () => this.hideModal() } >Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ReactTable
                    filterable
                    defaultFilterMethod={(filter, row) => {
                        return row[filter.id].toLowerCase().search(filter.value.toLowerCase()) !== -1;
                    }}
                    data={this.state.users}
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

export default connect(mapStateToProps)(UsersTab);