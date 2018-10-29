import React, { Component } from 'react';
import { connect } from 'react-redux';
class LevelsTab extends Component {
    render() {
        return (
            <div className="LevelsTab">
                Levels
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

export default connect(mapStateToProps)(LevelsTab);