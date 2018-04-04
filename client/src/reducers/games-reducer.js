import {
    JOIN_GAME,
    REQUEST_LIST,
    REFRESH_LIST,
    ADD_GAME_CLICK,
    ADD_GAME_REQUEST,
    ADD_GAME_CANCEL,
} from '../actions/games-actions';

export default function LoginReducer(state = {gamesState: 'login'}, action) {
    console.log(state);
    switch (action.type) {
        case REFRESH_LIST:
            return Object.assign({}, state, {
                gamesState: 'success',
                games: action.games
            });
        case REQUEST_LIST:
            return Object.assign({}, state, {
                gamesState: 'waiting'
            });
        case ADD_GAME_CLICK:
            return Object.assign({}, state, {
                gamesState: 'add game'
            });
        case ADD_GAME_REQUEST:
            return Object.assign({}, state, {
                gamesState: 'add request'
            });
        case ADD_GAME_CANCEL:
            return Object.assign({}, state, {
                gamesState: 'success'
            });
        default:
            return state;
    }
}