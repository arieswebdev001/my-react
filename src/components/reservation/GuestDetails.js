import React, { Component } from 'react';
import Input from '../ui/controls/Input';
import Select from '../ui/controls/Select';
import ReactSelect from 'react-select';
import {CountryList} from '../../config'
import Toggle from 'react-toggle';
import AsyncSelect from 'react-select/lib/Async';
import Axios from '../../wrappers/Axios';
class GuestDetails extends Component {
    state = {
        members:[]
    };

    loadOptions(inputValue, callback){
        let u = this;
        Axios.get('api/members/' + inputValue)
            .then(function (response) {
                u.setState({members:response.data});
            });
        callback(this.state.members);
    }

    handleChange(e){
        this.props.onMemberSelect(e);
    }

    render() {
        return (
            <div>
                {
                    this.props.userType === 'guest' && this.props.is_member?
                        <div className="alert alert-info">You must Login to edit your profile.</div>:null
                }
                {
                    this.props.userType === 'admin'?
                        <div className="row">
                            <div className="col-lg-3">
                                <label> Member</label>
                                <br/>
                                <Toggle
                                    checked={ this.props.is_member }
                                    onChange={ (e)=> {this.props.onToggle(e.target.checked);}} 
                                />
                            </div>
                            {
                                this.props.is_member?
                                    <div className="col-lg-3">
                                        <label> Member Lookup</label>
                                        <AsyncSelect
                                            loadOptions={this.loadOptions.bind(this)}
                                            defaultOptions={this.state.members}
                                            onInputChange={this.handleInputChange}
                                            onChange={(e)=>this.handleChange(e)}
                                        />
                                    </div>:null
                            }
                        </div>:null
                }
                <div className="row">
                    <div className="col-lg-3">
                        <Select selection={['','Mr.', 'Ms.', 'Engr.', 'Dr.','Prof.']} required={true} disabled={this.props.is_member}
                                label="Title" _value={ this.props.guest.title }  onChange={ (e)=> this.props.onUpdate(e, 'title') } />
                    </div>
                    <div className="col-lg-3">
                        <Input label="First Name" _value={ this.props.guest.first_name }  disabled={this.props.is_member} required={true} onChange={ (e)=> this.props.onUpdate(e, 'first_name') } />
                    </div>
                    <div className="col-lg-3">
                        <Input label="Middle Name" _value={ this.props.guest.middle_name } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'middle_name') } />
                    </div>
                    <div className="col-lg-3">
                        <Input label="Last Name" _value={ this.props.guest.last_name } disabled={this.props.is_member} required={true} onChange={ (e)=> this.props.onUpdate(e, 'last_name') } />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Input label="Birth Date" type="date" _value={ this.props.guest.birth_date } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'birth_date') } />
                    </div>
                    <div className="col-md-3">
                        <Input label="Company Name" _value={ this.props.guest.company_name } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'company_name') } />
                    </div>
                    <div className="col-md-3">
                        <Input label="Position" _value={ this.props.guest.position } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'position') } />
                    </div>
                    <div className="col-md-3">
                        <Input label="Email" required={true} _value={ this.props.guest.email } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'email') } />
                    </div>
                </div>
                {
                    this.props.userType === 'guest' && this.props.booking.id===0?
                        <div className="row">
                            <div className="col-lg-3">
                                <label> Sign up as Member?</label>
                                <br/>
                                <Toggle
                                    checked={ this.props.signup }
                                    onChange={ (e)=> {this.props.onToggle(e.target.checked);}} 
                                />
                            </div>
                            {
                                this.props.signup?
                                    <div className="col-lg-3">
                                        <Input label="Password" type="password" _value={ this.props.guest.password } onChange={ (e)=> this.props.onUpdate(e, 'password') } />
                                        {
                                            this.props.guest.password !== ''?
                                                    (
                                                        this.props.guest.password === this.props.guest.confirm_password?
                                                            <div className="badge badge-success">Password Matched</div>:
                                                            <div className="badge badge-danger">Password Not Matched</div>
                                                    ):null
                                        }
                                        <br/>
                                    </div>:null
                            }
                            {
                                this.props.signup?
                                    <div className="col-lg-3">
                                        <Input label="Confirm Password" type="password" _value={ this.props.guest.confirm_password } onChange={ (e)=> this.props.onUpdate(e, 'confirm_password') } />
                                    </div>:null
                            }
                        </div>:null
                }
                <div className="row">
                    <div className="col-md-3">
                        <Input label="Mobile" _value={ this.props.guest.mobile } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'mobile') } />
                    </div>
                    <div className="col-md-9">
                        <Input label="Address" _value={ this.props.guest.address } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'address') } />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Input label="City" _value={ this.props.guest.city } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'city') } />
                    </div>
                    <div className="col-md-3">
                        <Input label="State" _value={ this.props.guest.state } disabled={this.props.is_member} onChange={ (e)=> this.props.onUpdate(e, 'state') } />
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Country *</label>
                            <ReactSelect  isDisabled={this.props.is_member} options={CountryList.map((o)=>({label:o,value:o}))} value={{value:this.props.guest.country, label:this.props.guest.country}} 
                                onChange={ (e)=> this.props.onUpdate(e.value, 'country')}/>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <Input label="Zip Code"  disabled={this.props.is_member} _value={ this.props.guest.zip_code } onChange={ (e)=> this.props.onUpdate(e, 'zip_code') } />
                    </div>
                </div>
            </div>
        );
    }
}
export default GuestDetails;