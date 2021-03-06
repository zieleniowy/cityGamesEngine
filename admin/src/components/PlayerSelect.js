import React, {useEffect} from "react";
import {connect} from "react-redux";
import { Select, TextField, InputLabel, MenuItem } from '@material-ui/core';

function mapStateToProps(state){
  return {
      players: state.players
  }
}
function mapDispatchToProps(dispatch){
  return {
    updateList: list=>dispatch({ type: 'SET', payload: { players: list||[] } })
  }
}


const PlayerSelect = props =>{
    const fetchList = ()=>window.cmd('fetchPlayerList').then(props.updateList)
    if(!props.players) fetchList();
    React.useEffect(()=>{
        window.socket.on('reconnect', fetchList);
        return ()=>{
            window.socket.off('reconnect', fetchList);
        }
    })
    const handleChange = e => props.onChange(e.target.value);
    return (
            <TextField
                label={props.label}
                value={props.player||"<none>"}
                onChange={handleChange}
                variant={props.variant}
                select
                fullWidth
            >
                <MenuItem value="<none>">------</MenuItem>
                {props.players&&props.players.map(player=>(<MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>))}
            </TextField>
    )
}


export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PlayerSelect)
  