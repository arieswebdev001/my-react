import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabbedPortlet from './ui/portlets/TabbedPortlet';
import RoomsTab from './rooms/RoomsTab';
import ExtrasTab from './rooms/ExtrasTab';
import PromosTab from './rooms/PromosTab';

class Rooms extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Rooms');
    }
    render() {
        const tabs = [
            {id:"rooms", label:"Rooms", component:<RoomsTab/>},
            {id:"extras", label:"Add-ons", component:<ExtrasTab/>},
            {id:"promos", label:"Promos", component:<PromosTab/>}
        ];

        return (
            <div className="Rooms">
                <TabbedPortlet colorClass="m-portlet--success" tabs={ tabs } />
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Rooms);