import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from "react-redux";

const ErrorComponent = props => {
    return (
        <Grid>
            <Row className="show-grid">
                <Col xs={9} md={6}>
                    Error
                </Col>
            </Row>
            <Row className="show-grid">
                <Col xs={9} md={6}>
                    {props.message}
                </Col>
            </Row>
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        message: state.reducers.user.error
    }
};

const ErrorConnection = connect(
    mapStateToProps
)(ErrorComponent);

export default ErrorConnection;
