import {
    JOIN_GAME,
    REQUEST_LIST,
    REFRESH_LIST
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
        default:
            return state;
    }
}