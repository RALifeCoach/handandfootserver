import { gameStates, playerStates, actions, undoOptions } from '../constants';
import GameEvents from './gameActions';
import GameValidations from './gameValidations';

class GameRules {
    constructor() {
        this.rules = {
            [gameStates.NOT_STARTED]: {
                [playerStates.NOT_JOINED]: {
                    [actions.JOIN_GAME]: {
                        validation: null,
                        execution: GameEvents.joinGame,
                        undo: undoOptions.NA
                    }
                }
            },
            [gameStates.IN_PROGRESS]: {
                [playerStates.INITIAL_DRAW]: {
                    [actions.DRAW_PILE]: {
                        validation: GameValidations.drawFromPile,
                        execution: GameEvents.drawFromPile,
                        undo: undoOptions.CLEAR
                    },
                    [actions.UP7_DRAW]: {
                        validation: GameValidations.drawFromDiscard,
                        execution: GameEvents.drawFromDiscard,
                        undo: undoOptions.SAVE
                    }
                },
                [playerStates.DRAW]: {
                    [actions.DRAW_PILE]: {
                        validation: GameValidations.drawFromPile,
                        execution: GameEvents.drawFromPile,
                        undo: undoOptions.CLEAR
                    }
                },
                [playerStates.PLAY]: {
                    [actions.ADD_TO_MELD]: {
                        validation: GameValidations.addToBoard,
                        execution: GameEvents.addToBoard,
                        undo: undoOptions.SAVE
                    },
                    [actions.ADD_TO_BOARD]: {
                        validation: GameValidations.addToBoard,
                        execution: GameEvents.addToBoard,
                        undo: undoOptions.SAVE
                    },
                    [actions.DISCARD]: {
                        validation: GameValidations.discard,
                        execution: GameEvents.discard,
                        undo: undoOptions.NA
                    }
                },
                [playerStates.DISCARD_PENDING]: {
                    [actions.ACCEPT_DISCARD]: {
                        validation: null,
                        execution: GameEvents.acceptDiscard,
                        undo: undoOptions.CLEAR
                    },
                    [actions.CANCEL]: {
                        validation: null,
                        execution: GameEvents.cancelDiscard,
                        undo: undoOptions.NA
                    }
                },
                [playerStates.UP7_PENDING]: {
                    [actions.ADD_TO_MELD]: {
                        validation: GameValidations.addToMeld,
                        execution: GameEvents.addToMeld,
                        undo: undoOptions.SAVE
                    },
                    [actions.ADD_TO_BOARD]: {
                        validation: GameValidations.addToBoard,
                        execution: GameEvents.addToBoard,
                        undo: undoOptions.SAVE
                    }
                },
                [playerStates.ANY]: {
                    [actions.RESIGN_REQUEST]: {
                        validation: null,
                        execution: GameEvents.resignRequest,
                        undo: undoOptions.NA
                    },
                    [actions.SORT_MELDS]: {
                        validation: null,
                        execution: GameEvents.sortMelds,
                        undo: undoOptions.NA
                    },
                    [actions.SORT_RUNS]: {
                        validation: null,
                        execution: GameEvents.sortRuns,
                        undo: undoOptions.NA
                    },
                    [actions.PIN_CARD]: {
                        validation: GameValidations.pinCard,
                        execution: GameEvents.pinCard,
                        undo: undoOptions.NA
                    },
                    [actions.UNPIN_CARD]: {
                        validation: GameValidations.unpinCard,
                        execution: GameEvents.unpinCard,
                        undo: undoOptions.NA
                    },
                    [actions.UNDO]: {
                        validation: GameValidations.undo,
                        execution: GameEvents.undo,
                        undo: undoOptions.NA
                    }
                }
            },
            [gameStates.PENDING_RESIGN]: {
                [playerStates.ANY]: {
                    [actions.ACCEPT_RESIGN]: {
                        validation: null,
                        execution: GameEvents.acceptResign,
                        undo: undoOptions.CLEAR
                    },
                    [actions.CANCEL]: {
                        validation: null,
                        execution: GameEvents.cancelResign,
                        undo: undoOptions.NA
                    }
                }
            },
            [gameStates.PENDING_END]: {
                [playerStates.ANY]: {
                    [actions.ACCEPT_END]: {
                        validation: null,
                        execution: GameEvents.acceptEnd,
                        undo: undoOptions.CLEAR
                    },
                    [actions.CANCEL]: {
                        validation: null,
                        execution: GameEvents.cancelEnd,
                        undo: undoOptions.NA
                    }
                }
            }
        }
    }

    validateStatesAndActions(gameState, playerState, actionType) {
        const gameRule = this.rules[gameState];
        if (!gameRule) {
            return { stateErr: 'Invalid game state: ' + gameState };
        }
        const playerRule = gameRule[playerState];
        if (!playerRule) {
            return { stateErr: `Invalid game/player state: ${gameState}/${playerState}` };
        }
        const action = playerRule[actionType];
        if (!action) {
            return { stateErr: `Invalid game/player/action: ${gameState}/${playerState}/${actionType}` };
        }
        return { action };
    }

    performValidationAndAction(action, game, player, team, updateData) {
        if (action.validation) {
            const err = action.validation(game, player, team, updateData);
            if (err) {
                return err;
            }
        }
        if (action.undo === undoOptions.SAVE) {
            game.undo.push(JSON.parse(JSON.stringify(game)));
        }
        action.execution(game, player, team, updateData);
        if (action.undo === undoOptions.CLEAR) {
            game.undo = [];
        }
    }
}

export default new GameRules()
