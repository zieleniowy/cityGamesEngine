import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
const useStyles = makeStyles(theme=>({
    root: {
        position: 'relative',
        marginTop: theme.spacing(2),
        padding: theme.spacing(1),
        background: theme.palette.background.paper,
    },
    typo: {
        position: 'absolute',
        top: -theme.typography.fontSize,
        left: theme.spacing(3),
        padding: theme.spacing(0, 1, 0, 1),
        background: 'inherit',

    },
    border: {
        border: '1px black solid',
        borderRadius: theme.shape.borderRadius,     
    },
    colorPrimary: {
        borderColor: theme.palette.primary.main,
        '&$typo': {
            color: theme.palette.primary.main,
        },
    },
    colorSecondary: {
        borderColor: theme.palette.secondary.main,
        '&$typo': {
            color: theme.palette.secondary.main,
        },
    }
}));
export default props =>{
    const classes = useStyles();
    const borderClass = clsx(classes.border, { 
        [classes.colorPrimary]: props.color==='primary', 
        [classes.colorSecondary]: props.color==='secondary' 
    })
    return (
        <div className={clsx(classes.root, borderClass, props.className)}>
            {props.title&&<Typography className={clsx(classes.typo, borderClass)} variant={props.variant||"body1"}>{props.title}</Typography>}
            {props.children}
        </div>
    )
}