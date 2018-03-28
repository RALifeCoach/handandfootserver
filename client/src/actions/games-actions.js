export const JOIN_GAME = 'join game';
export const REFRESH_LIST = 'refresh list';
export const REQUEST_LIST = 'request list';

export function joinGame(gameName, direction) {
    return {
        type: JOIN_GAME,
        gameName,
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
