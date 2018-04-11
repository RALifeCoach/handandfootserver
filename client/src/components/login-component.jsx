import React from 'react';
import LoginForm from './login-form-component';
import { Grid, Row, Col } from 'react-bootstrap';
import cookie from 'react-cookies';
import {connect} from "react-redux";
import {loginSuccessful} from "../actions/user-actions";

const LoginComponent = props => {
    const cookieData = cookie.load('login');
    if (cookieData && cookieData.token && cookieData.userId) {
        props.autoLogin(cookieData.token, cookieData.userId);
        return null;
    }
    return (
        <Grid>
            <Row className="show-grid">
                <Col xs={9} md={6}>
                    <LoginForm/>
                </Col>
            </Row>
        </Grid>
    );
};

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => ({
        autoLogin: (token, userId) => dispatch(loginSuccessful(token, userId))
    }
);

const LoginConnection = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginComponent);

export default LoginConnection;
