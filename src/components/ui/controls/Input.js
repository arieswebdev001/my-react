import React from 'react';
import {InputOptions} from '../../../config';

const Input = (props) => (
    <div className={InputOptions.containerClass}>
        { props.label !== undefined? <label>{ props.label }</label>:''}
        <input type={props.type} id={props._id} className={InputOptions.inputClass} value={props._value} onChange={props.onChange}/>
    </div>
);

export default Input;