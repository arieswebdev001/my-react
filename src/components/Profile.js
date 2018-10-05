import React, { Component } from 'react';
import { connect } from 'react-redux';

class Profile extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Profile');
    }

    render() {
        return (
            <div className="Profile">
                Profile
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', pageTitle:pageTitle })},
    }
}

export default connect(null,mapDispatchToProps)(Profile);