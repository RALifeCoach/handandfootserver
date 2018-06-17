import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import PlayingCard from 'react-playing-card';
import { connect } from "react-redux";
import {
    drawCardPile
} from "../actions/game-actions";

const GameComponent = props => {
    const namesStyle = {
        width: '100%',
        padding: '5px'
    };

    return (
        <Grid>
            <Row className="show-grid">
                <Col xs={12} md={8}>
                    {props.players && props.players.map((player, playerIndex)=>{
                        const classes = playerIndex === props.currentPlayerIndex
                            ? 'card bg-danger'
                            : playerIndex === 0
                                ? 'bg-primary'
                                : 'bg-secondary';
                        return (
                            <Col xs={12 / props.players.length} key={playerIndex} className='border border-dark border-right'>
                                <div xs={12} className={classes} style={namesStyle}>
                                    <span>{player.name || 'Open'}</span>
                                </div>
                            </Col>
                        )
                    })}
                </Col>
            </Row>
            <Row className="show-grid">
                <Col xs={12} md={8}>
                    <PlayingCard suit='C' rank='5' width='25px' size={.5}/>
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
