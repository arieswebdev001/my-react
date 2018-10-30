import React, { Component } from 'react';
import ImageGallery from "react-image-gallery";
import { ResourcesPath } from "../../../config";
import ItemRow from '../misc/ItemRow';

class ExtraDetails extends Component {
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
                        <ItemRow value={ this.props.extra.selling_price } label="Selling Price"/>   
                        <ItemRow value={ this.props.extra.pricing_type } label="Pricing Type"/>   
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