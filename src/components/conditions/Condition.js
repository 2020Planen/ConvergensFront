import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, Button, Form, InputGroup } from 'react-bootstrap';
import SendJson from "../../fetch/SendJson";
//import ConditionTemplate from "./ConditionTemplate"

//var url = "http://cis-x.convergens.dk:5984/routingslips/"
const routingSlipUrl = "http://cis-x.convergens.dk:5984/routingslips/_design/RoutingSlip/_view/by_producerReference?key="


const ConditionItem = ({ e, index }) => (
    <Jumbotron>
        <h3>Regel nr {index + 1}</h3>
        <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>Field</Form.Label>
                <Form.Control id={"field_" + index} required defaultValue={e.field} />
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Action</Form.Label>
                <Form.Control as="select" id={"action_" + index} required>
                    <option> ... </option>
                    <option> lig med </option>
                    <option> større end </option>
                    <option> mindre end </option>
                </Form.Control>
            </Form.Group>

            <Form.Group as={Col} >
                <Form.Label>Value</Form.Label>
                <Form.Control id={"value_" + index} required defaultValue={e.value} />
            </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group as={Col} >
                <Form.Label>Topic</Form.Label>
                <Form.Control id={"topic_" + index} required defaultValue={e.topic} />
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>Priority</Form.Label>
                <InputGroup>
                    <Form.Control id={"priority_" + index} required defaultValue={e.priority} />
                    <Button variant="outline-secondary" >Send</Button>
                </InputGroup>
            </Form.Group>
        </Form.Row>
    </Jumbotron>
)



class RoutingSlip extends Component {
    constructor(props) {
        super(props);
        this.state = { field: "", action: "", value: "", topic: "", priority: "", producerReference: "test", routingData: "" }
    }

    onChange = evt => {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    onSelect = evt => {
        var value = ""
        switch (evt.target.value) {
            case "lig med":
                value = "equals";
                break;
            case "større end":
                value = "greater than";
                break;
            case "mindre end":
                value = "less than";
                break;
            default:
                value = "";
        }
        this.setState({ [evt.target.id]: value });
    }

    getRoutingSlipUrl = producerReference => {

        return routingSlipUrl + '%22' + producerReference + '%22'
    }
    /*
        sendJson = async evt => {
            
            const uuidv4 = require('uuid/v4');
            const dbUrl = url+uuidv4()
    
            console.log(this.state)
            let msg = await SendJson.SendJson(dbUrl, "PUT", JSON.stringify(this.state))
            alert(msg)
        }
    */


    getRoutingSlip = async evt => {
        //console.log(this.getRoutingSlipUrl(this.state.producerReference))
        const getUrl = this.getRoutingSlipUrl(this.state.producerReference)

        let routingDataNew = await SendJson.SendJson(getUrl, "GET")
        console.log(routingDataNew)
        if (routingDataNew.rows.length > 0) {
            this.setState({ routingData: routingDataNew });
        }
    };

    conditionParser = () => {
        if (this.state.routingData === "" || typeof this.state.routingData === "undefined" || this.state.routingData === null) {
            return <p>  </p>
        } else {
            if (this.state.routingData.rows.length > 0) {
                return <>{this.state.routingData.rows[0].value.map((e, index) => <ConditionItem key={index} e={e} index={index} />)}</>;
            }
        }
    }


    render() {
        return (
            <Row>
                <Col>
                    <Form.Group as={Col}>
                        <Form.Label>Søg efter en routing slip for en producer reference</Form.Label>
                        <InputGroup>
                            <Form.Control id="producerReference" required placeholder="producer reference" onChange={this.onChange} />
                            <Button variant="outline-secondary" onClick={this.getRoutingSlip}>Send</Button>
                        </InputGroup>
                    </Form.Group>

                    <this.conditionParser />

                    <Jumbotron>
                        <h3>Ny regel</h3>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Field</Form.Label>
                                <Form.Control id="field" required onChange={this.onChange} />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Action</Form.Label>
                                <Form.Control as="select" id="action" required onChange={this.onSelect}>
                                    <option> vælg en... </option>
                                    <option> lig med </option>
                                    <option> større end </option>
                                    <option> mindre end </option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} >
                                <Form.Label>Value</Form.Label>
                                <Form.Control id="value" required onChange={this.onChange} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Topic</Form.Label>
                                <Form.Control id="topic" required onChange={this.onChange} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Priority</Form.Label>
                                <InputGroup>
                                    <Form.Control id="priority" required onChange={this.onChange} />
                                    <Button variant="outline-secondary" onClick={this.getRoutingSlip}>Send</Button>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                    </Jumbotron>
                </Col>
            </Row>

        );
    }
}

function Temp() {
    return (

        <Row>
            <Col>
                <Jumbotron>
                    <h1>Hello, world!</h1>
                    <p>
                        This is a simple hero unit, a simple jumbotron-style component for calling
                        extra attention to featured content or information.
</p>
                    <p>
                        <Button variant="outline-secondary">Learn more</Button>
                    </p>
                </Jumbotron>
            </Col>
            <Col>
                <Jumbotron>
                    <h1>Hello, world!</h1>
                    <p>
                        This is a simple hero unit, a simple jumbotron-style component for calling
                        extra attention to featured content or information.
</p>
                    <p>
                        <Button variant="outline-secondary">Learn more</Button>
                    </p>
                </Jumbotron>
            </Col>
        </Row>
    )
}

function Condition() {
    return (
        <Container>
            <Row>
                <Col>
                    <Jumbotron><h3>Rediger i en routing slip</h3></Jumbotron>
                    <RoutingSlip />
                    <Temp />
                </Col>
            </Row>
        </Container>
    )
}

export default Condition;