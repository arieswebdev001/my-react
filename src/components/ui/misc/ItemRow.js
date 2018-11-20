import React from 'react';
import {ItemRowOptions} from '../../../config';
import NumberFormat from 'react-number-format';


const ItemRow = (props) => (
    <div className={ItemRowOptions.containerClass}>
        <span className={ItemRowOptions.labelClass}>
        { props.label }
        </span>
        <span className={ItemRowOptions.valueClass} style={{textAlign:props.textAlign}}>
        { 
            props.type ==='money'?
                <NumberFormat value={props.value} displayType={'text'} thousandSeparator={true} prefix={'PHP '} />:
                props.value
        }				 
        </span>
    </div>
);

export default ItemRow;