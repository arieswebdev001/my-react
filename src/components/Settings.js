import React, { Component } from 'react';
import { connect } from 'react-redux';
import SettingsTab from './settings/SettingsTab';
import PropertiesTab from './settings/PropertiesTab';

class Settings extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Settings');
    }
    render() {
        return (
            <div className="Settings">
                <div className="m-portlet m-portlet--tabs">
                    <div className="m-portlet__head">
                        <div className="m-portlet__head-tools">
                            <ul className="nav nav-tabs m-tabs-line m-tabs-line" role="tablist">
                                <li className="nav-item m-tabs__item">
                                    <a className="nav-link m-tabs__link active" data-toggle="tab" href="#settings" role="tab">
                                        Settings 
                                    </a>
                                </li>
                                <li className="nav-item m-tabs__item">
                                    <a className="nav-link m-tabs__link" data-toggle="tab" href="#users" role="tab">
                                        Users
                                    </a>
                                </li>
                                <li className="nav-item m-tabs__item">
                                    <a className="nav-link m-tabs__link" data-toggle="tab" href="#user-levels" role="tab">
                                        User Levels
                                    </a>
                                </li>
                                <li className="nav-item m-tabs__item">
                                    <a className="nav-link m-tabs__link" data-toggle="tab" href="#properties" role="tab">
                                        Properties
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="m-portlet__body">                   
                        <div className="tab-content">
                            <div className="tab-pane active" id="settings" role="tabpanel">
                                <SettingsTab/>
                            </div>
                            <div className="tab-pane" id="users" role="tabpanel">
                            
                            </div>
                            <div className="tab-pane" id="user-levels" role="tabpanel">
                            
                            </div>
                            <div className="tab-pane" id="properties" role="tabpanel">
                                <PropertiesTab/>
                            </div>
                        </div>      
                    </div>
                </div>
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