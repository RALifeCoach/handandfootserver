import axios from 'axios';

export default class RestCalls {
    static sendLoginData(userId, password) {
        return axios.post(global.config.authenticationPath, {
            userId,
            password
        });
    }

    static sendRequestList(token) {
        return axios.get(global.config.requestList, {
            headers: {'X-Access-Token': token}
        });
    }

    static sendAddGame(token, gameName, password) {
        const url = eval('`' + global.config.addGame + '`');
        return axios.get(url, {
            headers: {'X-Access-Token': token}
        });
    }
}
