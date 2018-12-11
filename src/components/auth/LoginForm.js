import React, { Component } from 'react';
import Axios from '../../wrappers/Axios';
import FormAlert from '../ui/alerts/FormAlert';
import { Link } from 'react-router-dom';
import * as qs from 'query-string';
import Input from '../ui/controls/Input';
class LoginForm extends Component {
    state = {
        user:{
            email:'',
            password:''
        },
        errors:null
    };

    refresh = () =>{
        window.location.reload();
    }

    componentDidMount(){
        if(qs.parse(window.location.search).registration === "success")
            window.toastr.success("Registration successful, please login.");
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
                <img alt="" src="../images/app/logo.png" height="80" style={{margin:"auto", display:"block",height:120}}/>  	

                <h3 style={{color:this.props.titleColor, textAlign:"center"}}>Login To Your Account</h3>

                { this.state.errors !== null ? (<FormAlert errors={this.state.errors} />):"" }
                <div className="form-group">
                    <Input type="email" _value={this.state.user.email} placeholder="Email" onChange={(e)=> this.setState({ user :{ ...this.state.user, email:e }}) } autoComplete="off"/>
                </div>
                <div className="form-group">
                    <Input type="password" autoComplete="off" _value={this.state.user.password} placeholder="Password" onChange={(e)=> this.setState({ user :{ ...this.state.user, password:e }}) }/>
                </div>
                <div>
                    <div className="text-right">
                        <Link to="../../forgot-password" style={{ color:this.props.titleColor }} onClick={this.refresh}>Forgot Password ?</Link>
                        <br/><br/>
                    </div>
                </div>
                <div>
                    <button className="btn btn-warning btn-lg" type="button" onClick={()=>this.login()} id="login-button">Login</button>
                </div>
            </div>
        );
    }
}

export default LoginForm;