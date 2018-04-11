import {
    GAMES_LIST,
    REJOIN_GAME,
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

class Socket {
    constructor() {
        this.socketOpen = false;
        this.ws = new WebSocket(global.config.path);
        this.ws.onopen = ()=> {
            console.log('open');
            this.socketOpen = true;
        };

        this.ws.onmessage = (ev) => {
            let data = JSON.parse(ev.data);

            this.handleMessage(data);
        };
    }

    loadStore(store) {
        this.store = store;
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

    sendToken(token, callback) {
        if (!this.socketOpen) {
            setTimeout(()=>this.sendToken(token, callback), 300);
            return;
        }
        console.log('****** send token:' + JSON.stringify({
            type: 'send token',
            token: token
        }));
        this.ws.send(JSON.stringify({
            type: 'send token',
            token: token
        }));
        callback();
    }

    sendJoinGame(gameName, password, direction) {
        console.log('****** join game:' + JSON.stringify({
            type: JOIN_GAME,
            gameName,
            password,
            direction
        }));
        this.ws.send(JSON.stringify({
            type: JOIN_GAME,
            gameName,
            password,
            direction
        }));
    }

    sendRejoinGame(gameName, password, direction) {
        console.log('****** rejoin game:' + JSON.stringify({
            type: REJOIN_GAME,
            gameName,
            password,
            direction
        }));
        this.ws.send(JSON.stringify({
            type: REJOIN_GAME,
            gameName,
            password,
            direction
        }));
    }
}

export default new Socket();
