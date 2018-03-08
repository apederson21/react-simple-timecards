import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Menu from './components/header/menu';
import Footer from './components/footer/footer';
import Timecards from './components/timecards/timecards';
import Login from './components/login/login';

ReactDOM.render(
  <Menu />,
  document.getElementsByTagName('header')[0]
);

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Timecards}/>
      <Route path="/login" component={Login}/>
      <Route component={Login}/>
    </Switch>
  </Router>,
  document.getElementById('app')
);

ReactDOM.render(
  <Footer />,
  document.getElementsByTagName('footer')[0]
);