import React, { Component } from 'react';
import Input from '../controls/Input';
import Axios from '../../../wrappers/Axios';

class PricingTableEditable extends Component {
    dayOfWeek() {
        return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    }

    state = {
        editing:{
            id:null
        }
    }

    handleEditPrice(key, value){
        const newArray = this.state.editing.pricing_schedule.map((item,k)=> {
            if(key === k)
                item = Number(value)  ;

            return item;
        });

        this.setState({
            editing:{
                ...this.state.editing,
                pricing_schedule:newArray
            }
        });
    }

    handleEditCondition(value, field){
        this.setState({
            editing:{
                ...this.state.editing,
                pricing_condition:{
                    ...this.state.editing.pricing_condition,
                    [field]:Number(value)
                }
            }
        });
    }

    updatePrice(){
        let u = this;
        Axios.put('../../api/price', this.state.editing)
        .then(() => {
            window.toastr.success("Successfully updated.");
            u.props.onSave();
            u.setState({editing:{id:null}});
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
        });
    }

    deleteSeason(){
        if(!window.confirm("Are you sure you want to delete this?"))
            return false;

        let u = this;
        Axios.delete('../../api/price/' + this.props.pricing[0].id)
        .then((response) => {
            window.toastr.success("Successfully deleted.");
            u.props.onSave();
            u.setState({editing:{id:null}});
            if(response.data.reset)
                window.$(".regular").addClass("active");
        }).catch(function (error) {
            if(!error.response)
                window.toastr.error("Please check internet connectivity", "Network Error");
            else{
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        window.toastr.error(error.response.data.message);
            }
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="alert alert-info">
                            { this.props.title } <small style={{float:"right"}}>(Price per night)</small>
                            { this.props.onAdd !== undefined ? <button className="btn btn-primary btn-sm" onClick={()=>this.props.onAdd(this.props.name)}>Add</button>:'' }
                        </div>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                { this.props.showCondition?<th className="colorized">Adult</th>:null }
                                { this.props.showCondition?<th className="colorized">Child</th>:null }
                                { this.dayOfWeek().map((item, key)=> <th key={key}>{ item }</th> ) }
                                <th style={{width:30}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.pricing.map((price,k)=>{
                                    return price.id !== this.state.editing.id ? 
                                        <tr key={k}>
                                            { this.props.showCondition? <td className="colorized">{ price.pricing_condition.adult }</td>:null }
                                            { this.props.showCondition? <td className="colorized">{ price.pricing_condition.child }</td>:null }
                                            { this.dayOfWeek().map((item, key)=> <td key={key}>{ price.pricing_schedule[key] }</td> ) }
                                            <td>
                                                <button className="btn btn-info btn-sm" onClick={ ()=> this.setState({ editing:price }) }><i className="la la-pencil-square"></i></button>
                                                { this.props.showDelete ? <button className="btn btn-danger btn-sm" onClick={()=>this.deleteSeason() } ><i className="la la-trash"></i></button>:'' }
                                            </td>
                                        </tr>:
                                        <tr key={k}>
                                            { this.props.showCondition? <td className="colorized">
                                                <Input type="number"_value={ this.state.editing.pricing_condition.adult} 
                                                        onChange={ (e)=> this.handleEditCondition(e.target.value, 'adult') } />
                                            </td>:null }
                                            { this.props.showCondition? <td className="colorized">
                                                <Input type="number"_value={ this.state.editing.pricing_condition.child } 
                                                        onChange={ (e)=> this.handleEditCondition(e.target.value, 'child') } />
                                            </td>:null }
                                            { 
                                                this.dayOfWeek().map((item, key)=> 
                                                <td key={key}>
                                                    <Input type="number"_value={ this.state.editing.pricing_schedule[key] } 
                                                        onChange={ (e)=> this.handleEditPrice(key, e.target.value) } />
                                                </td>) 
                                            }
                                            <td>
                                                <button className="btn btn-warning btn-sm" onClick={ ()=> this.setState({ editing:{id:null} }) }><i className="la la-ban"></i></button>
                                                <button className="btn btn-success btn-sm" onClick={ ()=> this.updatePrice() }><i className="la la-check"></i></button>
                                            </td>
                                        </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default PricingTableEditable;