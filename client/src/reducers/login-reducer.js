import {
    LOGIN_SUCCESSFUL,
    LOGIN_FAILED,
    LOGIN
} from '../actions/login-actions';

export default function LoginReducer(state = {loginState: 'logged out'}, action) {
    switch (action.type) {
        case LOGIN_SUCCESSFUL:
            return Object.assign({}, state, {
                loginState: 'success',
                loginToken: action.token
            });
        case LOGIN:
            return Object.assign({}, state, {
                loginState: 'waiting'
            });
        case LOGIN_FAILED:
            return Object.assign({}, state, {
                loginState: 'failed'
            });
        default:
            return state;
    }
}