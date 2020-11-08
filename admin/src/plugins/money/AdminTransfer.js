import React from 'react';
import PlayerSelect from '../../components/PlayerSelect';
import {Container, TextField, IconButton, Box, Grid } from '@material-ui/core';
import { Redeem } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import BorderedPanel from '../../components/BorderedPanel';
export default withSnackbar((props)=>{
    const [player, setPlayer] = React.useState("");
    const handleTransfer = e =>{
        window.cmd('money_give', { player, amount: ref.value*1 })
            .then(result=>props.enqueueSnackbar("Przelew przeszedł", { variant: 'success' }))
            .catch(msg=>props.enqueueSnackbar(msg, { variant: 'error' }))
        e.preventDefault();
    }
    let ref;
    return (
            <Container maxWidth="sm">
                    <BorderedPanel color="primary" title={window.i18n.money.transfer}>
                        <Box p={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <PlayerSelect label="gracz" onChange={setPlayer} player={player} />
                                </Grid> 
                                <Grid item xs={12} sm={6}>
                                    <TextField inputRef={r=>ref=r} label="ilość" defaultValue={0} />
                                    <IconButton onClick={handleTransfer}><Redeem/></IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </BorderedPanel>
            </Container>
    )
})