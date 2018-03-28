import {
    LOGIN,
    LOGIN_SUCCESSFUL,
    LOGOUT,
    loginSuccessful,
    loginFailed
} from '../actions/login-actions';
import { requestList } from '../actions/games-actions';
import { push } from 'react-router-redux';
import RestCalls from './../utils/rest-calls';

export default class LoginMiddleware {
    static login({dispatch, getState}) {
        return next =>
            action => {
                switch (action.type) {
                    case LOGIN:
                        LoginMiddleware.sendLoginData(action, dispatch);
                        break;
                    case LOGIN_SUCCESSFUL:
                        dispatch(requestList());
                        dispatch(push('games'));
                        break;
                    default:
                        break;
                }
                return next(action);
            }
    }

    static sendLoginData(action, dispatch) {
        console.log(action);
        RestCalls.sendLoginData(action.userId, action.password)
            .then(response=>{
                if (response.status !== 200) {
                    dispatch(ioError(response.statusText));
                } else {
                    response.data.success
                        ? dispatch(loginSuccessful(response.data.token))
                        : dispatch(loginFailed());
                }
            });
    }
}