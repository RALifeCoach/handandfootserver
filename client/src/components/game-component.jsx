import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { connect } from "react-redux";
import {
    drawCardPile
} from "../actions/game-actions";

const GameComponent = props => {
    return (
        <Grid>
            <Row className="show-grid">
                <Col xs={12} md={8} className="border border-dark">
                    {props.players && props.players.map((player, playerIndex)=>(
                        <Col xs={3} md={2} key={playerIndex} className='border border-dark border-right'>
                            <span>{player.name}</span>
                        </Col>
                    ))}
                </Col>
            </Row>
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        gameState: state.reducers.game.gameState,
        player: state.reducers.game.player,
        players: state.reducers.game.players
    }
};

const mapDispatchToProps = dispatch => ({
        drawCardPile: (pileIndex) => dispatch(drawCardPile(pileIndex))
    }
);

const GameConnection = connect(
    mapStateToProps,
    mapDispatchToProps
)(GameComponent);

export default GameConnection;
