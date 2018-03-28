import Socket from '../utils/socket';
import {
    JOIN_GAME,
    REQUEST_LIST,
    refreshList
} from '../actions/games-actions';
import { push } from 'react-router-redux';
import RestCalls from './../utils/rest-calls';

export default class GamesMiddleware {
    static games({dispatch, getState}) {
        return next =>
            action => {
                switch (action.type) {
                    case REQUEST_LIST:
                        GamesMiddleware.sendRequestList(getState, dispatch);
                        break;
                    default:
                        break;
                }
                return next(action);
            }
    }

    static sendRequestList(getState, dispatch) {
        console.log(getState());
        RestCalls.sendRequestList(getState().reducers.login.token)
            .then(response=>{
                if (response.status !== 200) {
                    dispatch(ioError(response.statusText));
                } else {
                    dispatch(refreshList(this.formatGames(response.data)));
                }
            });
    }

    static formatGames(games) {
        return games.map(game=>(
            {
                name: game.name,
                players: [{teamIndex: 0, playerIndex: 0, direction: 'North'},
                    {teamIndex: 1, playerIndex: 0, direction: 'East'},
                    {teamIndex: 0, playerIndex: 1, direction: 'South'},
                    {teamIndex: 1, playerIndex: 1, direction: 'West'}]
                    .map(playerData=>({
                        name: game.teams[playerData.teamIndex].players[playerData.playerIndex].name,
                        direction: playerData.direction
                    }))
            }
        ))
    }
}