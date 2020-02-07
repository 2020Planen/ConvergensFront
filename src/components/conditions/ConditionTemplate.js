import React from "react";
import { Col, Jumbotron, Button, Form, InputGroup } from 'react-bootstrap';


const Select = (selection) => {
    console.log("TEEEST" + selection)
    var value = ""
    switch (selection) {
        case "equals":
            value = "lig med";
            break;
        case "greater than":
            value = "større end";
            break;
        case "less than":
            value = "mindre end";
            break;
        default:
            value = "";
    }
    return value
}

const ConditionItem = ({ e, index }) => {
    console.log(e)
    return (
        <Jumbotron>
            <h3>Regel nr {index+1}</h3>
            <Form.Row>
                <Form.Group as={Col}>
                    <Form.Label>Field</Form.Label>
                    <Form.Control id={"field_"+index} required defaultValue={e.field} />
                </Form.Group>

                <Form.Group as={Col}>
                    <Form.Label>Action</Form.Label>
                    <Form.Control as="select" id={"action_"+index} required defaultValue={() => Select(e.action)}>
                        <option> ... </option>
                        <option> lig med </option>
                        <option> større end </option>
                        <option> mindre end </option>
                    </Form.Control>
                </Form.Group>

                <Form.Group as={Col} >
                    <Form.Label>Value</Form.Label>
                    <Form.Control id={"value_"+index} required defaultValue={e.value} />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} >
                    <Form.Label>Topic</Form.Label>
                    <Form.Control id={"topic_"+index} required defaultValue={e.topic} />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Priority</Form.Label>
                    <InputGroup>
                        <Form.Control id={"priority_"+index} required defaultValue={e.priority} />
                        <Button variant="outline-secondary" >Send</Button>
                    </InputGroup>
                </Form.Group>
            </Form.Row>
        </Jumbotron>
    )
}
export default ConditionItem;