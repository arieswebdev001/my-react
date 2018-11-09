import React from 'react';
import ItemRow from '../../ui/misc/ItemRow';

const RoomInfo = (props) => (
    <div className="row">
        <div className="col-md-4">
            <div className="m-widget13">
                { props.hideRoomCount === true ? '':<ItemRow value={ props.roomType.rooms.length } label="Room Count"/> }
                <ItemRow value={ props.roomType.max_adult } label="Max. Adult"/>  
                <ItemRow value={ props.roomType.max_child } label="Max. Child"/>  
            </div>
        </div>
        <div className="col-md-8">
            <h5>Bed Rooms</h5>
            <ul>
                {
                    props.roomType.bed_rooms.map((bed, key)=>{
                        return <li key={key}>{ bed.bed_type } { bed.description !== null ? (" - " + bed.description):'' }</li>
                    })
                }
            </ul>
            <h5>Features & Other Info</h5>
            <ol>
                {
                    props.roomType.room_type_features.map((feature, key)=>{
                        return (
                            <li key={key}>
                                {feature.group_name}
                                <ul>
                                    {
                                        feature.items.map((item, k)=>{
                                            return (<li key={k}> {item} </li>)
                                        })
                                    }
                                </ul>
                            </li>
                        )
                    })
                }
            </ol>
        </div>
    </div>
);

export default RoomInfo;