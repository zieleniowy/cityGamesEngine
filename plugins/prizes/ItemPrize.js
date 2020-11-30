import React from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

export default function ItemPrize(props){
    const { Select, Amount } = useSelector(state=>({ Select: state.components.ItemSelect$inventory.component, Amount: state.components.TextField$prizes.component }));
    const handleItemChange = item => props.setPrize({ ...props.prize, item });
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Select variant="outlined" onChange={handleItemChange} item={props.prize.item||''} />
            </Grid>
            <Grid item xs={6}>
                <Amount k="quantity" label="global.amount" prize={props.prize} setPrize={props.setPrize} i18n={props.i18n} />
            </Grid>
        </Grid>
    )
}