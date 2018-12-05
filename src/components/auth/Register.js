import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';

class Register extends Component {
    
    refresh = () =>{
        window.location.reload();
    }

    render() {
        return (
            <form className="container">
                <RegisterForm titleColor="white"/>
                <div className="text-left">
                    <br/>
                </div>
                <div className="text-left">
                    <Link onClick={this.refresh} to="../../login">Already have an account?</Link>
                </div>
            </form>
        );
    }
}

export default Register;