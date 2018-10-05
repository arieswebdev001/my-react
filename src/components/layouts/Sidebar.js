import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Sidebar extends Component {
    logout = ()=>{
        this.props.logout();
    }

    state = {
        menus:[
            { name:"Dashboard",  url:"/dashboard" },,
            { name:"Reservations",  url:"/reservations" },
            { name:"Guests",  url:"/guests" },
            { name:"Rooms",  url:"/rooms" }
        ]
    }

    render() {
        return (
            <div id="m_aside_left" className="m-grid__item	m-aside-left  m-aside-left--skin-dark ">
                <div id="m_ver_menu" className="m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark" m-menu-vertical="1" m-menu-scrollable="0" m-menu-dropdown-timeout="500">
                    <ul className="m-menu__nav ">
                        {
                            this.state.menus.map((menu,key)=>{
                                return (<li className={"m-menu__item " + (this.props.pageTitle === menu.name?'m-menu__item--active':'')} aria-haspopup="true" key={key}>
                                            <Link to={menu.url} className="m-menu__link ">
                                                <span className="m-menu__item-here"></span><i className="m-menu__link-icon flaticon-line-graph"></i>
                                                <span className="m-menu__link-text">{ menu.name }</span>
                                            </Link>
                                        </li>)
                            })
                        }
                        <li className="m-menu__item" aria-haspopup="true" m-menu-link-redirect="1" onClick={this.logout}>
                            <span className="m-menu__link ">
                                <span className="m-menu__item-here"></span><i className="m-menu__link-icon flaticon-settings"></i>
                                <span className="m-menu__link-text">Logout</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        pageTitle:state.pageTitle,
    }
}
export default connect(mapStateToProps)(Sidebar);