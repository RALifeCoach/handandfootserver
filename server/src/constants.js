export const directions = [
    {
        direction: 'North',
        teamIndex: 0,
        playerIndex: 0
    },
    {
        direction: 'East',
        teamIndex: 1,
        playerIndex: 1
    },
    {
        direction: 'South',
        teamIndex: 0,
        playerIndex: 2
    },
    {
        direction: 'West',
        teamIndex: 1,
        playerIndex: 3
    }
];

export const playerIndexToTeamIndex = {
    0: 0,
    1: 1,
    2: 0,
    3: 1,
};

export const suits = [
    'Club', 'Diamond', 'Heart', 'Spade', 'Joker'
];

export const sorts = {
    NONE: 'none',
    MELDS: 'melds',
    RUNS: 'runs'
};

export const meldTypes = {
    MELD: 'meld',
    RUN: 'run',
    WILD_CARDS: 'wild cards',
    RED_THREE: 'red three'
};

export const gameStates = {
    NOT_STARTED: 'not started',
    IN_PROGRESS: 'in progress',
    COMPLETED: 'completed',
    PENDING_RESIGN: 'pending resign',
    PENDING_END: 'pending end'
};

export const playerStates = {
    NOT_JOINED: 'not joined',
    INITIAL_DRAW: 'initial draw',
    DRAW: 'draw',
    PLAY: 'play',
    UP7_PENDING: 'up 7 pending',
    DISCARD_PENDING: 'discard pending',
    WAIT: 'wait',
    RESIGN_REQUEST: 'resign request',
    END_REQUEST: 'end request',
    ANY: ''
};

export const teamStates = {
    ON_TABLE: 'on table',
    NOT_ON_TABLE: 'not on table'
};

export const actions = {
    DRAW_PILE: 'draw pile',
    UP7_DRAW: 'draw discard',
    JOIN_GAME: 'join game',
    REJOIN_GAME: 'rejoin game',
    ADD_TO_BOARD: 'add to board',
    ADD_TO_MELD: 'add to meld',
    DISCARD: 'discard',
    RESIGN_REQUEST: 'resign request',
    SORT_MELDS: 'sort melds',
    SORT_RUNS: 'sort runs',
    PIN_CARD: 'pin card',
    UNPIN_CARD: 'unpin card',
    ACCEPT_RESIGN: 'accept resign',
    ACCEPT_END: 'accept end',
    ACCEPT_DISCARD: 'accept discard',
    CANCEL: 'cancel',
    UNDO: 'undo'
};

export const undoOptions = {
    SAVE: 'save',
    CLEAR: 'clear',
    NA: ''
};
