import React, { Component } from 'react';
import { connect } from 'react-redux';
class Reports extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Reports');
    }
    render() {
        return (
            <div className="Reports">
                
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', pageTitle:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Reports);