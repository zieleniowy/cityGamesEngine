import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { useSelector } from 'react-redux';
export default function ItemSelect(props){
    const {items, label} = useSelector(state=>({ items: state.inventory.items||{}, label: state.i18n.inventory.chooseItem }));
    const handleChange = e=>props.onChange(e.target.value);
    return <TextField 
                label={props.label||label}
                value={props.item}
                select
                fullWidth
                onChange={handleChange}
                variant={props.variant||'outlined'}
            >
            {Object.keys(items).map(itemID=><MenuItem value={itemID} key={itemID}>{items[itemID].name}</MenuItem> )}
        </TextField>
}