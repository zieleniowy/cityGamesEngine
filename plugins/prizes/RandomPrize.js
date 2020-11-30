import React from 'react';
import { Button, Box, Typography, Grid } from '@material-ui/core';
import BorderedPanel from '../../components/BorderedPanel';
import { useSelector } from 'react-redux';
import { sum, map } from 'ramda';




export default function RandomPrize(props){
    const {AddPrizes, TextField} = useSelector(state=>({ 
        AddPrizes: state.components.Add$prizes.component,
        TextField: state.components.TextField$prizes.component
    }));
    const { prize, setPrize } = props;

    const totalProb = sum(map(element=>element.chances, prize.elements||[]))||0;

    const handleDeleteOption = elementID=>()=>setPrize({ ...prize, elements: prize.elements.filter(el=>el.id!==elementID) });
    const handleAddOption = () =>{
        setPrize({ ...prize, elements: [...(prize?.elements||[]), { id: window.genid(), chances: 1, prizes: [] }] })
    }
    const handleChangeElement = elementID => newElement => {
        const index = prize.elements.findIndex(el=>el.id===elementID);
        const curElement = prize.elements[index]; 
        const elements = [...prize.elements.slice(0, index), {...curElement, ...newElement}, ...prize.elements.slice(index+1)]
        setPrize({ ...prize, elements });
    }
    const handleChangePrize = elementID => prizes => handleChangeElement(elementID)({ prizes });
    return (
        <>
            {(prize.elements||[]).map((el, i)=>(
                <BorderedPanel key={el.id} title={`${props.i18n.prizes.option} ${i+1}`}>
                    <Box my={4}>
                        <Box my={2}>
                            <TextField 
                                fullWidth={false} 
                                label="prizes.probability" 
                                i18n={props.i18n} 
                                k="chances" 
                                prize={el} 
                                setPrize={handleChangeElement(el.id)} 
                            />
                            <Typography variant="h3" component="span"> / {totalProb}</Typography>
                        </Box>
                        <AddPrizes prizes={el.prizes} setPrizes={handleChangePrize(el.id)} />
                    </Box>
                    <Button onClick={handleDeleteOption(el.id)} fullWidth color="secondary">Usuń tę opcję</Button>
                </BorderedPanel>
            ))}
            <Box mt={2}><Button onClick={handleAddOption} variant="contained" color="secondary" fullWidth>Dodaj opcję</Button></Box>
        </>  
    )
}