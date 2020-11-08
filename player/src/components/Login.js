import React, {useEffect} from "react";
import {connect} from "react-redux";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';

function mapStateToProps(state){
  return {
    token: state.token
  }
}
function mapDispatchToProps(dispatch){
  return {
    login: (token)=>{
      return dispatch({ type: "LOGIN", payload: token });
    },
    error: (o)=>{
    //   return dispatch(actions.setError(o));
    }
  }
}
const socket = window.socket;

const Login = props =>{
    const refs = {};
    const handleLogin = e =>{
        socket.emit('login', { login: refs.login.value, pass: refs.pass.value, isAdmin: false });
        e.preventDefault();
    }
    const handleSocket = token =>props.login(token)
    useEffect(()=>{
        socket.on('authToken', handleSocket);
        return ()=>{
            socket.off('authToken', handleSocket);
        }
    })
    return (
      <div>
        <Dialog open={true} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Wymagana autoryzacja</DialogTitle>
          <form onSubmit={handleLogin}>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                label="login"
                type="text"
                fullWidth
                inputRef={(r)=>refs.login=r}
                />
                <TextField
                label="hasło"
                type="password"
                margin="normal"
                fullWidth
                inputRef={(r)=>refs.pass=r}
                />
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="contained" type="submit" color="primary">
                    zaloguj się
                </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
