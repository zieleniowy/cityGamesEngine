import React from 'react';
import {TextField, MenuItem} from '@material-ui/core';

export default props =>{
    const handleChange = e => props.onChange(e.target.value);
    return (
        <TextField
            label={props.label||window.i18n.quests.status}
            value={props.status||""}
            onChange={handleChange}
            select
            fullWidth
        >
            <MenuItem value="inactive">{window.i18n.quests.inactive}</MenuItem>
            <MenuItem value="active">{window.i18n.quests.active}</MenuItem>
            <MenuItem value="completed">{window.i18n.quests.completed}</MenuItem>
            <MenuItem value="failed">{window.i18n.quests.failed}</MenuItem>

        </TextField>
    )
}