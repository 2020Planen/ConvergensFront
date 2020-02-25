import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, Button, Form, InputGroup } from 'react-bootstrap';
import SendJson from "../fetch/SendJson";


var example = `{"metaData":{"address":"Nordre fasanvej 255","name":"convergens","city":"nørrebro","phone":"28282828","zip":2200},"data":{"yikes":"yikes","tester":"tester"}}`
var url = "http://localhost:8080/receiver/"

class Send extends Component {
    constructor(props) {
        super(props);
        this.state = { inputJson: example, inputURL: url, inputProducer: "testParam", amount: "1" }
    }
    onChange = evt => {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    sendJson = async evt => {
        evt.preventDefault();
        console.log(this.state.inputJson)
        console.log("single send --")
        SendJson.SendJson(this.state.inputURL + this.state.inputProducer, "POST", this.state.inputJson)
    }
    multiSendJson = async evt => {
        var jsonArray = []
        for(var i = 0; i < parseInt(this.state.amount); i++){
            jsonArray.push(this.state.inputJson)
        }
        console.log(jsonArray)
        console.log(this.state.inputURL+ "bulk/" + this.state.inputProducer)
        console.log("multi send --")
        SendJson.SendJson(this.state.inputURL + "bulk/","POST", jsonArray)
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
                            <Form.Group as={Row}>
                                
                                <Form.Label column >
                                    Send besked antal gange:
                                    <Form.Control 
                                    id="amount"
                                    defaultValue={this.state.amount}
                                    onChange={this.onChange}
                                />
                                </Form.Label>
                          
                              


                            </Form.Group>

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
                                    <Button variant="outline-secondary" onClick={this.state.amount === "1" ? this.sendJson : this.multiSendJson}>Send</Button>
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