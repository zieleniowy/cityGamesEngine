import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from './TabsMenu';
const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  tabs: {
    width: 'calc(100% - 48px)'
  },
  grow: {
    flexGrow: 1,
    flex: 1,
  },
}));

export default function Component(props) {
  const classes = useStyles();
  return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
            <Tabs className={classes.tabs} />
        </Toolbar>
      </AppBar>
  );
}