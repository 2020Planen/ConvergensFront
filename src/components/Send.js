import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, Button, Form, InputGroup } from 'react-bootstrap';
import SendJson from "../fetch/SendJson";


var example = `{"metaData":{"address":"Nordre fasanvej 255","name":"convergens","city":"nørrebro","phone":"28282828","zip":2200},"data":{"yikes":"yikes","tester":"tester"}}`
var url = "http://localhost:8080/receiver/"

class Send extends Component {
    constructor(props) {
        super(props);
        this.state = { inputJson: example, inputURL: url, inputProducer: "testParam" }
    }
    onChange = evt => {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    sendJson = async evt => {
        evt.preventDefault();
        console.log(this.state.inputURL + this.state.inputProducer)
        evt.preventDefault();
        let msg = await SendJson.SendJson(this.state.inputURL + this.state.inputProducer, "POST", this.state.inputJson)
        this.setState({ msg })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h3>Send Json til Rest:</h3>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>URL</Form.Label>
                                    <Form.Control
                                        id="inputURL"
                                        defaultValue={url}
                                        required
                                        onChange={this.onChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Producer</Form.Label>
                                    <Form.Control
                                        id="inputProducer"
                                        defaultValue="testParam"
                                        onChange={this.onChange}
                                    />
                                </Form.Group>
                            </Form.Row>

                            <br />
                            <Form.Label>JSON Body</Form.Label>
                            <InputGroup>

                                <Form.Control
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

export default Send;