import { combineReducers } from 'redux';
import user from './user-reducer';
import games from './games-reducer';
import game from './game-reducer';
import page from './page-reducer';

export default combineReducers({
    user,
    games,
    game,
    page
});