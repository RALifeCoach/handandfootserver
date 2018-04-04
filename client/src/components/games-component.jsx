import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import AddGameComponent from './add-game-component';
import { connect } from "react-redux";
import { push } from 'react-router-redux';
import {
    requestList,
    addGameClick,
    joinGame
} from "../actions/games-actions";

const GamesComponent = props => {
    if (props.gamesState === 'login') {
        props.gotoLogin();
        return null;
    }
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
                    {props.games.map((game, gameIndex) => (
                        <div key={gameIndex}>
                            <Row className="show-grid">
                                <Col xs={9} md={6}>
                                    {game.name}
                                </Col>
                            </Row>
                            <Row className="show-grid">
                                {game.players.map((player, playerIndex) => (
                                    <Col xs={3} md={1} key={playerIndex}>
                                        <div onClick={player.name
                                            ? null
                                            : ()=>props.joinGame(game.name, null, player.direction)}>
                                            {player.direction}: {player.name || 'Open'}
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))}
                </div>
            }
            <AddGameComponent/>
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        gamesState: state.reducers.games.gamesState,
        games: state.reducers.games.games
    }
};

const mapDispatchToProps = dispatch => ({
        gotoLogin: () => dispatch(push('/')),
        requestList: () => dispatch(requestList()),
        addGameClick: () => dispatch(addGameClick()),
        joinGame: (gameName, password, direction) => dispatch(joinGame(gameName, password, direction))
    }
);

const GamesConnection = connect(
    mapStateToProps,
    mapDispatchToProps
)(GamesComponent);

export default GamesConnection;
