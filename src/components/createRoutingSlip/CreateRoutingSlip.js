import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, Form, Button, InputGroup } from 'react-bootstrap';
import SendJson from "../../fetch/SendJson";
var url = "http://cis-x.convergens.dk:5984/routingslips/"

class CreateRoutingSlip extends Component {
    constructor(props) {
        super(props);
        this.state = { producerReference: "", conditionsList: jsonExample }
    }

    createRoutingSlipJson = () => {
        var jsonObj = `{"producerReference": "${this.state.producerReference}", ${this.state.conditionsList.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, '')}}`
        return jsonObj
    }


    sendJson = async evt => {

        const uuidv4 = require('uuid/v4');
        const dbUrl = url + uuidv4()

        const data = this.createRoutingSlipJson()
        console.log(data)

        let response = await SendJson.SendJson(dbUrl, "PUT", data)
        alert(response)
    }

    onChange = evt => {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h3>Opret en routing slip</h3>
                            <br />
                            <br />
                            <Form.Group>

                                <Form.Label>Vælg en producer reference</Form.Label>
                                <Form.Control id="producerReference" required placeholder="producer reference navn" onChange={this.onChange} />
                                <br />

                                <Form.Label>Skriv Regler</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        id="conditionsList"
                                        defaultValue={jsonExample}
                                        as="textarea" rows="10"
                                        onChange={this.onChange}
                                    />

                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" onClick={this.sendJson}>Send</Button>
                                    </InputGroup.Append>

                                </InputGroup>
                            </Form.Group>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default CreateRoutingSlip;


















var jsonExample = ` "conditionsList": [
        {
            "field": "number",
            "action": "greater than",
            "value": "111",
            "topic": "address-enrichment",
            "priority": 9.0,
            "conditions": [
                {
                    "field": "number",
                    "action": "greater than",
                    "value": "111",
                    "topic": "address-enrichment",
                    "priority": 9.0,
                    "conditions": []
                }
            ]
        }
    ]
`