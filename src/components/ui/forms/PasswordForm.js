import React, { Component } from 'react';
import Input from '../../ui/controls/Input';
import Axios from '../../../wrappers/Axios';

class PasswordForm extends Component {
    state = {
        password:{
            new_password:'',
            confirm_password:''
        }
    }

    componentDidMount(){ 
        this.props.onRef(this)
    }

    handleChange = () => {
        this.setState({
            password:{
                ...this.state.password,
                new_password: window.$("#new_password").val(),
                confirm_password: window.$("#confirm_password").val()
            }
        });
    }

    savePassword = ()=>{
        let u = this;
        window.spinButton(document.getElementById('save-password-button'));

        Axios.put('../../api/password', this.state.password)
        .then((response) => {
            u.props.savedPassword(response);
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
        }).then(function(){
            window.stopButton(document.getElementById('save-password-button'));
        });
    }

    render(){
        return (
            <form className="m-form">
                <div className="row">
                    <div className="col-md-12">
                        <Input label="New Password" _id="new_password" type="password" _value={ this.state.password.new_password } 
                            onChange={ ()=> this.handleChange() } />
                        <Input label="Confirm Password" _id="confirm_password" type="password" _value={ this.state.password.confirm_password } 
                            onChange={ ()=> this.handleChange() } />
                    </div>
                </div>
			</form>
        );
    }
}

export default PasswordForm;