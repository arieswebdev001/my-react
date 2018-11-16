import React from 'react';
import {InputOptions} from '../../../config';

const TextArea = (props) => (
    <div className={ props.label !== undefined? InputOptions.containerClass:""}>
        { props.label !== undefined? <label>{ props.label } { props.required === true ? ' *':''} </label>:''}
        <textarea type={props.type} id={props._id} rows={props.rows===undefined?3:props.rows} className={InputOptions.inputClass} onChange={ (e)=> props.onChange(e.target.value) } value={props._value}></textarea>
    </div>
);

export default TextArea;