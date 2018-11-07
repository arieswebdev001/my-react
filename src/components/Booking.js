import React, { Component } from 'react';
import { connect } from 'react-redux';
class Booking extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Booking');
    }
    render() {
        return (
            <div className="Booking">
                
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Booking);