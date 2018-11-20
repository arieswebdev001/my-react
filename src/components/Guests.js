import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabbedPortlet from './ui/portlets/TabbedPortlet';
import MembersTab from './guests/MembersTab';
import NonMembersTab from './guests/NonMembersTab';

class Guests extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Guests');
    }
    render() {
        const tabs = [
            {id:"members", label:"Members", component:<MembersTab/>},
            {id:"nonmembers", label:"Non-Members", component:<NonMembersTab/>},
        ];

        return (
            <div className="Guests">
                <TabbedPortlet colorClass="m-portlet--primary" tabs={ tabs } />
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