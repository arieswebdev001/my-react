import React, { Component } from 'react';
import { connect } from 'react-redux';
class Rooms extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Rooms');
    }
    render() {
        return (
            <div className="Rooms">
                
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', pageTitle:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Rooms);