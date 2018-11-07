import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabbedPortlet from './ui/portlets/TabbedPortlet';

class Reports extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Reports');
    }
    render() {
        const tabs = [
            {id:"bookings", label:"Bookings", component:null},
            {id:"reviews", label:"Reviews", component:null},
            {id:"logs", label:"Logs", component:null}
        ];
        return (
            <div className="Reports">
                <TabbedPortlet colorClass="m-portlet--danger" tabs={ tabs } />
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Reports);