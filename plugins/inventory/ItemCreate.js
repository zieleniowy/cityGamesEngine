import React from 'react';
import BorderedPanel from '../../components/BorderedPanel';
import Extensions from '../../components/Extensions';
import {Container, TextField, MenuItem, Box} from '@material-ui/core';
import { useSelector } from 'react-redux';

export default props => {
    const {i18n, extensions} = useSelector(state=>({ i18n: state.i18n.inventory, extensions: state.inventory.extensions.itemCreate }));
    const [item, setItem] = React.useState({ name: '' });

    const handleNameChange = e => setItem({ ...item, name: e.target.value });

    return (
        <Container maxWidth="sm">
            <BorderedPanel color="primary" title={i18n.createItem}>
                <Box p={2}>
                    <TextField 
                        fullWidth
                        label={i18n.itemName}
                        value={item.name}
                        onChange={handleNameChange}                        
                    />
                    <Extensions data={{item, setItem}} extensions={extensions} />
                </Box>
            </BorderedPanel>
        </Container>
    )
}