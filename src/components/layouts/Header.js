import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderNotifications from './HeaderNotifications';
import HeaderProfile from './HeaderProfile';
import { Link } from 'react-router-dom';
import { ResourcesPath } from '../../config';

class Header extends Component {
    render() {
        return (
                <header id="m_header" className="m-grid__item    m-header "  m-minimize-offset="200" m-minimize-mobile-offset="200" >
                    <div className="m-container m-container--fluid m-container--full-height">
                        <div className="m-stack m-stack--ver m-stack--desktop">
                            <div className="m-stack__item m-brand  m-brand--skin-dark ">
                                <div className="m-stack m-stack--ver m-stack--general">
                                    <div className="m-stack__item m-stack__item--middle m-brand__logo">
                                        {
                                            this.props.user !== null ? 
                                                    (   <Link to="/dashboard" className="m-brand__logo-wrapper">
                                                            <img alt="" src={ ResourcesPath +"/images/app/logo.png"} height="60"/>
                                                        </Link>  
                                                    ):
                                                    (
                                                        <span className="m-brand__logo-wrapper">
                                                            <img alt="" src={ ResourcesPath +"/images/app/logo.png"} height="60"/>
                                                        </span>  
                                                    )
                                        }
                                        
                                    </div>
                                    <div className="m-stack__item m-stack__item--middle m-brand__tools">
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
                            </div>
                            <div className="m-stack__item m-stack__item--fluid m-header-head" id="m_header_nav">
                                <button className="m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-dark " id="m_aside_header_menu_mobile_close_btn"><i className="la la-close"></i></button>
                                <div id="m_header_topbar" className="m-topbar  m-stack m-stack--ver m-stack--general">
                                    <div className="m-stack__item m-topbar__nav-wrapper">
                                        {
                                            this.props.user !== null ? 
                                                    (   <ul className="m-topbar__nav m-nav m-nav--inline">
                                                            <HeaderNotifications/>
                                                            <HeaderProfile logout={this.props.logout}/>
                                                        </ul>
                                                    ):
                                                    (
                                                        <ul className="m-topbar__nav m-nav m-nav--inline">

                                                        </ul>
                                                    )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>  
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        user:state.user,
        loaded:state.loaded
    }
};
export default connect(mapStateToProps)(Header);