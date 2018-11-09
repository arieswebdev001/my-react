import React from 'react';

const RoomCard = (props) => (
    <div className="room-card" style={{ backgroundColor:"#3a63db" }} 
            onClick={ props.onClick }>
        <h4>{ props.room.room_no } { props.room.room_data.customized !== undefined ? <i className="flaticon-star"></i>:'' } </h4>
        <h6>({ props.room.floor_name }) </h6>
        <h6>
            { 
                props.room.room_status==='clean'?
                    <span className="badge badge-success">Status: Clean</span>:
                    <span className="badge badge-danger">Status: { props.room.room_status }</span>
            } / 
            {
                props.room.is_operational ? <span className="badge badge-success">Operational</span>: <span className="badge badge-danger">Non-operational</span>
            }
        </h6>
    </div>
);

export default RoomCard;