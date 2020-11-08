import React from 'react';
import { Tabs, Tab, makeStyles} from '@material-ui/core';
import { useLocation, Link } from "react-router-dom";
import {connect} from "react-redux";
import { ErrorOutline } from  '@material-ui/icons';
import {path} from 'ramda';
const useStyles = makeStyles(theme=>({
    link: {
        color: theme.palette.background.paper,
        textDecoration: 'none',
    }
}));


function mapStateToProps(state){
    return {
        pages: state.pages.filter(page=>page.menu==='tab')
    }
}


const TabMenu = props=>{
    const location = useLocation();
    const classes = useStyles();
    const value = props.pages.findIndex(page=>page.href===location.pathname);

  return (
        <Tabs
          value={value!==-1?value:false}
          variant="scrollable"
          scrollButtons="off"
          className={props.className}
        >
            {props.pages.map(page=>(
                <Tab label={path(page.label, window.i18n)} key={page.href} component={Link} className={classes.link} to={page.href} icon={page.icon?<page.icon/>:<ErrorOutline/>} />
            ))}
        </Tabs>
  );
}


export default connect(
    mapStateToProps,
    null,
  )(TabMenu)
  