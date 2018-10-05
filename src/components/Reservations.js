import React, { Component } from 'react';
import { connect } from 'react-redux';
class Reservations extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Reservations');
    }
    render() {
        return (
            <div className="Reservations">
                Reservations
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', pageTitle:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Reservations);