import { Map, Range } from 'immutable';
import {gameStates, playerStates, sorts, teamStates, sorts} from '../../src/constants';

const generateRandomCards = numberOfCards => {
    return Range(0, numberOfCards).map(() => (
        {
            suit: Math.floor(Math.random() * 5),
            value: Math.floor(Math.random() * 13)
        }
    )).toArray();
};

export const gameInitialized = new Map({
    name: 'game 2',
    password: { salt: 'salt', token: 'token' },
    teams: [
        { score: 0, melds: [], teamState: teamStates.NOT_ON_TABLE },
        { score: 0, melds: [], teamState: teamStates.NOT_ON_TABLE }
    ],
    players: [
        {
            connected: false,
            hands: [{cards: [], sort: sorts.NONE}, {cards: [], sort: sorts.NONE}],
            inHand: true,
            cardsToDraw: 0,
            playerState: playerStates.NOT_JOINED
        },
        {
            connected: false,
            hands: [{cards: [], sort: sorts.NONE}, {cards: [], sort: sorts.NONE}],
            inHand: true,
            cardsToDraw: 0,
            playerState: playerStates.NOT_JOINED
        },
        {
            connected: false,
            hands: [{cards: [], sort: sorts.NONE}, {cards: [], sort: sorts.NONE}],
            inHand: true,
            cardsToDraw: 0,
            playerState: playerStates.NOT_JOINED
        },
        {
            connected: false,
            hands: [{cards: [], sort: sorts.NONE}, {cards: [], sort: sorts.NONE}],
            inHand: true,
            cardsToDraw: 0,
            playerState: playerStates.NOT_JOINED
        }
    ],
    roundId: 0,
    gameState: gameStates.NOT_STARTED,
    currentPlayerIndex: -1,
    piles: [ { cards: [] }, { cards: [] }, { cards: [] }, { cards: [] } ],
    discardPileLocked: false,
    discardPile: [ { cards: [] } ],
    history: [],
    undo: [],
    messages: []
});

export const game3Players = new Map({
    name: 'test game 1',
    players: [...Range(0, 3).map(playerIndex=>(
        {
            user: {
                name: 'name ' + playerIndex,
                email: 'email' + playerIndex + '@email.com',
                _id: 'uid' + playerIndex,
                password: {
                    salt: 'salt',
                    token: 'token ' + playerIndex
                }
            },
            connected: true,
            inHand: true,
            hands: [
                {
                    cards: [],
                    sort: 'none'
                },
                {
                    cards: [],
                    sort: 'none'
                }
            ],
            playerState: playerStates.WAIT,
            cardsToDraw: 0
        })).toArray(), {
        connected: false,
        inHand: true,
        hands: [
            {
                cards: [],
                sort: 'none'
            },
            {
                cards: [],
                sort: 'none'
            }
        ],
        cardsToDraw: 0,
        playerState: playerStates.NOT_JOINED
    }],
    password: {
        salt: 'salt',
        token: 'token game'
    },
    gameState: gameStates.NOT_STARTED,
    teams: Range(0, 2).map(teamIndex=>(
        {
            score: 0,
            melds: [ ]
        })).toArray(),
    roundId: 0,
    currentPlayerIndex: 0,
    piles: Range(0, 4).map(()=>(
        {
            cards: []
        })).toArray(),
    discardPileLocked: false,
    discardPile: {
        cards: []
    },
    history: []
});

export const gameInProgressDraw = new Map({
    name: 'test game 1',
    players: Range(0, 4).map(playerIndex=>(
        {
            user: {
                name: 'name ' + playerIndex,
                password: {
                    salt: 'salt',
                    token: 'token ' + playerIndex
                }
            },
            connected: true,
            inHand: playerIndex !== 2,
            playerState: playerIndex === 3 ? playerStates.INITIAL_DRAW : playerStates.WAIT,
            cardsToDraw: playerIndex === 3 ? 2 : 0,
            hands: [
                {
                    cards: playerIndex !== 2 ? generateRandomCards(11) : [],
                    sort: sorts[Math.floor(Math.random() * 3)]
                },
                {
                    cards: generateRandomCards(11),
                    sort: sorts[Math.floor(Math.random() * 3)]
                }
            ]
        })).toArray(),
    password: {
        salt: 'salt',
        token: 'token game'
    },
    gameState: gameStates.IN_PROGRESS,
    teams: Range(0, 2).map(teamIndex=>(
        {
            score: (teamIndex + 2) * 100,
            melds: [ ]
        })).toArray(),
    roundId: 1,
    currentPlayerIndex: 3,
    piles: Range(0, 4).map(()=>(
        {
            cards: generateRandomCards(Math.floor(Math.random() * 15) + 40)
        })).toArray(),
    discardPileLocked: false,
    discardPile: {
        cards: generateRandomCards(Math.floor(Math.random() * 15))
    },
    history: []
});

export const gameInProgressPlay = new Map({
    name: 'test game 1',
    players: Range(0, 4).map(playerIndex=>(
        {
            user: {
                name: 'name ' + playerIndex,
                password: {
                    salt: 'salt',
                    token: 'token ' + playerIndex
                }
            },
            connected: true,
            inHand: playerIndex !== 2,
            playerState: playerIndex === 3 ? playerStates.PLAY : playerStates.WAIT,
            cardsToDraw: 0,
            hands: [
                {
                    cards: playerIndex !== 2 ? generateRandomCards(11) : [],
                    sort: sorts[Math.floor(Math.random() * 3)]
                },
                {
                    cards: generateRandomCards(11),
                    sort: sorts[Math.floor(Math.random() * 3)]
                }
            ]
        })).toArray(),
    password: {
        salt: 'salt',
        token: 'token game'
    },
    gameState: gameStates.IN_PROGRESS,
    teams: Range(0, 2).map(teamIndex=>(
        {
            score: (teamIndex + 2) * 100,
            melds: [ ]
        })).toArray(),
    roundId: 1,
    currentPlayerIndex: 3,
    piles: Range(0, 4).map(()=>(
        {
            cards: generateRandomCards(Math.floor(Math.random() * 15) + 40)
        })).toArray(),
    discardPileLocked: false,
    discardPile: {
        cards: generateRandomCards(Math.floor(Math.random() * 15))
    },
    history: []
});

export const gameStarted = new Map({
    name: 'test game 1',
    players: Range(0, 4).map(playerIndex=>(
        {
            user: {
                name: 'name ' + playerIndex,
                password: {
                    salt: 'salt',
                    token: 'token ' + playerIndex
                }
            },
            connected: true,
            inHand: true,
            playerState: playerIndex === 1 ? playerStates.INITIAL_DRAW : playerStates.WAIT,
            cardsToDraw: playerIndex === 1 ? 2 : 0,
            hands: [
                {
                    cards: generateRandomCards(11),
                    sort: sorts[Math.floor(Math.random() * 3)],
                    pinned: -1
                },
                {
                    cards: generateRandomCards(11),
                    sort: sorts[Math.floor(Math.random() * 3)],
                    pinned: -1
                }
            ]
        })).toArray(),
    password: {
        salt: 'salt',
        token: 'token game'
    },
    gameState: gameStates.IN_PROGRESS,
    teams: Range(0, 2).map(()=>(
        {
            score: 0,
            melds: [ ]
        })).toArray(),
    roundId: 1,
    currentPlayerIndex: 1,
    piles: Range(0, 4).map(()=>(
        {
            cards: generateRandomCards(57)
        })).toArray(),
    discardPileLocked: false,
    discardPile: {
        cards: []
    },
    history: []
});
