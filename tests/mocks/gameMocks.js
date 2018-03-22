import { Map, Range } from 'immutable';
import { sorts } from '../../src/constants';

const generateRandomCards = numberOfCards => {
    return Range(0, numberOfCards).map(() => (
        {
            suit: Math.floor(Math.random() * 5),
            value: Math.floor(Math.random() * 13)
        }
    )).toArray();
};

export const gameInitialized = new Map({
    name: 'test game 1',
    players: Range(0, 4).map(()=>(
        {
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
            cards: []
        })).toArray(),
    discardPile: {
        cards: []
    },
    history: []
});

export const game3Players = new Map({
    name: 'test game 1',
    players: Range(0, 3).map(playerIndex=>(
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
                    cards: [],
                    sort: 'none'
                },
                {
                    cards: [],
                    sort: 'none'
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

export const gameInProgress = new Map({
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
