import React from 'react';

const ToolTipAlert = (props) => (
    <div className="m-alert m-alert--icon m-alert--icon-solid m-alert--outline alert alert-info" role="alert">
        <div className="m-alert__icon">
            <i className="flaticon-exclamation-2"></i>
            <span></span>
        </div>
        <div className="m-alert__text">
            { props.title } { props.content }
        </div>	        
    </div>
);

export default ToolTipAlert;