import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Login from './components/Login'
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import Cookies from 'universal-cookie';

import './custom.css'

const cookies = new Cookies();

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/'>
          cookies.get("SessionID")===undefined ? <Redirect to='/Login'/> : Home
        </Route>
        <Route exact path='/Login' component={Login} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
    );
  }
}
