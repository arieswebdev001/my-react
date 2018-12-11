import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginForm from '../auth/LoginForm';

class Sidebar extends Component {
    logout = ()=>{
        this.props.logout();
    }

    goToLogin = () =>{
        window.location.href = '/login';
    }

    authenticatedMenu = () => (
        <ul className="m-menu__nav ">
            {
                this.state[this.props.user.level !== 0? 'adminMenus':'clientMenus'].map((menu,key)=>{
                    return (<li className={"m-menu__item " + ((this.props.pageTitle === menu.name || (this.props.pageTitle[0].name !== undefined ? this.props.pageTitle[0].name === menu.name : false) )?'m-menu__item--active':'')} aria-haspopup="true" key={key}>
                                <Link to={menu.url} className="m-menu__link ">
                                    <span className="m-menu__item-here"></span><i className={"m-menu__link-icon " + menu.icon }></i>
                                    <span className="m-menu__link-text">{ menu.name }</span>
                                </Link>
                            </li>)
                })
            }
            <li className="m-menu__item" aria-haspopup="true" m-menu-link-redirect="1" onClick={this.logout}>
                <span className="m-menu__link ">
                    <span className="m-menu__item-here"></span><i className="m-menu__link-icon fa fa-power-off"></i>
                    <span className="m-menu__link-text">Logout</span>
                </span>
            </li>
        </ul>
    )

    guestMenu = () => (
        <ul className="m-menu__nav ">
            <li className="m-menu__item" aria-haspopup="true" m-menu-link-redirect="1">
                <span onClick={()=>window.$("#login-modal").modal("show")} className="m-menu__link">
                    <span className="m-menu__item-here"></span><i className="m-menu__link-icon fa fa-lock"></i>
                    <span className="m-menu__link-text">Login</span>
                </span>
            </li>
            <li className="m-menu__item" aria-haspopup="true" m-menu-link-redirect="1">
                <span onClick={()=>window.$("#register-modal").modal("show")} className="m-menu__link">
                    <span className="m-menu__item-here"></span><i className="m-menu__link-icon fa fa-user"></i>
                    <span className="m-menu__link-text">Register</span>
                </span>
            </li>
            <li className="m-menu__item" aria-haspopup="true" m-menu-link-redirect="1">
                <a href="https://hotel.exactiv.com" className="m-menu__link">
                    <span className="m-menu__item-here"></span><i className="m-menu__link-icon fa fa-globe"></i>
                    <span className="m-menu__link-text">Back To Website</span>
                </a>
            </li>
        </ul>
    )

    state = {
        adminMenus:[
            { name:"Dashboard",  url:"/dashboard", icon:"flaticon-dashboard", submenus:null },
            { name:"Reservations",  url:"/reservations", icon:"flaticon-list-2", submenus:null  },
            { name:"Guests",  url:"/guests", icon:"flaticon-users", submenus:null  },
            { name:"Rooms",  url:"/rooms", icon:"la la-bed", submenus:null  },
            { name:"Events Place",  url:"/events-place", icon:"la la-folder", submenus:null  },
            { name:"Reports",  url:"/reports", icon:"fa fa-folder", submenus:null  },
            { name:"Settings", url:"/settings", icon:"la la-cog", submenus:null }
        ],
        clientMenus:[
            { name:"Dashboard",  url:"/dashboard", icon:"flaticon-dashboard", submenus:null },
            { name:"New Booking",  url:"/booking", icon:"flaticon-list-2", submenus:null  },
            { name:"My Bookings",  url:"/bookings", icon:"flaticon-list-2", submenus:null  },
        ]
    }

    render() {
        return (
            <div id="m_aside_left" className="m-grid__item	m-aside-left  m-aside-left--skin-dark ">
                <div id="m_ver_menu" className="m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark" m-menu-vertical="1" 
                    m-menu-scrollable="0" m-menu-dropdown-timeout="500">
                    {
                        this.props.user !== null? this.authenticatedMenu():this.guestMenu()
                    }
                </div>

                <div className="modal fade" id="login-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <LoginForm titleColor="black"/>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal fade" id="register-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Registration Form</h5>
                            </div>
                            <div className="modal-body">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        pageTitle:state.pageTitle,
        user:state.user,
    }
}
export default connect(mapStateToProps)(Sidebar);