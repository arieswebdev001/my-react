import React, { Component } from 'react';
import { connect } from 'react-redux';
import PricingTableEditable from '../../ui/tables/PricingTableEditable';
import { DateRange } from 'react-date-range';
import Input from '../../ui/controls/Input';
import TextArea from '../../ui/controls/TextArea';
import Axios from '../../../wrappers/Axios';
class Pricing extends Component {
    state = {
        regular_price:{
            default:{
                pricing_schedule:[0,0,0,0,0,0,0]
            },
            adult_child:[]
        },
        seasonal_prices:[],
        modal_title:'Add Seasonal Price',
        price:{
            pricing_schedule:[0,0,0,0,0,0,0]
        },
        dateRange: {
            selection: {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
            },
        },
    }

    handleChange(){
        this.setState({
            price:{
                ...this.state.price,
                pricing_name: window.$("#pricing_name").val(),
                notes: window.$("#notes").val(),
            }
        });
    }

    handleEditPrice(key, value){
        const newArray = this.state.price.pricing_schedule.map((item,k)=> {
            if(key === k)
                item = Number(value);

            return item;
        });

        this.setState({
            price:{
                ...this.state.price,
                pricing_schedule:newArray
            }
        });
    }

    handleEditCondition(value, field){
        this.setState({
            price:{
                ...this.state.price,
                pricing_condition:{
                    ...this.state.price.pricing_condition,
                    [field]:Number(value)
                }
            }
        });
    }

    refreshPricing(){
        var seasonal_prices = []; 
        this.props.room_type.pricing.filter((item)=> (item.pricing_type !== 'REGULAR' && item.pricing_type !== 'REGULAR_AD') )
            .forEach((item)=>{
                item.season_code = item.pricing_name.replace(" ", "_");

                var key = seasonal_prices.findIndex((i)=>(i.season_code === item.season_code));

                if( key !== -1)
                    seasonal_prices[key].adult_child.push(item);
                else
                    seasonal_prices.push({
                        season_name:item.pricing_name,
                        season_code:item.season_code,
                        default:item,
                        from:item.start_date,
                        to:item.end_date,
                        adult_child:[]
                    });
            });

        this.setState({
            regular_price:{
                default: this.props.room_type.pricing.find((item)=> item.pricing_type === 'REGULAR'),
                adult_child: this.props.room_type.pricing.filter((item)=> item.pricing_type === 'REGULAR_AD')
            },
            seasonal_prices:seasonal_prices
        });
    }

    componentDidMount(){
        this.refreshPricing();
    }

    componentWillReceiveProps(){
        this.refreshPricing();
    }

    addPrice(){
        window.$("#pricing-modal").modal("show");
        this.setState({
            modal_title:'Add Seasonal Price',
            price:{
                id:0,
                start_date:window.moment().format("YYYY-MM-DD"),
                end_date:window.moment().format("YYYY-MM-DD"),
                pricing_condition:{},
                pricing_schedule:[0,0,0,0,0,0,0],
                pricing_name:'',
                pricing_type:'SEASONAL',
                notes:"",
                room_type_id:this.props.room_type.id
            }
        });
    }

    handleRangeChange(which, payload) {
        this.setState({
            [which]: {
            ...this.state[which],
            ...payload,
            },
            price:{
                ...this.state.price,
                start_date:window.moment(payload.selection.startDate).format("YYYY-MM-DD"),
                end_date:window.moment(payload.selection.endDate).format("YYYY-MM-DD")
            }
        });
    }

    savePrice(){
        let u = this;
        Axios.post('../../api/price', this.state.price)
        .then(() => {
            window.toastr.success("Successfully saved.");
            u.props.onSave();
            window.$("#pricing-modal").modal("hide");
            window.$("#adult-child-modal").modal("hide");
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

    addModal(season_name){
        window.$("#adult-child-modal").modal("show");
        this.setState({
            price:{
                id:0,
                start_date:window.moment().format("YYYY-MM-DD"),
                end_date:window.moment().format("YYYY-MM-DD"),
                pricing_condition:{
                    adult:2,
                    child:2
                },
                pricing_schedule:[0,0,0,0,0,0,0],
                pricing_name:season_name === undefined?'Regular':season_name,
                pricing_type:season_name === undefined?'REGULAR_AD':'SEASONAL_AD',
                notes:"",
                room_type_id:this.props.room_type.id
            }
        });
    }

    render() {
        return (
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active regular" data-toggle="tab" href="#regular">Regular </a>
                    </li>
                    {
                        this.state.seasonal_prices.map((item, key)=>
                            <li className="nav-item" key={key}>
                                <a className="nav-link" data-toggle="tab" href={"#"+item.season_code}>{ item.season_name }</a>
                            </li>
                        )
                    }
                    <li className="nav-item">
                        <button className="btn btn-info nav-link" onClick={()=>this.addPrice()} style={{color:"white"}}> + </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane active regular" id="regular" role="tabpanel">
                        <PricingTableEditable pricing={[this.state.regular_price.default]} title="Default Price" showDelete={false} 
                            onClick={ (e)=>this.editPrice(e) } showCondition={false} onSave={ ()=>this.props.onSave() }/>

                        <PricingTableEditable pricing={this.state.regular_price.adult_child} title="Pricing Based on Adult & Child count" 
                            onAdd={(e)=>this.addModal(e)} showDelete={true} onClick={ (e)=>this.editPrice(e) } showCondition={true} onSave={ ()=>this.props.onSave() }/>
                    </div>
                    {
                    this.state.seasonal_prices.map((item)=>
                        <div className="tab-pane" id={item.season_code} role="tabpanel" key={item.season_code}>
                            <PricingTableEditable pricing={[item.default]} title={"Seasonal Price ("+ item.from +" to " +item.to +")"} 
                                showDelete={true} showCondition={false} onSave={ ()=>this.props.onSave() } />

                            <PricingTableEditable pricing={item.adult_child} title="Pricing Based on Adult & Child count" name={item.season_name}
                                showDelete={true} onAdd={(e)=>this.addModal(e)} showCondition={true} onClick={ (e)=>this.editPrice(e) } onSave={ ()=>this.props.onSave() }/>
                        </div>)
                    }
                </div>

                <div className="modal fade" id="pricing-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> { this.state.modal_title } </h5>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-5">
                                        <Input _value={ this.state.price.pricing_name } label="Season Name" _id="pricing_name" onChange={()=>this.handleChange() }/>
                                    </div>
                                    <div className="col-md-7">
                                        <TextArea label="Notes" _id="notes" _value={ this.state.price.notes } onChange={()=>this.handleChange() } />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-5">
                                        <div className="form-group">
                                            <label>Season Coverage</label>
                                            <DateRange 
                                                onChange={this.handleRangeChange.bind(this, 'dateRange')}
                                                moveRangeOnFirstSelection={false}
                                                ranges={[this.state.dateRange.selection]}
                                                className={'PreviewArea'}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <label>Pricing</label>
                                        <div className="row">
                                            {
                                                ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((item, key)=>(
                                                    <div className="col-md-3" key={key}>
                                                        <Input type="number" label={item} _value={ this.state.price.pricing_schedule[key] } 
                                                            onChange={ (e)=> this.handleEditPrice(key, e.target.value) } />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success btn-sm" onClick={ ()=>this.savePrice() }>Save</button>
                                <button className="btn btn-sm" onClick={ ()=> window.$("#pricing-modal").modal("hide") }>Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="adult-child-modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> Add Adult & Child Pricing {this.state.price.pricing_name===''?'':' ('+ this.state.price.pricing_name +')' }</h5>
                            </div>
                            {
                                this.state.price.pricing_condition !== undefined? 
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Input type="number" label="Adult" onChange={ (e)=> this.handleEditCondition(e.target.value, 'adult') } 
                                                _value={ this.state.price.pricing_condition.adult }  />
                                        </div>
                                        <div className="col-md-6">
                                            <Input type="number" label="Child" onChange={ (e)=> this.handleEditCondition(e.target.value, 'child') } 
                                                _value={ this.state.price.pricing_condition.child }  />
                                        </div>
                                    </div>
                                    <label>Pricing</label>
                                    <div className="row">

                                    {
                                        ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((item, key)=>(
                                            <div className="col-md-3" key={key}>
                                                <Input type="number" label={item} _value={ this.state.price.pricing_schedule[key] } 
                                                    onChange={ (e)=> this.handleEditPrice(key, e.target.value) } />
                                            </div>
                                        ))
                                    }
                                    </div>
                                </div>:''
                            }
                            <div className="modal-footer">
                                <button className="btn btn-success btn-sm" onClick={ ()=>this.savePrice() } >Save</button>
                                <button className="btn btn-sm" onClick={ ()=> window.$("#adult-child-modal").modal("hide") }>Close</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        room_type:state.room_type
    }
};

export default connect(mapStateToProps, null)(Pricing);