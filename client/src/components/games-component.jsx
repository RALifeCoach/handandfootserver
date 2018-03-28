import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from "react-redux";
import { push } from 'react-router-redux';
import { joinGame } from "../actions/games-actions";

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
            </Row>
            {props.gamesState !== 'waiting' &&
                props.games.map(game => (
                    <div>
                        <Row className="show-grid">
                            <Col xs={9} md={6}>
                                {game.name}
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            {game.players.map(player => (
                                <Col xs={3} md={1}>
                                    <div onClick={player.name
                                        ? null
                                        : props.joinGame(game.name, null, player.direction)}>
                                        {player.direction}: {player.name || 'Open'}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))
            }
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
        joinGame: (gameName, password, direction) => dispatch(joinGame(gameName, password, direction))
    }
);

const GamesConnection = connect(
    mapStateToProps,
    mapDispatchToProps
)(GamesComponent);

export default GamesConnection;
