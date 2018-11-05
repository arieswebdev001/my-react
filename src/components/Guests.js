import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabbedPortlet from './ui/portlets/TabbedPortlet';

class Guests extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Guests');
    }
    render() {
        const tabs = [
            {id:"members", label:"Members", component:null},
            {id:"nonmembers", label:"Non-Members", component:null},
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
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', pageTitle:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Guests);