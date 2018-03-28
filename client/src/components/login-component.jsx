import React from 'react';
import LoginForm from './login-form-component';
import { Grid, Row, Col } from 'react-bootstrap';

const LoginComponent = () => {
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

export default LoginComponent;
