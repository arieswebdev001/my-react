import React from 'react';
import {ItemRowOptions} from '../../../config';

const ItemRow = (props) => (
    <div className={ItemRowOptions.containerClass}>
        <span className={ItemRowOptions.labelClass}>
        { props.label }
        </span>
        <span className={ItemRowOptions.valueClass}>
        { props.value }				 
        </span>
    </div>
);

export default ItemRow;