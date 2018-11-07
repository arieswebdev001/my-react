import React, { Component } from 'react';
import ItemRow from '../misc/ItemRow';
import GoogleMapReact from 'google-map-react';
import { GoogleApiKey, ResourcesPath } from '../../../config';
import ImageGallery from 'react-image-gallery';

class PropertyDetails extends Component {
    render(){
        const images = this.props.property.property_images.map((file)=>{
            return {
                original: ResourcesPath + '/images/properties/' + file,
                thumbnail: ResourcesPath + '/images/properties/' + file
            }
        });

        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="m-widget13">
                            <ItemRow value={ this.props.property.property_name } label="Property Name"/>  
                            <ItemRow value={ this.props.property.property_address } label="Property Address" />
                            <ItemRow value={ this.props.property.property_email } label="Email" />
                            <ItemRow value={ this.props.property.property_contact_number } label="Contact No." />
                            <ItemRow value={ this.props.property.property_contact_person } label="Contact Person"/>
                            <ItemRow value={ this.props.property.is_default===1?
                                                <span className="m-badge m-badge--success m-badge--wide">Yes</span>:
                                                <span className="m-badge m-badge--danger m-badge--wide">No</span>
                                            } 
                                label="Is Default"/>
                            <ItemRow value={ this.props.property.is_active===1?
                                                <span className="m-badge m-badge--success m-badge--wide">Active</span>:
                                                <span className="m-badge m-badge--danger m-badge--wide">Inactive</span>
                                            } 
                                label="Status" />
                            <ItemRow value={ this.props.property.currency } label="Currency"/>
                            <ItemRow value={ this.props.property.floor_count } label="Floor Count"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div style={{ height: '200px', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: GoogleApiKey }}
                                defaultCenter={ this.props.property.map_coordinates }
                                defaultZoom={16}>
                                    <img src={ ResourcesPath + "/images/app/marker.png"} alt="marker" style={{transform: 'translate(-50%, -100%)'}} lat={this.props.property.map_coordinates.lat} lng={this.props.property.map_coordinates.lng}/>
                            </GoogleMapReact>
                        </div>

                        <br/>
                        <ImageGallery items={images} showThumbnails={false} showBullets={true} slideInterval={5000}/>
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}

export default PropertyDetails;