import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import Login from './login-component';
import Games from './games-component';

import reducers from '../reducers';
import Socket from '../utils/socket';
import LoginMiddleware from './../middleware/login-middleware';
import GamesMiddleware from './../middleware/games-middleware';

const history = createHistory();
const middleware = routerMiddleware(history);

const store = createStore(
    combineReducers({
        reducers,
        router: routerReducer
    }),
    applyMiddleware(middleware,
        LoginMiddleware.login,
        GamesMiddleware.games)
);
const socket = new Socket(store);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Route exact path="/" component={Login}/>
                <Route exact path="/games" component={Games}/>
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('react-base')
);
