import React, { Component } from 'react';
import Input from '../ui/controls/Input';
import Select from '../ui/controls/Select';
import ReactSelect from 'react-select';
import {CountryList} from '../../config'
class GuestDetails extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-3">
                        <Select selection={['','Mr.', 'Ms.', 'Engr.', 'Dr.','Prof.']} required={true}
                                label="Title" _value={ this.props.guest.title }  onChange={ (e)=> this.props.onUpdate(e, 'title') } />
                    </div>
                    <div className="col-lg-3">
                        <Input label="First Name" _value={ this.props.guest.first_name } required={true} onChange={ (e)=> this.props.onUpdate(e, 'first_name') } />
                    </div>
                    <div className="col-lg-3">
                        <Input label="Middle Name" _value={ this.props.guest.middle_name } onChange={ (e)=> this.props.onUpdate(e, 'middle_name') } />
                    </div>
                    <div className="col-lg-3">
                        <Input label="Last Name" _value={ this.props.guest.last_name } required={true} onChange={ (e)=> this.props.onUpdate(e, 'last_name') } />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Input label="Birth Date" type="date" _value={ this.props.guest.birth_date } onChange={ (e)=> this.props.onUpdate(e, 'birth_date') } />
                    </div>
                    <div className="col-md-3">
                        <Input label="Company Name" _value={ this.props.guest.company_name } onChange={ (e)=> this.props.onUpdate(e, 'company_name') } />
                    </div>
                    <div className="col-md-3">
                        <Input label="Position" _value={ this.props.guest.position } onChange={ (e)=> this.props.onUpdate(e, 'position') } />
                    </div>
                    <div className="col-md-3">
                        <Input label="Email" _value={ this.props.guest.email } onChange={ (e)=> this.props.onUpdate(e, 'email') } />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Input label="Mobile" _value={ this.props.guest.mobile } onChange={ (e)=> this.props.onUpdate(e, 'mobile') } />
                    </div>
                    <div className="col-md-9">
                        <Input label="Address" _value={ this.props.guest.address } onChange={ (e)=> this.props.onUpdate(e, 'address') } />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Input label="City" _value={ this.props.guest.city } onChange={ (e)=> this.props.onUpdate(e, 'city') } />
                    </div>
                    <div className="col-md-3">
                        <Input label="State" _value={ this.props.guest.state } onChange={ (e)=> this.props.onUpdate(e, 'state') } />
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Country *</label>
                            <ReactSelect options={CountryList.map((o)=>({label:o,value:o}))} value={{value:this.props.guest.country, label:this.props.guest.country}} 
                                onChange={ (e)=> this.props.onUpdate(e.value, 'country')}/>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <Input label="Zip Code" _value={ this.props.guest.zip_code } onChange={ (e)=> this.props.onUpdate(e, 'zip_code') } />
                    </div>
                </div>
            </div>
        );
    }
}
export default GuestDetails;