import React from 'react';
import logo from './logo.svg';
import { connect } from 'react-redux';
import Page from './components/Page';
import {CssBaseline, Box} from '@material-ui/core';
import AppBar from './components/AppBar';
// import Console from './components/Console';
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App(props) {
  return props.token?(
    <div>
      <CssBaseline />
      <Router>
        <Switch>
            {props.pages.map(page=><Route key={page.href} exact path={page.href}><Page page={page.href}/></Route>)}
        </Switch>
        <AppBar/>
      </Router>
      {/* <Box ph={2} pb={3}><Console/></Box> */}
    </div>

  ):(<Login/>);
}

const mapStateToProps = (state, ownProps) => {
  return {
    pages:  state.pages,
    token: state.token,
  }
}

export default connect(mapStateToProps, null)(App)
