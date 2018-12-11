import React, { Component } from 'react';
import Axios from '../../wrappers/Axios';
import FormAlert from '../ui/alerts/FormAlert';
import Input from '../ui/controls/Input';
import Select from '../ui/controls/Select';
import Toggle from 'react-toggle';

class RegisterForm extends Component {
    state = {
        user:{
            email:'',
            title:'',
            first_name:'',
            last_name:'',
            middle_name:'',
            address:'',
            mobile:'',
            password:'',
            password2:'',
            birth_date:window.moment().format("YYYY-MM-DD"),
            is_agreed:false
        },
        errors:null,
        policy:null
    };

    refresh = () =>{
        window.location.reload();
    }

    componentDidMount = () =>{
        let u = this;
        Axios.get('api/setting/PRIVACY_POLICY')
            .then(function (response) {
                u.setState({policy:response.data});
            });
    }

    register = () =>{
        let u = this;
        this.setState({errors:null});
        window.spinButton(document.getElementById('register-button'));
        Axios.post('../../api/user/register', this.state.user)
            .then((response) => {
                window.location.href="/login?registration=success";
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
                else{
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            u.setState({errors:error.response.data.message});
                }
                window.stopButton(document.getElementById('register-button'));
            });
    }

    render() {
        return (
            <div>
                <img alt="" src="../images/app/logo.png" height="80" style={{margin:"auto", display:"block",height:120}}/>  	

                <h3 style={{color:this.props.titleColor, textAlign:"center"}}>Member's Registration</h3>

                { this.state.errors !== null ? (<FormAlert errors={this.state.errors} />):"" }
                <div style={{textAlign:"left"}}>
                    <div className="row">
                        <div className="col-md-3">
                            <Select selection={['','Mr.', 'Ms.', 'Engr.', 'Dr.','Prof.']} required={true}
                                label="Title" onChange={ (e)=> this.setState({ user :{ ...this.state.user, title:e }}) } />
                        </div>
                        <div className="col-md-3">
                            <Input label="First Name" required={true} placeholder="First Name" onChange={(e)=> this.setState({ user :{ ...this.state.user, first_name:e }}) } autoComplete="off"/>
                        </div>
                        <div className="col-md-3">
                            <Input label="Middle Name" placeholder="Middle Name" onChange={(e)=> this.setState({ user :{ ...this.state.user, middle_name:e }}) } autoComplete="off"/>
                        </div>
                        <div className="col-md-3">
                            <Input label="Last Name" required={true} placeholder="Last Name" onChange={(e)=> this.setState({ user :{ ...this.state.user, last_name:e }}) } autoComplete="off"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <Input label="Mobile" placeholder="Mobile" onChange={(e)=> this.setState({ user :{ ...this.state.user, mobile:e }}) } autoComplete="off"/>
                        </div>
                        <div className="col-md-3">
                            <Input type="email" label="Email" placeholder="Email" onChange={(e)=> this.setState({ user :{ ...this.state.user, email:e }}) } autoComplete="off"/>
                        </div>
                        <div className="col-md-3">
                            <Input type="password" label="Password" placeholder="Password" onChange={(e)=> this.setState({ user :{ ...this.state.user, password:e }}) } autoComplete="off"/>
                        </div>
                        <div className="col-md-3">
                            <Input type="password" label="Confirm Password" placeholder="Confirm Password" onChange={(e)=> this.setState({ user :{ ...this.state.user, password2:e }}) } autoComplete="off"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <Input label="Birthdate" type="date" placeholder="Birthdate" _value={this.state.user.birth_date} autoComplete="off"
                                onChange={(e)=> this.setState({ user :{ ...this.state.user, birth_date:e }}) } />
                        </div>
                        <div className="col-md-9">
                            <Input label="Address" placeholder="Address" onChange={(e)=> this.setState({ user :{ ...this.state.user, address:e }}) } autoComplete="off"/>
                        </div>
                    </div>

                    <div class="m-accordion m-accordion--default" id="m_accordion_1" role="tablist" style={{color:"#555555"}}>            
                        <div class="m-accordion__item">
                            <div class="m-accordion__item-head collapsed" role="tab" id="m_accordion_1_item_1_head" data-toggle="collapse" href="#m_accordion_1_item_1_body" aria-expanded="false">
                                <span class="m-accordion__item-icon"><i class="fa flaticon-user-ok"></i></span>
                                <span class="m-accordion__item-title">Privacy Policy (Please read and agree to proceed with the registration)</span>
                                <span class="m-accordion__item-mode"></span>     
                            </div>

                            <div class="m-accordion__item-body collapse" id="m_accordion_1_item_1_body" role="tabpanel" aria-labelledby="m_accordion_1_item_1_head" data-parent="#m_accordion_1"> 
                                <div class="m-accordion__item-content"> 
                                    <div dangerouslySetInnerHTML={{ __html: this.state.policy }}/>
                                    <div className="text-left">
                                    I Agree to this privacy policy, and want to proceed with the registration<br/>
                                    <Toggle
                                        checked={ this.state.user.is_agreed }
                                        onChange={ (e)=> { this.setState({user:{...this.state.user, is_agreed: e.target.checked}}) }} 
                                    /></div>
                                    
                                </div>
                            </div>
                        </div>              
                    </div>
                </div>
                <div>
                    <button className="btn btn-warning btn-lg" disabled={!this.state.user.is_agreed} type="button" onClick={()=>this.register()} id="register-button">Register</button>
                </div>
            </div>
        );
    }
}

export default RegisterForm;