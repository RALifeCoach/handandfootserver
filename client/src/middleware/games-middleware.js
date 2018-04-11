import {
    JOIN_GAME,
    REJOIN_GAME,
    REQUEST_LIST,
    ADD_GAME_REQUEST,
    refreshList
} from '../actions/games-actions';
import {
    ioError
} from '../actions/user-actions';
import { push } from 'react-router-redux';
import RestCalls from './../utils/rest-calls';
import Socket from './../utils/socket';
import CommonUtils from './../utils/commonUtils';

export default class GamesMiddleware {
    static games({dispatch, getState}) {
        return next =>
            action => {
                switch (action.type) {
                    case REQUEST_LIST:
                        GamesMiddleware.sendRequestList(getState, dispatch);
                        break;
                    case ADD_GAME_REQUEST:
                        GamesMiddleware.sendAddGame(getState, dispatch, action.gameName, action.password);
                        break;
                    case JOIN_GAME:
                        GamesMiddleware.sendJoinGame(getState, dispatch, action.gameName,
                            action.password, action.direction);
                        dispatch(push('game'));
                        break;
                    case REJOIN_GAME:
                        GamesMiddleware.sendRejoinGame(getState, dispatch, action.gameName,
                            action.password, action.direction);
                        dispatch(push('game'));
                        break;
                    default:
                        break;
                }
                return next(action);
            }
    }

    static sendRequestList(getState, dispatch) {
        RestCalls.sendRequestList(getState().reducers.user.loginToken)
            .then(response=>{
                if (response.status !== 200) {
                    dispatch(ioError(response.statusText));
                } else {
                    console.log('---- request list: ' + JSON.stringify(response.data));
                    const data = response.data;
                    if (!data.success) {
                        dispatch(ioError(data.message));
                        return;
                    }
                    dispatch(refreshList(CommonUtils.formatGames(data.games)));
                }
            });
    }

    static sendAddGame(getState, dispatch, gameName, password) {
        RestCalls.sendAddGame(getState().reducers.user.loginToken, gameName, password)
            .then(response=>{
                if (response.status !== 200) {
                    dispatch(ioError(response.statusText));
                } else {
                    console.log('---- add game: ' + JSON.stringify(response.data));
                    const data = response.data;
                    if (!data.success) {
                        dispatch(ioError(data.message));
                    }
                }
            });
    }

    static sendJoinGame(getState, dispatch, gameName, password, direction) {
        Socket.sendJoinGame(gameName, password, direction);
    }

    static sendRejoinGame(getState, dispatch, gameName, password, direction) {
        Socket.sendRejoinGame(gameName, password, direction);
    }
}