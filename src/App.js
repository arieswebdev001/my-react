import React, { Component } from 'react';
import Header from './components/layouts/Header';
import PageHeader from './components/layouts/PageHeader';
import Sidebar from './components/layouts/Sidebar';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Reservations from './components/Reservations';
import Guests from './components/Guests';
import Booking from './components/Booking';
import Rooms from './components/Rooms';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/auth/Login';
import Axios from './wrappers/Axios';
import { connect } from 'react-redux';

class App extends Component { 
  componentDidMount(){
    setTimeout(()=>{
      window.initTheme();
    },1000);
    this.getUser();
  }

  logout = ()=>{
    window.mySweetAlert("Are you sure you want to log out?", function(){
      window.localStorage.setItem("access_token", undefined);    
      window.location.href = '/login';
    });
  }

  getUser = () =>{
    let u = this;
    if(window.localStorage.access_token !== undefined && window.localStorage.access_token !== "undefined"){
      Axios.get('api/user')
      .then(function (response) {
        u.props.updateLoaded(true);
        u.props.updateUser(response.data.user);
      }).catch(function () {
        window.localStorage.setItem("access_token", undefined);
        window.location.href = '/login';
      }).then(function(){
        u.props.updateLoaded(true);
      });
    }
    else{
      u.props.updateLoaded(true);
    }
  }

  render() {
    return (
        <BrowserRouter>
          { 
            (this.props.user === null && window.location.href.search("booking") === -1) ? (
                this.props.loaded ? (<Login/>):(<div>Please wait...</div>)
            ):(
              <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
                <Header logout={this.logout}/>
                <button className="m-aside-left-close  m-aside-left-close--skin-dark " id="m_aside_left_close_btn"><i className="la la-close"></i></button>
                <Sidebar logout={this.logout}/>
                <div className="m-grid__item m-grid__item--fluid m-wrapper">
                  { this.props.user !== null ? <PageHeader/> : ""}
                  <div className="m-content">
                    <Route exact path="/" component={Home}/>
                    <Route path="/dashboard" component={Home}/>
                    <Route path="/rooms" component={Rooms}/>
                    <Route path="/reservations" component={Reservations}/>
                    <Route path="/guests" component={Guests}/>
                    <Route path="/profile" component={Profile}/>
                    <Route path="/reports" component={Reports}/>
                    <Route path="/settings" component={Settings}/>
                    <Route path="/booking" component={Booking}/>
                  </div>
                </div>
              </div>
            )
          }
        </BrowserRouter>
    );
  }
}

const mapStateToProps = (state)=>{
  return {
    user:state.user,
    loaded:state.loaded,
    pageTitle:state.pageTitle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user)=>{dispatch({ type: 'UPDATE_USER', user:user })},
    updateLoaded: (loaded)=>{dispatch({ type: 'UPDATE_LOADED', loaded:loaded })}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);