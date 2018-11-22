import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
class Login extends Component {
    
    refresh = () =>{
        window.location.reload();
    }
    render() {
        return (
            <form className="container login-page">
                <div className="login">
                    <LoginForm titleColor="whote"/>
                    <div className="text-left">
                        <br/>
                        <Link onClick={this.refresh} to="booking">Go to Booking Form</Link>
                    </div>
                    <div className="text-left">
                        <Link onClick={this.refresh} to="register">Register as Member</Link>
                    </div>
                </div>
            </form>
        );
    }
}

export default Login;