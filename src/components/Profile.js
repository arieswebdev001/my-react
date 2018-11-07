import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserCard from './ui/misc/UserCard';
import Axios from '../wrappers/Axios';
import ProfileForm from './ui/forms/ProfileForm';
import PasswordForm from './ui/forms/PasswordForm';
import TabbedPortlet from './ui/portlets/TabbedPortlet';
class Profile extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Profile');
    }

    showUpdateModal(){
        window.$("#update-modal").modal("show");
        this.getUser();
    }

    showPasswordModal(){
        window.$("#password-modal").modal("show");
    }

    hideUpdateModal(){
        window.$("#update-modal").modal("hide");
    }

    hidePasswordModal(){
        window.$("#password-modal").modal("hide");
    }

    getUser = () =>{
        let u = this;
        Axios.get('api/user')
        .then(function (response) {
            u.props.updateUser(response.data.user);
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                window.localStorage.setItem("access_token", undefined);
                window.location.href = '/login';
            }
        });
    }

    savedProfile(response){
        window.toastr.success(response.data.message, "Saving Success");
        this.hideUpdateModal();
        this.getUser();
    }

    savedPassword(response){
        window.toastr.success(response.data.message, "Saving Success");
        this.hidePasswordModal();
    }

    render() {

        const tabs = [
            {id:"details", label:"Details", component:null},
            {id:"notifications", label:"Notifications", component:null},
            {id:"logs", label:"Logs", component:null},
            {id:"notes", label:"Notes", component:null}
        ];

        return (
            <div className="Profile">
                <div className="row">
                    <div className="col-md-3">
                        <UserCard user={this.props.user} 
                            showUpdateButton={true} 
                            showPasswordButton={true} 
                            onUpdateClicked={()=>this.showUpdateModal()} 
                            onPasswordClicked={()=>this.showPasswordModal()}
                        /> 

                        <div className="modal fade" id="update-modal" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Update Profile</h5>
                                    </div>
                                    <div className="modal-body">
                                        <ProfileForm endpointUrl="../../api/profile" 
                                            profile={this.props.user} 
                                            savedProfile={this.savedProfile.bind(this)} 
                                            onRef={ref => (this.child = ref)} 
                                            method="put"
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-sm btn-success" id="save-profile-button" onClick={()=>this.child.saveProfile()}> Save </button>
                                        <button className="btn btn-sm" onClick={ () => this.hideUpdateModal() } >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="password-modal" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-sm" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Change Password</h5>
                                    </div>
                                    <div className="modal-body">
                                        <PasswordForm savedPassword={this.savedPassword.bind(this)} onRef={ref2 => (this.child2 = ref2)} />
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-sm btn-success" id="save-password-button" onClick={()=>this.child2.savePassword()}> Save </button>
                                        <button className="btn btn-sm" onClick={ () => this.hidePasswordModal() } >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-9">
                        <TabbedPortlet tabs={ tabs } colorClass="m-portlet--warning" title=""/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
        updateUser: (user)=>{dispatch({ type: 'UPDATE_USER', payload:user })}
    }
}
const mapStateToProps = (state)=>{
    return {
        user:state.user,
        loaded:state.loaded
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(Profile);