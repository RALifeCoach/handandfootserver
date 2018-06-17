import {
    LOGIN_SUCCESSFUL,
    LOGIN_FAILED,
    LOGIN,
    RECONNECT,
    ERROR
} from '../actions/user-actions';

export default function UserReducer(state = {loginState: 'logged out'}, action) {
    console.log('user reducer: ' + JSON.stringify(state));
    switch (action.type) {
        case LOGIN_SUCCESSFUL:
            return Object.assign({}, state, {
                loginState: 'success',
                userId: action.userId,
                loginToken: action.token
            });
        case LOGIN:
            return Object.assign({}, state, {
                loginState: 'waiting'
            });
        case RECONNECT:
            return Object.assign({}, state, {
                loginState: 'logged out'
            });
        case LOGIN_FAILED:
            return Object.assign({}, state, {
                loginState: 'failed'
            });
        case ERROR:
            return Object.assign({}, state, {
                error: action.message
            });
        default:
            return state;
    }
}