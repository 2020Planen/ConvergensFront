import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, Button, Form, InputGroup } from 'react-bootstrap';
import SendJson from "../fetch/SendJson";

var example = '{"field": "number","action": "greater than","value": "111","topic": "exit","priority": 1}'


class Condition extends Component {
    constructor(props) {
        super(props);
        this.state = { inputJson: "" }
    }
    onChange = evt => {
        this.setState({ [evt.target.id]: evt.target.value });
        console.log(this.state.inputJson)
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
                    <Col><Jumbotron>
                        <h3>Lav en condition</h3>
                        <Form>
                            <InputGroup>
                                <Form.Control
                                    id="inputJson"
                                    defaultValue={example}
                                    as="textarea" rows="7"
                                    required
                                    onChange={this.onChange}
                                />
                                <Button variant="outline-secondary" onClick={this.sendJson}>Send</Button>
                            </InputGroup>
                        </Form>
                    </Jumbotron></Col>
                </Row>
                <Row>
                    <Col><Jumbotron>
                        <h1>Hello, world!</h1>
                        <p>
                            This is a simple hero unit, a simple jumbotron-style component for calling
                            extra attention to featured content or information.
  </p>
                        <p>
                            <Button variant="primary">Learn more</Button>
                        </p>
                    </Jumbotron></Col>
                    <Col><Jumbotron>
                        <h1>Hello, world!</h1>
                        <p>
                            This is a simple hero unit, a simple jumbotron-style component for calling
                            extra attention to featured content or information.
  </p>
                        <p>
                            <Button variant="primary">Learn more</Button>
                        </p>
                    </Jumbotron></Col>
                </Row>
            </Container>
        )
    }
}

export default Condition;