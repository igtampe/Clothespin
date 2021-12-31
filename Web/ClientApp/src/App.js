import React, { Component } from 'react';
import { Layout }  from './components/Layout';
import Login from './components/Login'
import Home from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import {
  BrowserRouter as Router,
  Route, Routes, Navigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class App extends Component {

  render () {
    return (
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Navigate to='/Home'/>} />
            <Route exact path="/Home" element={<Home/>}/>
            <Route exact path="/Login" element={<Login/>}/>
            <Route exact path="/counter" element={cookies.get("SessionID")===undefined ? <Navigate to='/Login'/> : <Counter/>}/>
            <Route exact path="/fetch-data" element={<FetchData/>}/>
          </Routes>  
        </Layout>
      </Router>      
    );
  } 
}

