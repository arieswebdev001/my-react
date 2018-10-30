import React, { Component } from 'react';
import { ResourcesPath } from '../../../config';
import ImageGallery from 'react-image-gallery';

class PropertyDetails extends Component {
    render(){
        const image = [{
            original: ResourcesPath + '/images/facilities/' + this.props.facility.facility_image
        }];

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="m-widget13">
                            <p>{ this.props.facility.facility_description }</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {
                            this.props.facility.facility_image !== ""?  <ImageGallery items={image} showPlayButton={false} showThumbnails={false} /> :''
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default PropertyDetails;