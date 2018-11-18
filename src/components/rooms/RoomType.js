import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabbedPortlet from '../ui/portlets/TabbedPortlet';
import Axios from '../../wrappers/Axios';
import Details from './room_type/Details'
import Rooms from './room_type/Rooms';
import Pricing from './room_type/Pricing';
class RoomType extends Component {
    getRoomType(){
        let u = this;
        Axios.get('api/roomType/' + this.props.match.params.id)
            .then(function (response) {
                u.props.updateRoomType(response.data);
                u.props.updatePageTitle([{name:"Rooms", url:"/rooms"}, u.props.room_type.room_type_name]);
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            });
    }

    componentWillMount(){
        this.getRoomType();
        if(this.props.room_type !== null)
            this.props.updatePageTitle([{name:"Rooms", url:"/rooms"}, this.props.room_type.room_type_name]);
    }

    render() {
        const tabs = [
            {id:"details", label:"Details", component: <Details onUpdate={ this.getRoomType.bind(this) } />},
            {id:"rooms", label:"Individual Rooms", component: <Rooms onSave={ this.getRoomType.bind(this) } />},
            {id:"pricing", label:"Pricing", component: <Pricing openned={false} onSave={ this.getRoomType.bind(this) } />}
        ];

        return (
            <div className="RoomType">
            {
                this.props.room_type !== null  ? <TabbedPortlet tabs={ tabs } colorClass="m-portlet--warning" title={this.props.room_type.room_type_name}/> :'Loading...'
            }
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user,
        room_type:state.room_type
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
        updateRoomType: (room_type)=>{dispatch({ type: 'UPDATE_ROOM_TYPE', payload:room_type })},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomType);