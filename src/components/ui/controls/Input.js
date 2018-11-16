import React from 'react';
import {InputOptions} from '../../../config';

const Input = (props) => (
    <div className={ props.label !== undefined? InputOptions.containerClass:""}>
        { props.label !== undefined? <label>{ props.label } { props.required === true ? ' *':''} </label>:''}
        <input disabled={props.disabled} type={props.type} id={props._id} className={InputOptions.inputClass} value={props._value} onChange={ (e)=> props.onChange(e.target.value) }/>
    </div>
);

export default Input;