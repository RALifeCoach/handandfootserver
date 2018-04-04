export const LOGIN = 'login';
export const LOGIN_SUCCESSFUL = 'login successful';
export const LOGIN_FAILED = 'login failed';
export const LOGOUT = 'logout';
export const ERROR = 'error';

export function login(userId, password) {
    return {
        type: LOGIN,
        userId,
        password
    }
}

export function loginSuccessful(token) {
    return {
        type: LOGIN_SUCCESSFUL,
        token: token
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
