import { Map, Range } from 'immutable';
import {gameStates, playerStates, sorts} from '../../src/constants';

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
        { score: 0, melds: [] },
        { score: 0, melds: [] }
    ],
    players: [
        { playerState: playerStates.NOT_JOINED },
        { playerState: playerStates.NOT_JOINED },
        { playerState: playerStates.NOT_JOINED },
        { playerState: playerStates.NOT_JOINED }
    ],
    roundId: 0,
    gameState: gameStates.NOT_STARTED,
    currentPlayerIndex: -1,
    piles: [ { cards: [] }, { cards: [] }, { cards: [] }, { cards: [] } ],
    discardPile: [ { cards: [] } ],
    historySchema: [],
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
            ]
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
        ]
    }],
    password: {
        salt: 'salt',
        token: 'token game'
    },
    gameComplete: false,
    gameStarted: false,
    teams: Range(0, 2).map(teamIndex=>(
        {
            score: 0,
            melds: [ ]
        })).toArray(),
    roundId: 1,
    currentPlayerIndex: 1,
    currentPlayerState: 'draw',
    piles: Range(0, 4).map(()=>(
        {
            cards: []
        })).toArray(),
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
    gameComplete: false,
    gameStarted: true,
    teams: Range(0, 2).map(teamIndex=>(
        {
            score: (teamIndex + 2) * 100,
            melds: [ ]
        })).toArray(),
    roundId: 1,
    currentPlayerIndex: 1,
    currentPlayerState: 'draw',
    piles: Range(0, 4).map(()=>(
        {
            cards: generateRandomCards(Math.floor(Math.random() * 15) + 40)
        })).toArray(),
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
    gameComplete: false,
    gameStarted: true,
    teams: Range(0, 2).map(teamIndex=>(
        {
            score: (teamIndex + 2) * 100,
            melds: [ ]
        })).toArray(),
    roundId: 1,
    currentPlayerIndex: 1,
    currentPlayerState: 'play',
    piles: Range(0, 4).map(()=>(
        {
            cards: generateRandomCards(Math.floor(Math.random() * 15) + 40)
        })).toArray(),
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
            hands: [
                {
                    cards: generateRandomCards(11),
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
    gameComplete: false,
    gameStarted: true,
    teams: Range(0, 2).map(()=>(
        {
            score: 0,
            melds: [ ]
        })).toArray(),
    roundId: 1,
    currentPlayerIndex: 1,
    currentPlayerState: 'draw',
    piles: Range(0, 4).map(()=>(
        {
            cards: generateRandomCards(57)
        })).toArray(),
    discardPile: {
        cards: []
    },
    history: []
});
