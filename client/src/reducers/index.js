import { combineReducers } from 'redux';
import login from './login-reducer';
import games from './games-reducer';
import page from './page-reducer';

export default combineReducers({
    login,
    games,
    page
});