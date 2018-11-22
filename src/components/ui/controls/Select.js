import React from 'react';
import {InputOptions} from '../../../config';

const Select = (props) => (
    <div className={ props.label !== undefined? InputOptions.containerClass:""}>
        { props.label !== undefined? <label>{ props.label } { props.required === true ? ' *':''} </label>:''}

        <select disabled={props.disabled===true} id={props._id} className={InputOptions.inputClass} value={props._value} onChange={ (e)=> props.onChange(e.target.value) }>
            {
                props.selection.map((item)=>{
                    return <option key={item.value !== undefined?item.value:item} value={item.value !== undefined?item.value:item}>{ item.label !== undefined?item.label:item }</option>
                })
            }
        </select>
    </div>
);

export default Select;