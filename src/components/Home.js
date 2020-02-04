import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, Button, FormControl, InputGroup } from 'react-bootstrap';
import SendJson from "../fetch/SendJson";


var example = `{"address":"Nordre fasanvej 255","name":"convergens","city":"nørrebro","phone":"28282828","zip":2200}`

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { inputJson: example }
    }
    onChange = evt => {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    sendJson = async evt => {
        evt.preventDefault();
        console.log(this.state.inputJson)
        evt.preventDefault();
        let msg = await SendJson.SendJson("POST", this.state.inputJson)
        this.setState({ msg })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h3>Send Json til Rest:</h3>
                            <InputGroup>
                                <FormControl
                                    id="inputJson"
                                    defaultValue={example}
                                    as="textarea" rows="5"
                                    onChange={this.onChange}
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={this.sendJson}>Send</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Home;