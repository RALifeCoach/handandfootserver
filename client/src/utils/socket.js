//import WebSocket from 'ws';
import {
    loginSuccessful
} from '../actions/user-actions';
import {
    LOGIN_SUCCESSFUL,
    REQUEST_TOKEN,
    NEW_USER
} from '../messages/login-messages';
import {
    GAMES_LIST
} from '../messages/game-messages';
import {
    REQUEST_LIST,
    refreshList
} from '../actions/games-actions';
import CommonUtils from './../utils/commonUtils';

let socketInstance = null;
export default class Socket {
    constructor(store) {
        if (!socketInstance) {
            console.log(global.config);
            this.ws = new WebSocket(global.config.path);
            this.ws.onopen = function() {
                console.log('open')
            };

            this.ws.onmessage = (ev) => {
                let data = JSON.parse(ev.data);

                console.log(data);
                this.handleMessage(data);
            };
            this.store = store;
            socketInstance = this;
        }
        return socketInstance;
    }

    handleMessage(message) {
        switch (message.type) {
            case GAMES_LIST:
                this.store.dispatch(refreshList(CommonUtils.formatGames(message.games)));
                break;
            case NEW_USER:
                break;
        }
    }

    sendToken(token) {
        this.ws.send(JSON.stringify({
            type: 'send token',
            token: token
        }));
    }
}
