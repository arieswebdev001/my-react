import React, { Component } from 'react';
import { ResourcesPath } from "../../config";
import NumberFormat from 'react-number-format';
import Input from '../../components/ui/controls/Input';

class AddOnSelectionClient extends Component {
    state={
        show_info_index: 0,
        quantity:0
    }

    addExtra(extra){
        var find = this.props.bookedExtras.find((i)=>extra.id===i.id) ;
        if(find === undefined)
            this.props.onUpdate([
                ...this.props.bookedExtras,
                {
                    label:extra.extra_name + " (PHP "+ extra.selling_price +" "+ extra.pricing_type +")" ,
                    description:extra.extra_name + " ("+ extra.pricing_type +")",
                    id: extra.id, 
                    price: extra.selling_price,
                    pricing_type: extra.pricing_type,
                    total: extra.selling_price * this.state.quantity,
                    quantity: this.state.quantity
                }
            ]);
        else{
            const newArray = this.props.bookedExtras.map((i)=>{
                if(i.id === find.id){
                    i.quantity = this.state.quantity;
                    i.total = this.state.quantity * i.price;
                }

                return i;
            });
            this.props.onUpdate(newArray);
        }
    }

    getComputation(extra, what){
        if(extra.pricing_type==='Per Day')
            return what==='value'?this.props.nights * extra.selling_price: (" * (" + this.props.nights + ") = " + ( this.props.nights * extra.selling_price ).toFixed(2))
        else if(extra.pricing_type==='Per Head')
            return what==='value'? ( this.getOccupantCount() * extra.selling_price ):(" * (" + this.getOccupantCount() + ") = " + ( this.getOccupantCount() * extra.selling_price ).toFixed(2))
        else if(extra.pricing_type==='Per Head/Day')
            return what==='value'?(this.props.nights * this.getOccupantCount()) * extra.selling_price :(" * (" + this.getOccupantCount() + ") * (" + this.props.nights + ") = " + ((this.props.nights * this.getOccupantCount()) * extra.selling_price ).toFixed(2))
        else if(extra.pricing_type==='Per Booking')
            return what==='value'? extra.selling_price:(" = " +  extra.selling_price.toFixed(2));
    }

    getOccupantCount(){
        var x = 0;
        this.props.bookedRooms.forEach((item)=>{
            if(item.value !== 0)
                x+= (item.child + item.adults);
        });
        return x;
    }

    render() {
        const extraSelected = this.props.extras[this.state.show_info_index];
        return (
            <div>
                <div className="row">
                    {
                        this.props.extras.map((extra, key)=>
                            <div className="col-md-3" key={extra.id}>
                                <button onClick={()=>this.setState({ show_info_index:key })} className={"btn btn-block " + (this.state.show_info_index === key?'btn-warning':'btn-info')}>
                                    {extra.extra_name}
                                </button>
                            </div>
                        )
                    }
                </div>
                {
                    extraSelected !== undefined ?
                        <div className="row" style={{paddingTop:20}}>
                            <div className="col-md-5">
                                <img src={ ResourcesPath + "/images/extras/" + extraSelected.extra_image} alt="Room" className="img img-responsive" style={{ width:"100%", marginBottom:10 }}/>
                                <div className="row" >
                                    <div className="col-md-5">
                                        <Input label="&nbsp;" type="number" _value={ this.state.quantity } onChange={ (e)=> this.setState({quantity:Number(e)}) } />
                                    </div>
                                    <div className="col-md-7">
                                        <label>&nbsp;</label>
                                        <button disabled={this.state.quantity === 0} onClick={()=>this.addExtra(extraSelected)} className="btn btn-block btn-warning">Avail</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7">
                                <h4>{ extraSelected.extra_name }</h4>
                                <p>
                                    { extraSelected.extra_description } 
                                </p>
                                <h5>
                                    Price:  <NumberFormat value={ extraSelected.selling_price } displayType={'text'} thousandSeparator={true} prefix={'PHP '} />  ({ extraSelected.pricing_type })
                                </h5>
                            </div>
                        </div>:null
                }
            </div>
        );
    }
}
export default AddOnSelectionClient;