import React from 'react';
import { useSelector } from 'react-redux';
export default function AddPrizesToQuest(props){
    const AddPrizes = useSelector(state=>state.components.Add$prizes.component);
    const setPrizes = (prizes)=>props.setQuest({ ...props.quest, prizes });
    return <AddPrizes prizes={props.quest.prizes} setPrizes={setPrizes}  />
}