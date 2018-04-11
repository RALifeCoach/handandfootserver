import React from 'react';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import AddGameComponent from './add-game-component';
import { connect } from "react-redux";
import {
    addGameClick,
    rejoinGame,
    joinGame
} from "../actions/games-actions";

const GamesComponent = props => {
    return (
        <Grid>
            <Row className="show-grid">
                <Col xs={9} md={6}>
                    Game List
                </Col>
                {props.gamesState === 'success' &&
                    <Col xs={3} md={6}>
                        <Button bsStyle="primary"
                                onClick={() => props.addGameClick()}>
                            Add Game
                        </Button>
                    </Col>
                }
            </Row>
            {props.gamesState === 'success' &&
                <div>
                    {props.games.length === 0 &&
                        <Row className="show-grid">
                            <Col xs={9} md={6}>
                                No games to display
                            </Col>
                        </Row>
                    }
                    {props.games.map((game, gameIndex) => {
                        const playerInGame = Boolean(game.players.find(player=>player.userId === props.userId));
                        return (
                            <div key={gameIndex}>
                                <Row className="show-grid">
                                    <Col xs={12} md={9}>
                                        {game.name}
                                    </Col>
                                </Row>
                                <Row className="show-grid">
                                    {game.players.map((player, playerIndex) => (
                                        <Col xs={3} key={playerIndex}>
                                            {player.direction}: {player.name || 'Open'}
                                            {!player.name && !playerInGame &&
                                                <Glyphicon glyph="download"
                                                           onClick={()=>props.joinGame(game.name, null, player.direction)}
                                                />
                                            }
                                            {player.name && player.userId === props.userId &&
                                                <Glyphicon glyph="download-alt"
                                                           onClick={()=>props.rejoinGame(game.name, null, player.direction)}
                                                />
                                            }
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )
                    })}
                </div>
            }
            <AddGameComponent/>
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        gamesState: state.reducers.games.gamesState,
        games: state.reducers.games.games,
        userId: state.reducers.user.userId
    }
};

const mapDispatchToProps = dispatch => ({
        addGameClick: () => dispatch(addGameClick()),
        joinGame: (gameName, password, direction) => dispatch(joinGame(gameName, password, direction)),
        rejoinGame: (gameName, password, direction) => dispatch(rejoinGame(gameName, password, direction))
    }
);

const GamesConnection = connect(
    mapStateToProps,
    mapDispatchToProps
)(GamesComponent);

export default GamesConnection;
