import React, { Component } from 'react';
import { connect } from 'react-redux';
class Guests extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Guests');
    }
    render() {
        return (
            <div className="Guests">
                
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', pageTitle:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Guests);