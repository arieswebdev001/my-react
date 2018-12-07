import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabbedPortlet from './ui/portlets/TabbedPortlet';
import Bookings from './eventsplace/Bookings';
import Inquiries from './eventsplace/Inquiries';

class Guests extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Events Place');
    }
    render() {
        const tabs = [
            {id:"bookings", label:"Bookings", component:<Bookings/>},
            {id:"inquiries", label:"Inquiries", component:<Inquiries/>},
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