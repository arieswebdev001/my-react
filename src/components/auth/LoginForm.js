import React, { Component } from 'react';
import Axios from '../../wrappers/Axios';
import FormAlert from '../ui/alerts/FormAlert';
import { Link } from 'react-router-dom';
class LoginForm extends Component {
    state = {
        user:{
            email:'',
            password:''
        },
        errors:null
    };

    handleChange = () => {
        this.setState({
            user:{
                email:window.$("#email").val(),
                password:window.$("#password").val()
            }
        });
    }

    refresh = () =>{
        window.location.reload();
    }

    login = () =>{
        let u = this;
        this.setState({errors:null});
        window.spinButton(document.getElementById('login-button'));
        Axios.post('../../api/user/login', this.state.user)
            .then((response) => {
                window.localStorage.setItem("access_token", response.data.access_token);
                window.localStorage.setItem("refresh_token", response.data.refresh_token);
                window.location.href="/dashboard";
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            u.setState({errors:error.response.data.message});
                }
                window.stopButton(document.getElementById('login-button'));
            });
    }

    render() {
        return (
            <div>
                <img alt="" src="images/app/logo.png" height="80" style={{margin:"auto", display:"block",height:120}}/>  	

                <h3 style={{color:this.props.titleColor, textAlign:"center"}}>Login To Your Account</h3>

                { this.state.errors !== null ? (<FormAlert errors={this.state.errors} />):"" }
                <div className="form-group">
                    <input className="form-control" type="email" placeholder="Email" id="email" onChange={this.handleChange} autoComplete="off"/>
                </div>
                <div className="form-group">
                    <input className="form-control" type="password" autoComplete="off" placeholder="Password" onChange={this.handleChange} id="password"/>
                </div>
                <div>
                    <div className="text-right">
                        <Link to="forgot-password" style={{ color:this.props.titleColor }} onClick={this.refresh}>Forgot Password ?</Link>
                        <br/><br/>
                    </div>
                </div>
                <div>
                    <button className="btn btn-warning btn-block" type="button" onClick={()=>this.login()} id="login-button">Login</button>
                </div>
            </div>
        );
    }
}

export default LoginForm;