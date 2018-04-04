import {
    LOGIN,
    LOGIN_SUCCESSFUL,
    LOGOUT,
    ERROR,
    loginSuccessful,
    loginFailed,
    ioError
} from '../actions/user-actions';
import { requestList } from '../actions/games-actions';
import { push } from 'react-router-redux';
import Socket from './../utils/socket';
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
                        new Socket().sendToken(action.token);
                        setTimeout(()=>{
                            dispatch(requestList());
                            dispatch(push('games'));
                        }, 200);
                        break;
                    default:
                        break;
                }
                return next(action);
            }
    }

    static sendLoginData(action, dispatch) {
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

    static ioError({dispatch, getState}) {
        return next =>
            action => {
                switch (action.type) {
                    case ERROR:
                        setTimeout(()=>{
                            dispatch(push('error'));
                        }, 200);
                        break;
                    default:
                        break;
                }
                return next(action);
            }
    }
}