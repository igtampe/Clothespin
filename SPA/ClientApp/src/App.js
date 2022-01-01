import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Login from './components/Login'
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import Cookies from 'universal-cookie';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

import './custom.css'

const cookies = new Cookies();

const theme = createTheme({
  palette: {
    primary : {
      main: '#E1DBB9'
    },
    secondary: {
      main: '#5E5B4E'
    }
  }
});

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <MuiThemeProvider theme={theme}>
      <Layout>
        <Route path='/'>
          {cookies.get("SessionID")===undefined ? <Redirect to='/Login'/> : <Redirect to='/Home'/>}
        </Route>
        <Route path='/Home' component={Home}/>
        <Route path='/Login' component={Login} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
      </MuiThemeProvider>
    );
  }
}
