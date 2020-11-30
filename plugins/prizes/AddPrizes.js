import React from 'react';
import { TextField, MenuItem, IconButton, Grid, Typography, Divider, Box } from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { useSelector } from 'react-redux'; 
import { path } from 'ramda';

const flexGrow = { flexGrow: 1 };

// const sanitizePrizes = quest=>({
//     ...quest,
//     prizes: quest.prizes.map(prize=>({ id: prize.id, type: prize.type.id,  }))
// })

// window.onStoreReady(store=>store.dispatch({ 
//     type: "APPLY", 
//     payload: state=>({
//         quests: {
//             ...state.quests,
//             sanitizeFlow: [...state.quests.sanitizeFlow, sanitizePrizes]
//         }
//     })
// }));

export default function AddPrize(props){
    const types = useSelector(state=>state.prizes.types);
    const i18n = useSelector(state=>state.i18n);
    const prizes = props.prizes||[];
    // const setPrizes = (prizes)=>props.setQuest({ ...props.quest, prizes });
    const setPrizes = props.setPrizes;

    const [selected, setSelected] = React.useState('');
    const handleTypeChange = e => setSelected(e.target.value);

    const handleAddPrize = e => {
        if(selected) setPrizes([...prizes, { id: window.genid(), type: types.find(t=>t.id===selected).id }]);
    }
    const handlePrizeChange = id=>newPrize=> {
        const index = prizes.findIndex(p=>p.id===id);
        const curPrize = prizes[index]; 
        setPrizes([...prizes.slice(0, index), { ...curPrize,  ...newPrize },...prizes.slice(index+1)]);

    };
    const handlePrizeRemove = id => e =>{
        const index = prizes.findIndex(p=>p.id===id);
        setPrizes([...prizes.slice(0, index), ...prizes.slice(index+1)]);
    }

    return (
        <>
            <Grid container alignItems="center">
                <Grid item style={flexGrow}>
                    <TextField
                        label="rodzaj nagrody"
                        variant="outlined"
                        fullWidth
                        select
                        value={selected}
                        onChange={handleTypeChange}
                    >
                        {types.map(type=><MenuItem value={type.id} key={type.id}>{path(type.label.split('.'), i18n)}</MenuItem>)}            
                    </TextField>
                </Grid>
                <Grid item>
                    <IconButton onClick={handleAddPrize}>
                        <Add />
                    </IconButton>
                </Grid>
                  {prizes.map(prize=>{
                    const type = types.find(t=>t.id===prize.type);
                    return (
                        <React.Fragment key={prize.id}>
                            <Grid item xs={12}>
                                <Box mt={4} mb={2}>
                                    <Typography align="center">{path(type.label.split('.'), i18n)}</Typography>
                                </Box>
                            </Grid>
                            <Grid xs={12} item>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item style={flexGrow}>
                                        <type.component i18n={i18n} {...type.props} prize={prize} setPrize={handlePrizeChange(prize.id)} />
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={handlePrizeRemove(prize.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </React.Fragment>
                    )}
                 )}
            </Grid>
        </>
    )
}