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
import Logbook from './components/Logbook';
import Statistics from './components/Statistics';
import Closet from './components/Closet';

const cookies = new Cookies();

const theme = createTheme({
  palette: {
    primary : {
      main: '#E1DBB9'
    },
    secondary: {
      main: '#5E5B4E'
    },
    mode : 'dark'
  }
});

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <MuiThemeProvider theme={theme}>
      <Layout>
        <Route exact path='/'> <Redirect to='/Home'/> </Route>
        <Route path='/Home'>
          <Home/>
        </Route>
        <Route path='/Login'> 
          {cookies.get("SessionID")===undefined ? <Login/> : <Redirect to='/Closet'/>}
        </Route>
        
        <Route path='/Closet'>
          {cookies.get("SessionID")===undefined ? <Redirect to='/Login'/> : <Closet/>}
        </Route>

        <Route path='/Logbook'>
          {cookies.get("SessionID")===undefined ? <Redirect to='/Login'/> : <Logbook/>}
        </Route>

        <Route path='/Statistics'>
          {cookies.get("SessionID")===undefined ? <Redirect to='/Login'/> : <Statistics/>}
        </Route>
        
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
      </MuiThemeProvider>
    );
  }
}
