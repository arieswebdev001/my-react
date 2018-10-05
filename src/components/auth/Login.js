import React, { Component } from 'react';
import Axios from '../../wrappers/Axios';

class Login extends Component {
    state = {
        user:{
            email:'',
            password:''
        }
    };

    handleChange = (event) => {
        this.setState({
            user:{
                email:window.$("#email").val(),
                password:window.$("#password").val()
            }
        });
    }

    login = (event) =>{
        Axios.post('../../api/user/login', this.state.user)
            .then((response) => {
                window.localStorage.setItem("access_token", response.data.access_token);
                window.localStorage.setItem("refresh_token", response.data.refresh_token);
                window.location.href="/dashboard";
            }).catch(function (error) {
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message, "Login attempt failed");
            })
            .then(function () {
            });
    }

    render() {
        return (
            <div className="container">
                <div className="login">
                    <img alt="" src="images/app/logo.png" />  	
                    <br/>
                    <h3>Login To Your Account</h3>
                    <br/>
                    <div>
                        <div className="form-group">
                            <input className="form-control" type="email" placeholder="Email" id="email" onChange={this.handleChange} autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <input className="form-control" type="password" placeholder="Password" onChange={this.handleChange} id="password"/>
                        </div>
                        <div>
                            <div>
                                <a href="#/forgot-password">Forgot Password ?</a>
                                <br/><br/>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-success" type="button" onClick={this.login}>Login</button>
                        </div>
                    </div>	
                </div>
            </div>
        );
    }
}

export default Login;