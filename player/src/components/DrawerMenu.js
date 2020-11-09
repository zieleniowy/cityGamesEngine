import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, IconButton, makeStyles} from '@material-ui/core';
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import { ErrorOutline, Menu as MenuIcon } from  '@material-ui/icons';
import { path } from 'ramda';
const useStyles = makeStyles(theme=>({
    link: {
        color: theme.palette.text.primary,
        textDecoration: 'none',
    }
}));


function mapStateToProps(state){
    return {
        pages: (state.pages||[]).filter(page=>page.menu==='drawer'),
        i18n: state.i18n,
    }
}
const DrawerMenu = props=>{
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = state =>()=>setOpen(state);
  return (
        <>
            <Drawer open={open} anchor="bottom" onClose={toggleDrawer(false)}>
                <List>
                {props.pages.map(page=>(
                    <Link onClick={toggleDrawer(false)} key={page.href} className={classes.link} to={page.href}><ListItem><ListItemIcon>{page.icon?<page.icon/>:<ErrorOutline/>}</ListItemIcon>{path(page.label, props.i18n)}</ListItem></Link>
                ))}
                </List>
            </Drawer>
            {Boolean(props.pages.length)&&<IconButton onClick={toggleDrawer(true)} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            }

        </>

  );
}


export default connect(
    mapStateToProps,
    null,
  )(DrawerMenu)
  