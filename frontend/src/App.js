import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';

class App extends Component{
    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={Home}></Route>
                    <Route path="/room" exact component={Room}></Route>
                </Switch>
            </Router>
        );
    }
}

export default App;