import React, { Component } from 'react';
import { connect } from 'react-redux';
class SystemTab extends Component {
    render() {
        return (
            <div className="SystemTab">
                System
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

export default connect(mapStateToProps)(SystemTab);