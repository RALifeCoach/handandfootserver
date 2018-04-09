import {
    JOIN_GAME
} from '../actions/games-actions';
import {
    UPDATE_GAME,
    DRAW_CARD_PILE
} from '../actions/game-actions';

const initialState = {
    gameState: 'not connected',
    game: null,
    players: null,
    player: null,
    piles: null,
};

export default function GameReducer(state = {gameState: 'not connected'}, action) {
    console.log('game reducer: '+ JSON.stringify(state));
    switch (action.type) {
        case JOIN_GAME:
            return Object.assign({}, state, {
                gameState: 'joining',
                gameName: action.gameName,
                direction: action.direction
            });
        case UPDATE_GAME:
            return Object.assign({}, state, {
                gameState: action.game.gameState,
                teams: action.game.teams,
                players: action.game.players,
                player: action.game.players[0],
                piles: action.game.piles,
                discardPile: action.game.discardPile,
                messages: action.game.messages,
                history: action.game.history,
                undo: action.game.undo
            });
        case DRAW_CARD_PILE:
            return Object.assign({}, state, {
                gameState: 'request sent'
            });
        default:
            return state;
    }
}
