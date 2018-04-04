export default class CommonUtils {
    static formatGames(games) {
        return games.map(game=>(
            {
                name: game.name,
                players: [{teamIndex: 0, playerIndex: 0, direction: 'North'},
                    {teamIndex: 1, playerIndex: 0, direction: 'East'},
                    {teamIndex: 0, playerIndex: 1, direction: 'South'},
                    {teamIndex: 1, playerIndex: 1, direction: 'West'}]
                    .map(playerData=>({
                        name: game.players[playerData.playerIndex].name,
                        direction: playerData.direction
                    }))
            }
        ))
    }
}