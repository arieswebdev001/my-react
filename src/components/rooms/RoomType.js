import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabbedPortlet from '../ui/portlets/TabbedPortlet';
import Axios from '../../wrappers/Axios';

class RoomType extends Component {
    state = {
        room_type:{
            room_type_name:''
        }
    }

    getRoomType(){
        let u = this;
        Axios.get('api/roomType/' + this.props.match.params.id)
            .then(function (response) {
                u.setState({room_type:response.data});
                u.props.updatePageTitle("Room Types - " + response.data.room_type_name);
            });
    }

    componentDidMount(){
        this.getRoomType();
    }

    render() {
        const tabs = [
            {id:"details", label:"Details", component:null},
            {id:"rooms", label:"Rooms", component:null},
            {id:"pricing", label:"Pricing", component:null},
            {id:"promos", label:"Promos", component:null},
            {id:"availability", label:"Availability", component:null},
        ];

        return (
            <div className="RoomType">
                <TabbedPortlet tabs={ tabs } colorClass="m-portlet--warning" title={this.state.room_type.room_type_name}/>
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', pageTitle:pageTitle })},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomType);