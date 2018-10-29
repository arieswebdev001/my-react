import React, { Component } from 'react';
import { ResourcesPath } from '../../../config';
import ItemRow from '../misc/ItemRow';

class ProfileDetails extends Component {
    render(){
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="m-card-profile">
                        <div className="m-card-profile__pic">
                            <div className="m-card-profile__pic-wrapper">	
                                <img src={ ResourcesPath + "/images/users/" + this.props.profile.picture } alt="" />
                            </div>
                        </div>
                        <div className="m-card-profile__details">
                            <span className="m-card-profile__name">{ this.props.profile.name }</span>
                            <span className="m-card-profile__email">{ this.props.profile.email }</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="m-widget13">
                        <ItemRow value={ this.props.profile.address } label="Address"/>  
                        <ItemRow value={ this.props.profile.mobile } label="Mobile"/>  
                        <ItemRow value={ this.props.profile.gender } label="Gender"/>  
                        <ItemRow value={ this.props.profile.birth_date } label="Birth Date"/>  
                        <ItemRow value={ this.props.profile.level_name } label="Access Level"/>  
                        <ItemRow value={ this.props.profile.property_name } label="Default Property"/>  
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileDetails;