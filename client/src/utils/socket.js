import {
    GAMES_LIST,
    JOIN_GAME
} from '../messages/games-messages';
import {
    UPDATE_GAME
} from '../messages/game-messages';
import {
    refreshList
} from '../actions/games-actions';
import {
    updateGame
} from '../actions/game-actions';
import {
    ioError
} from '../actions/user-actions';
import CommonUtils from './../utils/commonUtils';

let socketInstance = null;
export default class Socket {
    constructor(store) {
        if (!socketInstance) {
            this.ws = new WebSocket(global.config.path);
            this.ws.onopen = function() {
                console.log('open')
            };

            this.ws.onmessage = (ev) => {
                let data = JSON.parse(ev.data);

                this.handleMessage(data);
            };
            this.store = store;
            socketInstance = this;
        }
        return socketInstance;
    }

    static getInstance() {
        return socketInstance;
    }

    handleMessage(message) {
        console.log('socket message: ' + JSON.stringify(message));
        if (message.success === false) {
            this.store.dispatch(ioError(message.message));
            return;
        }
        switch (message.type) {
            case GAMES_LIST:
                this.store.dispatch(refreshList(CommonUtils.formatGames(message.games)));
                break;
            case UPDATE_GAME:
                this.store.dispatch(updateGame(message.game));
                break;
            default:
                break;
        }
    }

    sendToken(token) {
        this.ws.send(JSON.stringify({
            type: 'send token',
            token: token
        }));
    }

    sendJoinGame(gameName, password, direction) {
        this.ws.send(JSON.stringify({
            type: JOIN_GAME,
            gameName,
            password,
            direction
        }));
    }
}
