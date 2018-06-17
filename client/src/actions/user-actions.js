export const LOGIN = 'login';
export const LOGIN_SUCCESSFUL = 'login successful';
export const LOGIN_FAILED = 'login failed';
export const RECONNECT = 'reconnect';
export const LOGOUT = 'logout';
export const ERROR = 'error';

export function login(userId, password) {
    return {
        type: LOGIN,
        userId,
        password
    }
}

export function loginSuccessful(token, userId) {
    return {
        type: LOGIN_SUCCESSFUL,
        token,
        userId
    }
}

export function reconnect() {
    return {
        type: RECONNECT
    }
}

export function loginFailed() {
    return {
        type: LOGIN_FAILED
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}

export function ioError(message) {
    return {
        type: ERROR,
        message
    }
}
