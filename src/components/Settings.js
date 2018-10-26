import React, { Component } from 'react';
import { connect } from 'react-redux';
import SettingsTab from './settings/SettingsTab';
import PropertiesTab from './settings/PropertiesTab';
import FacilitiesTab from './settings/FacilitiesTab';
import TabbedPortlet from './ui/portlets/TabbedPortlet';

class Settings extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Settings');
    }

    state = {
        portletTabs:[
            {id:"settings", label:"Settings", component:<SettingsTab/>},
            {id:"properties", label:"Properties", component:<PropertiesTab/>},
            {id:"facilities", label:"Facilities", component:<FacilitiesTab/>},
            {id:"users", label:"Users", component:null},
            {id:"levels", label:"Levels", component:null},
            {id:"system", label:"System", component:null}
        ]
    }

    render() {
        return (
            <div className="Settings">
                <TabbedPortlet colorClass="m-portlet--info" tabs={this.state.portletTabs} />
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', pageTitle:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Settings);