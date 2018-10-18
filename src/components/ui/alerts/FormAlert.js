import React from 'react';

const FormAlert = (props) => (
    <div className="alert alert-danger m-alert--outline" role="alert">
        <strong>Errors!</strong> { props.errors }					  	
    </div>
);

export default FormAlert;