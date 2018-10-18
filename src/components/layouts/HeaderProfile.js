import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class HeaderProfile extends Component {
    logout = ()=>{
        this.props.logout();
    }
    render() {
        return(
            <li className="m-nav__item m-topbar__user-profile  pointer m-dropdown m-dropdown--medium m-dropdown--arrow  m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light" m-dropdown-toggle="click">
                <span className="m-nav__link m-dropdown__toggle">
                    <span className="m-topbar__userpic">
                    <img src={"images/users/" + this.props.user.picture} className="m--img-rounded m--marginless m--img-centered" alt=""/>
                    </span>
                    <span className="m-nav__link-icon m-topbar__usericon  m--hide">
                    <span className="m-nav__link-icon-wrapper"><i className="flaticon-user-ok"></i></span>
                    </span>
                    <span className="m-topbar__username"> &nbsp; { this.props.user.first_name } { this.props.user.last_name }</span>					
                </span>
                <div className="m-dropdown__wrapper">
                    <span className="m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust"></span>
                    <div className="m-dropdown__inner">
                        <div className="m-dropdown__header m--align-center">
                            <div className="m-card-user m-card-user--skin-light">
                                <div className="m-card-user__pic">
                                    <img src={"images/users/" + this.props.user.picture} className="m--img-rounded m--marginless" alt=""/>
                                </div>
                                <div className="m-card-user__details">
                                    <span className="m-card-user__name m--font-weight-500"> { this.props.user.first_name } { this.props.user.last_name } </span>
                                    <span className="m-card-user__email m--font-weight-300 m-link">{ this.props.user.email }</span>
                                </div>
                            </div>
                        </div>
                        <div className="m-dropdown__body">
                            <div className="m-dropdown__content">
                                <ul className="m-nav m-nav--skin-light">
                                    <li className="m-nav__item">
                                        <Link to="/profile" className="m-nav__link">
                                            <i className="m-nav__link-icon flaticon-profile-1"></i>    
                                            <span className="m-nav__link-text">My Profile</span>       
                                        </Link>
                                    </li>
                                    <li className="m-nav__item">
                                        <Link to="/activities" className="m-nav__link">
                                            <i className="m-nav__link-icon flaticon-share"></i>
                                            <span className="m-nav__link-text">Activity</span>
                                        </Link>
                                    </li>
                                    <li className="m-nav__separator m-nav__separator--fit">
                                    </li> 
                                    <li className="m-nav__item pointer" onClick={this.logout}>
                                        <i className="m-nav__link-icon"></i>
                                        <span className="m-nav__link-text">Logout</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};
export default connect(mapStateToProps)(HeaderProfile);
