import React from 'react';
import { Container, makeStyles, InputBase, IconButton, Typography } from '@material-ui/core';
import {NavigateNext} from '@material-ui/icons';
const useStyles = makeStyles(theme=>({
    root: {
        border: '1px black solid',
        height: 400,
        position: 'relative',
    },
    wrapper: {
        position: 'absolute',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        boxSizing: 'border-box',
        bottom: 0,
        left: 0,
        width: '100%',
    },
    results: {
        maxHeight: 348,
        overflowY: 'scroll',
    },
    fieldRoot: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    success: {
        marginLeft: theme.spacing(2),
    },
    fail: {
        marginLeft: theme.spacing(2),
        color: 'red',
    },
    command: {
        fontWeight: 'bold',
    },
    typo: {
        marginTop: theme.spacing(2),
    }
}));
const parse = input => {
    const splitted = input.split(' ');
    const type = splitted[0];
    const rest = splitted.slice(1).join(' ');
    const args = rest.match(/(-\w+\s([^-]+))/gi);
    const o = args?{}:rest;
    if(args){
        args.forEach(arg=>{
            const splitted = arg.split(' ');
            o[splitted[0].slice(1)] = splitted.slice(1).join(' ').trim();
        })
    }
    return [type, o];
}
const genId = ()=> new Date()*1+''+(Math.floor(Math.random()*899)+100);
export default ()=>{
    const classes = useStyles();
    const [results, setResults] = React.useState([]);
    const cmd = window.cmd;
    let i = -1;
    let ref;
    let resultsDiv = React.createRef();
    const handleSubmit = e =>{
        const str = ref.value;
        const command = parse(str);
        const div = resultsDiv.current;
        setResults(prevState=>[...prevState, { status: 'command', id: genId(), result: str }]);
        cmd(...command)
            .then(result=>setResults(prevState=>[...prevState, { id: genId(), status: 'success', result: JSON.stringify(result) }]))
            .catch(msg=>setResults(prevState=>[...prevState, { id: genId(), status: 'fail', result: msg }]))
            .finally(o=>div&&div.scrollTo(0, div.scrollHeight+div.clientHeight))
        ref.value = '';
        e.preventDefault();
    }
    const handleKeyDown = e =>{
        if(e.keyCode === 40 || e.keyCode === 38) {
            const commands = results.filter(command=>command.status==='command');
            i+=e.keyCode===38?i<commands.length?1:0:i>=0?-1:0;
            let ci = commands.length-i-1;
            ref.value=ci>=0&&ci<commands.length?commands[ci].result:'';
            e.preventDefault();
        }
    }
    return(
        <Container maxWidth="md" className={classes.root}>
        <Typography variant="h5" align="center" className={classes.typo}>Konsola</Typography>
            <div className={classes.wrapper}>
                <div className={classes.results} ref={resultsDiv}>
                    {results.map(result=>(
                        <div key={result.id} className={classes[result.status]}>{result.result}</div>
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={classes.fieldRoot}>
                        <IconButton>
                            <NavigateNext/>
                        </IconButton>
                        <InputBase onKeyDown={handleKeyDown} inputRef={r=>ref=r} fullWidth defaultValue=""/>
                    </div>
                </form>
            </div>
            </Container>
    )
}