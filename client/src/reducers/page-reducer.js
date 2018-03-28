import {
    LOGIN_SUCCESSFUL,
    LOGOUT
} from '../actions/login-actions';

export default function PageReducer(state = {pageState: 'login'}, action) {
    console.log(state);
    switch (action.type) {
        case LOGIN_SUCCESSFUL:
            return Object.assign({}, state, {
                pageState: 'gameList'
            });
        case LOGOUT:
            return Object.assign({}, state, {
                pageState: 'login'
            });
        default:
            return state;
    }
}