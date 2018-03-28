import GameRules from '../../src/events/gameRules';
import {undoOptions} from "../../src/constants";

describe("Game Rules", ()=>{
    describe("validateStatesAndActions", ()=>{
        beforeEach(()=>{
            GameRules.rules = {
                gameState1: {
                    playerState1: {
                        action1: 'action1'
                    }
                }
            }
        });

        test("Fail finding game state", ()=> {
            const {stateErr, action} = GameRules.validateStatesAndActions('xxx');
            expect(stateErr).toBe('Invalid game state: xxx');
        });

        test("Fail finding player state", ()=> {
            const {stateErr, action} = GameRules.validateStatesAndActions('gameState1', 'xxx');
            expect(stateErr).toBe('Invalid game/player state: gameState1/xxx');
        });

        test("Fail finding action", ()=> {
            const {stateErr, action} = GameRules.validateStatesAndActions('gameState1', 'playerState1', 'xxx');
            expect(stateErr).toBe('Invalid game/player/action: gameState1/playerState1/xxx');
        });

        test("Return action", ()=> {
            const {stateErr, action} = GameRules.validateStatesAndActions('gameState1', 'playerState1', 'action1');
            expect(action).toBe('action1');
        });
    });

    describe("performValidationAndAction", ()=>{
        let action,
            game;

        beforeEach(()=>{
            action = {
                validation: jasmine.createSpy(),
                execution: jasmine.createSpy(),
                undo: undoOptions.NA
            };
            game = {
                undo: [ 1, 2 ]
            };
        });

        test("Call validation, execution and do not touch undo (validation present, undo = NA).", ()=> {
            GameRules.performValidationAndAction(action, game, 'player', 'team', 'updateData');
            
            expect(action.validation).toHaveBeenCalledWith(game, 'player', 'team', 'updateData');
            expect(action.execution).toHaveBeenCalledWith(game, 'player', 'team', 'updateData');
            expect(game.undo).toEqual([ 1, 2 ]);
        });

        test("Call execution and clear undo (validation null, undo = CLEAR).", ()=> {
            action.validation = null;
            action.undo = undoOptions.CLEAR;

            GameRules.performValidationAndAction(action, game, 'player', 'team', 'updateData');

            expect(action.execution).toHaveBeenCalledWith(game, 'player', 'team', 'updateData');
            expect(game.undo).toEqual([]);
        });

        test("Call execution and add to undo (validation null, undo = SAVE).", ()=> {
            action.validation = null;
            action.undo = undoOptions.SAVE;

            GameRules.performValidationAndAction(action, game, 'player', 'team', 'updateData');

            expect(action.execution).toHaveBeenCalledWith(game, 'player', 'team', 'updateData');
            expect(game.undo).toEqual([ 1, 2, {"undo": [1, 2]} ]);
        });
    });
});