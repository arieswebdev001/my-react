import React, { Component } from 'react';
import { connect } from 'react-redux';
class RoomTypeDetails extends Component {
    render() {
        return (
            <div>
                RoomTypeDetails
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

export default connect(mapStateToProps)(RoomTypeDetails);