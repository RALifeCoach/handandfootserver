import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import LoginComponent from './login-component';
import GamesComponent from './games-component';
import GameComponent from './game-component';
import ErrorComponent from './error-component';

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
        LoginMiddleware.ioError,
        GamesMiddleware.games)
);
Socket.loadStore(store);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Route exact path="/" component={LoginComponent}/>
                <Route exact path="/games" component={GamesComponent}/>
                <Route exact path="/game" component={GameComponent}/>
                <Route exact path="/error" component={ErrorComponent}/>
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('react-base')
);
