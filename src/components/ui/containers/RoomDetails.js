import React, { Component } from 'react';
import ItemRow from '../misc/ItemRow';
import RoomInfo from './RoomInfo';

class RoomDetails extends Component {
    render(){
        const isCustomized = this.props.room.room_data.customized !== undefined;
        const custom_data = this.props.room.room_data.customized;
        return ( 
            <div className="row">
                <div className="col-md-6">
                    <div className="m-widget13">
                        <ItemRow value={ this.props.roomType.room_type_name } label="Room Type"/>  
                        <ItemRow value={ this.props.room.room_no } label="Room No."/>  
                        <ItemRow value={ this.props.room.room_notes } label="Notes"/>  
                        <ItemRow value={ this.props.room.floor_name } label="Floor"/>  
                        <ItemRow value={ this.props.room.room_status==='clean'?
                                        <span className="m-badge m-badge--success m-badge--wide">Clean</span>:
                                        <span className="m-badge m-badge--danger m-badge--wide">{ this.props.room.room_status }</span>
                                    } 
                        label="Status" />
                        <ItemRow value={ !isCustomized ?
                                        <span className="m-badge m-badge--danger m-badge--wide">No</span>:
                                        <span className="m-badge m-badge--success m-badge--wide">Yes</span>
                                    } 
                        label="Customized" />
                        <ItemRow value={ this.props.room.is_operational ?
                                        <span className="m-badge m-badge--danger m-badge--wide">Operational</span>: <span className="m-badge m-badge--danger m-badge--wide">Non-operational</span>
                                    } 
                        label="Operation" />
                    </div>
                </div>
                
                <div className="col-md-6"> 
                {
                    isCustomized?
                    <div>
                        <h3>(Customized Room)</h3>     
                        <RoomInfo roomType={custom_data} hideRoomCount={true} />
                    </div>:<RoomInfo roomType={this.props.roomType} hideRoomCount={true} />
                }
                </div>
            </div>
        );
    }
}

export default RoomDetails;