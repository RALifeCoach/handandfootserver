import React from 'react';
import {Modal,
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Button,
    Alert
} from 'react-bootstrap';
import {connect} from "react-redux";
import {
    addGameCancel,
    addGameRequest
} from "../actions/games-actions";
import validator from "validator";

class AddGameComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            gameName: '',
            password: ''
        };
    }

    getGameNameValidation() {
        if (validator.isEmpty(this.state.gameName)) {
            return 'error';
        }
        if (!validator.isEmail(this.state.gameName)) {
            return 'error';
        }
        return 'success';
    }

    handleGameNameChange(event) {
        this.setState({
            gameName: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }

    render() {
        return (
            <Modal
                show={this.props.gamesState === 'add game'}
                onHide={() => this.props.addGameCancel()}
                container={this}
                aria-labelledby="contained-modal-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                        Add a Game
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup
                            controlId="formAddGameName"
                            validationState={this.getGameNameValidation()}
                        >
                            <ControlLabel>Game Name:</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.gameName}
                                placeholder="Enter text"
                                onChange={(event) => this.handleGameNameChange(event)}
                                disabled={this.props.loginState === 'add request'}
                            />
                            <FormControl.Feedback/>
                            <HelpBlock>Must be unique.</HelpBlock>
                        </FormGroup>
                        <FormGroup
                            controlId="formAddGamePassword"
                        >
                            <ControlLabel>Password:</ControlLabel>
                            <FormControl
                                type="password"
                                value={this.state.password}
                                placeholder="Enter text"
                                onChange={(event) => this.handlePasswordChange(event)}
                                disabled={this.props.loginState === 'add request'}
                            />
                            <FormControl.Feedback/>
                            <HelpBlock>Optional password.</HelpBlock>
                        </FormGroup>
                        {this.props.gamesState === 'add failed' &&
                            <Alert bsStyle="warning">
                                Duplicate game name.
                            </Alert>
                        }
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.props.addGameCancel()}>Cancel</Button>
                    <Button
                        onClick={() => this.props.addGameRequest(this.state.gameName, this.state.password)}>Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    }
};

const mapStateToProps = state => {
    return {
        gamesState: state.reducers.games.gamesState
    }
};

const mapDispatchToProps = dispatch => ({
        addGameCancel: () => dispatch(addGameCancel()),
        addGameRequest: (gameName, password) => dispatch(addGameRequest(gameName, password))
    }
);

const AddGameConnection = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddGameComponent);

export default AddGameConnection;
