import {
    LOGIN,
    LOGIN_SUCCESSFUL,
    RECONNECT,
    ERROR,
    loginSuccessful,
    loginFailed,
    ioError
} from '../actions/user-actions';
import { requestList } from '../actions/games-actions';
import { push } from 'react-router-redux';
import Socket from './../utils/socket';
import RestCalls from './../utils/rest-calls';
import cookie from 'react-cookies';

export default class LoginMiddleware {
    static login({dispatch, getState}) {
        return next =>
            action => {
                switch (action.type) {
                    case LOGIN:
                        LoginMiddleware.sendLoginData(action, dispatch);
                        break;
                    case RECONNECT:
                        cookie.remove('login');
                        dispatch(push('/'));
                        break;
                    case LOGIN_SUCCESSFUL:
                        Socket.sendToken(action.token, () => {
                            dispatch(requestList());
                            dispatch(push('games'));
                        });
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
                        ? LoginMiddleware.loginSuccessful(dispatch, response.data)
                        : dispatch(loginFailed());
                }
            });
    }

    static loginSuccessful(dispatch, data) {
        cookie.save('login', {token: data.token, userId: data.userId}, {path: '/'});
        dispatch(loginSuccessful(data.token, data.userId));
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