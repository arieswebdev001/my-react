import React, { Component } from 'react';
import { connect } from 'react-redux';
class ExtrasTab extends Component {
    render() {
        return (
            <div className="ExtrasTab">
                Extras
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