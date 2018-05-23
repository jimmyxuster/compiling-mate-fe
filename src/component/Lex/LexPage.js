import React, { Component } from 'react';
import { Route, Link, Switch }  from 'react-router-dom';
import LexHome from './LexHome';

class LexPage extends Component {
    render() {
        return (
            <div>
                LexPage
                <Switch>
                    <Route exact path="/lex" component={LexHome}/>
                    <Route path="/lex/pp" component={LexHome}/>
                </Switch>
            </div>
        )
    }
}

export default LexPage;