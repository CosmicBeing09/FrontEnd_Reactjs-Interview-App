import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatHome from './pages/chat/Home';
import Login from './pages/login/Login';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Switch>
      <Route exact path = '/' component = {Login}/>
      <Route path = '/home' component = {ChatHome}/>
      <Route component = {ChatHome}/>
    </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;
