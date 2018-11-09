import React, { Component } from 'react';
import ImageGallery from "react-image-gallery";
import { ResourcesPath } from "../../../config";
import ItemRow from '../misc/ItemRow';

class ExtraDetails extends Component {
    getPricingType(){
        if(this.props.extra.pricing_type === 'per_head_per_day')
            return 'Per Head/Per Day';
        else if(this.props.extra.pricing_type === 'per_head')
            return 'Per Head';
        else if(this.props.extra.pricing_type === 'per_day')
            return 'Per Day';
        else if(this.props.extra.pricing_type === 'per_booking')
            return 'Per Booking';
    }

    render() {
        const image = [{
            original: ResourcesPath + '/images/extras/' + this.props.extra.extra_image
        }];

        return (
            <div className="row">
                <div className="col-md-7">
                    <div className="m-widget13">
                        <ItemRow value={ this.props.extra.extra_name } label="Extra Name"/>  
                        <ItemRow value={ this.props.extra.extra_description } label="Description"/>  
                        <ItemRow value={ this.props.extra.extra_type } label="Type"/> 
                        <ItemRow value={ this.props.extra.unit_price } label="Unit Price"/>  
                        <ItemRow value={ this.props.extra.selling_price } label="Selling Price"/>   
                        <ItemRow value={ this.getPricingType() } label="Pricing Type"/>   
                        <ItemRow value={ this.props.extra.with_vat===1?
                                        <span className="m-badge m-badge--success m-badge--wide">Yes</span>:
                                        <span className="m-badge m-badge--danger m-badge--wide">No</span>
                                    } 
                        label="With Vat" />
                        <ItemRow value={ this.props.extra.is_active===1?
                                        <span className="m-badge m-badge--success m-badge--wide">Active</span>:
                                        <span className="m-badge m-badge--danger m-badge--wide">Inactive</span>
                                    } 
                        label="Status" />
                    </div>
                </div>
                <div className="col-md-5">
                    { this.props.extra.extra_image !== "" ? <ImageGallery items={image} showPlayButton={false} showThumbnails={false} /> : '' }
                </div>
            </div>
        );
    }
}

export default ExtraDetails;