import React, { Component } from 'react';
import { connect } from 'react-redux';
class ExtraDetails extends Component {
    render() {
        return (
            <div>
                ExtraDetails
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

export default connect(mapStateToProps)(ExtraDetails);