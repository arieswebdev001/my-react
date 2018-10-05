import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    logout = ()=>{
        this.props.logout();
    }

    render() {
        return (
                <header id="m_header" className="m-grid__item    m-header "  m-minimize-offset="200" m-minimize-mobile-offset="200" >
                    <div className="m-container m-container--fluid m-container--full-height">
                        <div className="m-stack m-stack--ver m-stack--desktop">
                            <div className="m-stack__item m-brand  m-brand--skin-dark ">
                                <div className="m-stack m-stack--ver m-stack--general">
                                    <div className="m-stack__item m-stack__item--middle m-brand__logo">
                                        <Link to="/dashboard" className="m-brand__logo-wrapper">
                                            <img alt="" src="images/app/logo.png"/>
                                        </Link>  
                                    </div>
                                    <span id="m_aside_left_minimize_toggle" className="m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-desktop-inline-block  ">
                                        <span></span>
                                    </span>
                                    <span id="m_aside_left_offcanvas_toggle" className="m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-tablet-and-mobile-inline-block">
                                        <span></span>
                                    </span>
                                    <span id="m_aside_header_topbar_mobile_toggle" className="m-brand__icon m--visible-tablet-and-mobile-inline-block">
                                        <i className="flaticon-more"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="m-stack__item m-stack__item--fluid m-header-head" id="m_header_nav">
                                <button className="m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-dark " id="m_aside_header_menu_mobile_close_btn"><i className="la la-close"></i></button>
                                <div id="m_header_topbar" className="m-topbar  m-stack m-stack--ver m-stack--general">
                                    <div className="m-stack__item m-topbar__nav-wrapper">
                                        <ul className="m-topbar__nav m-nav m-nav--inline">
                                            <li className="m-nav__item m-topbar__notifications m-dropdown m-dropdown--large m-dropdown--arrow m-dropdown--align-center 	m-dropdown--mobile-full-width" m-dropdown-toggle="click" m-dropdown-persistent="1">
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
                                            <li className="m-nav__item m-topbar__user-profile  m-dropdown m-dropdown--medium m-dropdown--arrow  m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light" m-dropdown-toggle="click">
                                                <span className="m-nav__link m-dropdown__toggle">
                                                    <span className="m-topbar__userpic">
                                                    <img src="images/app/logo.png" className="m--img-rounded m--marginless m--img-centered" alt=""/>
                                                    </span>
                                                    <span className="m-nav__link-icon m-topbar__usericon  m--hide">
                                                    <span className="m-nav__link-icon-wrapper"><i className="flaticon-user-ok"></i></span>
                                                    </span>
                                                    <span className="m-topbar__username m--hide">Aries</span>					
                                                </span>
                                                <div className="m-dropdown__wrapper">
                                                    <span className="m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust"></span>
                                                    <div className="m-dropdown__inner">
                                                        <div className="m-dropdown__header m--align-center">
                                                            <div className="m-card-user m-card-user--skin-light">
                                                                <div className="m-card-user__pic">
                                                                    <img src="images/app/logo.png" className="m--img-rounded m--marginless" alt=""/>
                                                                </div>
                                                                <div className="m-card-user__details">
                                                                    <span className="m-card-user__name m--font-weight-500">Aries</span>
                                                                    <span className="m-card-user__email m--font-weight-300 m-link">aries@msweb.co</span>
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
                                                                    <li className="m-nav__item" onClick={this.logout}>
                                                                        <span className="btn m-btn--pill btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder">Logout</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>  
        );
    }
}

export default Header;