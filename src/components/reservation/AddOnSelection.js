import React, { Component } from 'react';
import MultiSelect from "@kenshooui/react-multi-select";

class AddOnSelection extends Component {
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
        const extras = this.props.extras.map((extra)=>{
            return {
                label:extra.extra_name + " (PHP "+ extra.selling_price +" "+ extra.pricing_type +")  "+ this.getComputation(extra, 'label') +" " ,
                description:extra.extra_name + " ("+ extra.pricing_type +")",
                id: extra.id, 
                price: extra.selling_price,
                pricing_type: extra.pricing_type,
                total:this.getComputation(extra, 'value'),
                quantity: this.getComputation(extra, 'value')/extra.selling_price
            }
        });

        return (
            <div>
                <h5> Add-ons</h5>
                <MultiSelect
                    items={extras}
                    selectedItems={this.props.bookedExtras}
                    onChange={(e)=>this.props.onUpdate(e)}
                    showSelectedItems={false}
                    height={200}
                />
            </div>
        );
    }
}
export default AddOnSelection;