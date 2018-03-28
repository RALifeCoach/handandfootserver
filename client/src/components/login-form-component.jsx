import React from 'react';
import validator from 'validator';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux'
import { login } from '../actions/login-actions';

class LoginFormComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            userId: '',
            password: ''
        };
    }

    getUserIdValidation() {
        if (validator.isEmpty(this.state.userId)) {
            return 'error';
        }
        if (!validator.isEmail(this.state.userId)) {
            return 'error';
        }
        return 'success';
    }

    getPasswordValidation() {
        if (validator.isEmpty(this.state.password)) {
            return 'error';
        }
        return 'success';
    }

    handleUserIdChange(event) {
        this.setState({
            userId: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }

    render() {
        console.log('render');
        console.log(this.props);
        return (
            <form>
                <FormGroup
                    controlId="formUserId"
                    validationState={this.getUserIdValidation()}
                >
                    <ControlLabel>User Id:</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.userId}
                        placeholder="Enter text"
                        onChange={(event)=>this.handleUserIdChange(event)}
                        disabled={this.props.loginState === 'waiting'}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Must be a valid email.</HelpBlock>
                </FormGroup>
                <FormGroup
                    controlId="formPassword"
                    validationState={this.getPasswordValidation()}
                >
                    <ControlLabel>Password:</ControlLabel>
                    <FormControl
                        type="password"
                        value={this.state.password}
                        placeholder="Enter text"
                        onChange={(event)=>this.handlePasswordChange(event)}
                        disabled={this.props.loginState === 'waiting'}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Must not be empty.</HelpBlock>
                </FormGroup>
                {this.props.loginState === 'failed' &&
                    <Alert bsStyle="warning">
                        Login failed.
                    </Alert>
                }
                <Button bsStyle="primary"
                        disabled={this.props.loginState === 'waiting'}
                        onClick={this.props.loginState === 'waiting'
                            ? null
                            : ()=>this.props.login(this.state.userId, this.state.password)}>
                    Login
                </Button>
            </form>
        );
    }
}

const mapStateToProps = state => {
    console.log('here');
    console.log(state.reducers.login);
    return {
        loginState: state.reducers.login.loginState
    }
};

const mapDispatchToProps = dispatch => ({
        login: (userId, password) => dispatch(login(userId, password))
    }
);

const LoginFormConnection = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginFormComponent);

export default LoginFormConnection;
