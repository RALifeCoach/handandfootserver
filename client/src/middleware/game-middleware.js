import {
    DRAW_CARD_PILE,
    updateGame
} from '../actions/game-actions';
import {
    ioError
} from '../actions/user-actions';
import Socket from './../utils/socket';

export default class GameMiddleware {
    static games({dispatch, getState}) {
        return next =>
            action => {
                switch (action.type) {
                    case DRAW_CARD_PILE:
                        GamesMiddleware.drawCardPile(getState(), action.pileIndex);
                        break;
                    default:
                        break;
                }
                return next(action);
            }
    }

    static drawCardPile(state, pileIndex) {
        Socket.sendDrawCardPile(state.reducers.game.gameName, state.reducers.game.direction, pileIndex);
    }
}