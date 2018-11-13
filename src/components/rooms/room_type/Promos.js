import React, { Component } from 'react';
import { connect } from 'react-redux';

class Promos extends Component {
    render() {
        return (
            <div>
                Promos
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        room_type:state.room_type
    }
};

export default connect(mapStateToProps, null)(Promos);