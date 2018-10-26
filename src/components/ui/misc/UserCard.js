import React from 'react';
import { ResourcesPath } from '../../../config';

const UserCard = (props) => (
    <div className="m-portlet m-portlet--full-height">
        <div className="m-portlet__body">
            <div className="m-card-profile">
                <div className="m-card-profile__pic">
                    <div className="m-card-profile__pic-wrapper">	
                        <img src={ ResourcesPath + "/images/users/" + props.user.picture } alt="" />
                    </div>
                </div>
                <div className="m-card-profile__details">
                    <span className="m-card-profile__name">{ props.user.name }</span>
                    <span className="m-card-profile__email">{ props.user.email }</span>
                </div>
            </div>
            <br/>
            { props.showUpdateButton? <button className="btn btn-info btn-block" onClick={props.onUpdateClicked}>Update Profile</button> :'' }
            { props.showPasswordButton? <button className="btn btn-danger btn-block" onClick={props.onPasswordClicked}>Change Password</button> :'' }
        </div>			
    </div>	
);

export default UserCard;