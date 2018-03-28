//import WebSocket from 'ws';
import {
    loginSuccessful
} from '../actions/login-actions';
import {
    LOGIN_SUCCESSFUL,
    NEW_USER
} from '../messages/login-messages';

let socketInstance = null;
export default class Socket {
    constructor(store) {
        if (!socketInstance) {
            console.log(global.config);
            const ws = new WebSocket(global.config.path);
            ws.onopen = function() {
                console.log('open')
            };

            ws.onmessage = function(ev) {
                let _data = ev.data;

                console.log(_data);
            };
            this.store = store;
            socketInstance = this;
        }
        return socketInstance;
    }

    handleMessage(message) {
        switch (message.type) {
            case LOGIN_SUCCESSFUL:
                this.store.dispatch(loginSuccessful());
                break;
            case NEW_USER:
                break;
        }
    }
}
