import React from 'react';
import {TextField} from '@material-ui/core';
import { path } from 'ramda';

export default function PrizeTextField(props){
    const handleChange = e => props.setPrize({...props.prize, [props.k]: e.target.value })
    return (
        <TextField 
                label={path(props.label.split('.'), props.i18n)}
                fullWidth={typeof props.fullWidth === 'undefined'?true:props.fullWidth}
                value={props.prize[props.k]||0}
                variant="outlined"
                onChange={handleChange}
        />

    )
}