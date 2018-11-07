import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabbedPortlet from './ui/portlets/TabbedPortlet';

class Guests extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Events Place');
    }
    render() {
        const tabs = [
            {id:"bookings", label:"Bookings", component:null},
            {id:"inquiries", label:"Inquiries", component:null},
        ];

        return (
            <div className="EventsPlace">
                <TabbedPortlet colorClass="m-portlet--warning" tabs={ tabs } />
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Guests);