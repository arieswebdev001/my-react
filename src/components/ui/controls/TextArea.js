import React from 'react';
import {InputOptions} from '../../../config';

const TextArea = (props) => (
    <div className={InputOptions.containerClass}>
        { props.label !== undefined? <label>{ props.label }</label>:''}
        <textarea type={props.type} id={props._id} rows={props.rows===undefined?3:props.rows} className={InputOptions.inputClass} onChange={props.onChange} value={props._value}></textarea>
    </div>
);

export default TextArea;