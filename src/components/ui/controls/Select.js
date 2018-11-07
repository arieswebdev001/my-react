import React from 'react';
import {InputOptions} from '../../../config';

const Select = (props) => (
    <div className={InputOptions.containerClass}>
        { props.label !== undefined? <label>{ props.label }</label>:''}
        <select id={props._id} className={InputOptions.inputClass} value={props._value} onChange={props.onChange}>
            {
                props.selection.map((item)=>{
                    return <option key={item.value} value={item.value}>{ item.label }</option>
                })
            }
        </select>
    </div>
);

export default Select;