export const JOIN_GAME = 'join game';
export const REJOIN_GAME = 'rejoin game';
export const REFRESH_LIST = 'refresh list';
export const REQUEST_LIST = 'request list';
export const ADD_GAME_CLICK = 'add game click';
export const ADD_GAME_CANCEL = 'add game cancel';
export const ADD_GAME_REQUEST = 'add game request';

export function joinGame(gameName, password, direction) {
    return {
        type: JOIN_GAME,
        gameName,
        password,
        direction
    }
}

export function rejoinGame(gameName, password, direction) {
    return {
        type: REJOIN_GAME,
        gameName,
        password,
        direction
    }
}

export function refreshList(games) {
    return {
        type: REFRESH_LIST,
        games
    }
}

export function requestList() {
    return {
        type: REQUEST_LIST
    }
}

export function addGameClick() {
    return {
        type: ADD_GAME_CLICK
    }
}

export function addGameRequest(gameName, password) {
    return {
        type: ADD_GAME_REQUEST,
        gameName,
        password
    }
}

export function addGameCancel() {
    return {
        type: ADD_GAME_CANCEL
    }
}
