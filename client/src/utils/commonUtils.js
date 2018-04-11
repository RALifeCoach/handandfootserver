export default class CommonUtils {
    static formatGames(games) {
        return games.map(game=>(
            {
                name: game.name,
                players: ['North', 'East', 'South', 'West']
                    .map((direction, playerIndex)=>({
                        name: game.players[playerIndex].name,
                        userId: game.players[playerIndex].userId,
                        direction
                    }))
            }
        ))
    }
}