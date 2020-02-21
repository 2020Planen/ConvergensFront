import React, { Component } from "react";
import { Form, Button, Modal, Col, InputGroup } from "react-bootstrap";

const getNodeKey = ({ treeIndex }) => treeIndex;

class AddNodeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleClose = () => this.setState({ setShow: false });
  handleShow = ({ parentKey }) => {
    this.setState({
      newNode: {
        ...this.state.newNode,
        parentKey: parentKey
      }
    });
    this.setState({ setShow: true });
  };

  handleAddNodeCondition = () => {
    this.setState({
      newNodeconditions: this.state.newNodeconditions.concat([
        { field: "", action: "", value: "" }
      ])
    });
  };

  handleRemoveNodeCondition = idx => () => {
    this.setState({
      newNodeconditions: this.state.newNodeconditions.filter(
        (s, sidx) => idx !== sidx
      )
    });
  };

  createNewNode = () => {
    const title = this.state.newNode.topic;
    const subtitle = `${this.state.newNodeconditions[0].field} - ${this.state.newNodeconditions[0].action} - ${this.state.newNodeconditions[0].value}`;

    this.setState({
      treeData: this.addNodeUnderParent({
        treeData: this.state.treeData,
        parentKey: this.state.newNode.parentKey,
        expandParent: true,
        getNodeKey,
        newNode: {
          ...this.state.newNode,
          title: title,
          subtitle: subtitle,
          conditions: this.state.newNodeconditions
        }
      }).treeData,
      setShow: false
    });

    this.setState({
      newNodeconditions: [{ field: "", action: "", value: "" }],
      newNode: {
        title: "",
        topic: "",
        parentKey: 0,
        children: [],
        isDirectory: true
      }
    });
  };
  render() {
    return (
      <>
        <Modal
          size="lg"
          show={this.state.setShow}
          onHide={this.handleClose}
          animation={true}
          autoFocus={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Tilføj Ny Regel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.newNodeconditions.map((condition, idx) => (
              <Form.Row key={idx}>
                <Form.Group as={Col}>
                  <Form.Label>Field</Form.Label>
                  <Form.Control
                    id={"field_" + idx}
                    required
                    placeholder={`field #${idx}`}
                    value={condition.field}
                    onChange={this.onNodeConditionsChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Action</Form.Label>
                  <Form.Control
                    as="select"
                    id={"action_" + idx}
                    value={condition.action}
                    required
                    onChange={this.onNodeConditionsChange}
                  >
                    <option hidden> ... </option>
                    <option> lig med </option>
                    <option> større end </option>
                    <option> mindre end </option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Value</Form.Label>
                  <InputGroup>
                    <Form.Control
                      id={"value_" + idx}
                      required
                      placeholder={`value #${idx}`}
                      value={condition.value}
                      onChange={this.onNodeConditionsChange}
                    />
                    <Button
                      disabled={
                        this.state.newNodeconditions.length > 1 ? false : true
                      }
                      variant="outline-danger"
                      onClick={this.handleRemoveNodeCondition(idx)}
                    >
                      -
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            ))}
            <Form.Row>
              <Form.Group as={Col} />
              <Form.Group as={Col} />
              <Form.Group as={Col} />
              <Button
                variant="outline-success"
                onClick={this.handleAddNodeCondition}
              >
                +
              </Button>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Topic</Form.Label>
                <Form.Control
                  id="topic"
                  required
                  placeholder="topic"
                  onChange={this.onNodeChange}
                />
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.handleClose}>
              Luk
            </Button>
            <Button variant="secondary" onClick={this.createNewNode}>
              Tilføj regel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AddNodeModal;