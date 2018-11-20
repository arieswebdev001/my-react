import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from '../../wrappers/Axios';

class GuestProfile extends Component {
    getGuest(){
        let u = this;
        Axios.get( (this.props.match.url.indexOf("member") !== -1? 'api/nonMember/':'api/member') + this.props.match.params.id)
            .then(function (response) {
                u.props.updateGuest(response.data);
                u.props.updatePageTitle([{name:"Guests", url:"/guests"}, u.props.guest.first_name]);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }


    componentWillMount(){
        this.getGuest();
        if(this.props.guest !== null)
            this.props.updatePageTitle([{name:"Guests", url:"/guests"}, this.props.guest.first_name ]);
    }

    render() {
        return (
            <div className="GuestProfile">
            
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user,
        guest:state.guest
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
        updateGuest: (guest)=>{dispatch({ type: 'UPDATE_GUEST', payload:guest })},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuestProfile);