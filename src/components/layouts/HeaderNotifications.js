import React, { Component } from 'react';
import { connect } from 'react-redux';

class HeaderNotifications extends Component {
    render() {
        return(
            <li className="m-nav__item pointer m-topbar__notifications m-dropdown m-dropdown--large m-dropdown--arrow m-dropdown--align-center 	m-dropdown--mobile-full-width" m-dropdown-toggle="click" m-dropdown-persistent="1">
                <span className="m-nav__link m-dropdown__toggle" id="m_topbar_notification_icon">
                    <span className="m-nav__link-icon">
                    <span className="m-nav__link-icon-wrapper"><i className="flaticon-music-2"></i></span>
                    <span className="m-nav__link-badge m-badge m-badge--danger">3</span>
                    </span>
                </span>
                <div className="m-dropdown__wrapper">
                    <span className="m-dropdown__arrow m-dropdown__arrow--center"></span>
                    <div className="m-dropdown__inner">
                        <div className="m-dropdown__header m--align-center">
                            <span className="m-dropdown__header-title">9 New</span>
                            <span className="m-dropdown__header-subtitle">User Notifications</span>
                        </div>
                        <div className="m-dropdown__body">
                            <div className="m-dropdown__content">
                                <div className="m-scrollable" data-scrollable="true" data-height="250" data-mobile-height="200">
                                    <div className="m-list-timeline m-list-timeline--skin-light">
                                        <div className="m-list-timeline__items">
                                            <div className="m-list-timeline__item">
                                                <span className="m-list-timeline__badge -m-list-timeline__badge--state-success"></span>
                                                <span className="m-list-timeline__text">12 new users registered</span>
                                                <span className="m-list-timeline__time">Just now</span>
                                            </div>
                                            <div className="m-list-timeline__item">
                                                <span className="m-list-timeline__badge"></span>
                                                <span className="m-list-timeline__text">Production server up</span>
                                                <span className="m-list-timeline__time">5 hrs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
export default connect(mapStateToProps)(HeaderNotifications);
