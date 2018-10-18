import React, { Component } from 'react';
import { connect } from 'react-redux';
class SettingsTab extends Component {
    render() {
        return (
            <div className="SettingsTab">
                
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

export default connect(mapStateToProps)(SettingsTab);