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
}
