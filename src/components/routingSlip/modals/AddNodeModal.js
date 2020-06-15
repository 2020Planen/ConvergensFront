import React, { Component } from "react";
import { Form, Button, Modal, Col, InputGroup } from "react-bootstrap";

class AddNodeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onShow: this.props.showAddNodeModal,
      newNodeconditions: [{ field: "", action: "", value: "" }],
      newNode: {
        title: "",
        topic: "",
        children: [],
        config: {},
        parentKey: this.props.parentKey,
        isDirectory: true,
      },
    };
  }

  handleNodeConfigChange = (evt) => {
    var newConfig = this.state.newNode.config;
    newConfig[evt.target.id] = evt.target.value;

    this.setState({
      newNode: {
        ...this.state.newNode,
        config: newConfig,
      },
    });
  };

  onNodeConditionsChange = (evt) => {
    var value = evt.target.value;
    const index = evt.target.id.split("_")[1];

    var copy = [...this.state.newNodeconditions];
    copy[index][evt.target.id.split("_")[0]] = value;

    this.setState({
      newNodeconditions: copy,
    });
  };

  onNodeChange = (evt) => {
    this.setState({
      newNode: {
        ...this.state.newNode,
        [evt.target.id]: evt.target.value,
      },
    });
  };

  handleAddNodeCondition = () => {
    this.setState({
      newNodeconditions: this.state.newNodeconditions.concat([
        { field: "", action: "", value: "" },
      ]),
    });
  };

  handleRemoveNodeCondition = (idx) => () => {
    this.setState({
      newNodeconditions: this.state.newNodeconditions.filter(
        (s, sidx) => idx !== sidx
      ),
    });
  };

  createNewNode = () => {
    const title = this.state.newNode.topic;
    const subtitle = `${this.state.newNodeconditions[0].field} - ${this.state.newNodeconditions[0].action} - ${this.state.newNodeconditions[0].value}`;

    const newNode = {
      ...this.state.newNode,
      title: title,
      subtitle: subtitle,
      conditions: this.state.newNodeconditions,
    };

    this.props.createNewNode(newNode);

    this.setState({
      newNodeconditions: [{ field: "", action: "", value: "" }],
      newNodeConfig: {},
      newNode: {
        title: "",
        topic: "",
        parentKey: 0,
        children: [],
        config: {},
        isDirectory: true,
      },
    });
  };

  componentDidMount() {
    //console.log("hej");
  }

  render() {
    return (
      <>
        <Modal
          size="lg"
          show={this.state.onShow}
          onHide={this.props.handleClose}
          animation={true}
          autoFocus={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Tilføj Ny Rute</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.newNodeconditions.map((condition, idx) => (
              <Form.Row key={idx}>
                <Form.Group as={Col}>
                  <Form.Label>Field</Form.Label>
                  <Form.Control
                    as="select"
                    id={"field_" + idx}
                    required
                    placeholder={`field #${idx}`}
                    value={condition.field}
                    onChange={this.onNodeConditionsChange}
                  >
                    <option hidden> Vælg Field... </option>
                    <option> MetaData.getName </option>
                    <option> MetaData.getEmail </option>
                    <option> MetaData.getCpr </option>
                    <option> MetaData.getCvr </option>
                    <option> MetaData.getAddress </option>
                    <option> MetaData.getCity </option>
                    <option> MetaData.getZip </option>
                    <option> MetaData.getPhone </option>
                    <option> MetaData.getRegisteredAtDigitalPost </option>
                  </Form.Control>
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
                    <option hidden> Vælg Action... </option>
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
                      placeholder="Vælg value..."
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
                  as="select"
                  id={"topic"}
                  required
                  onChange={this.onNodeChange}
                >
                  <option hidden> Vælg Topic... </option>
                  <option> address-enricher </option>
                  <option> cvr-enricher </option>
                  <option> email-sender </option>
                  <option> digitalpost-sender </option>
                  <option> dp-check </option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            {this.state.newNode.topic === "email-sender" ? (
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Modtager Email</Form.Label>
                  <Form.Control
                    id="recipientMail"
                    required
                    placeholder="Modtager email"
                    onChange={this.handleNodeConfigChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Titel</Form.Label>
                  <Form.Control
                    id="subject"
                    required
                    placeholder="Email Titel"
                    onChange={this.handleNodeConfigChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Value</Form.Label>
                  <InputGroup>
                    <Form.Control
                      id="body"
                      required
                      placeholder="Email tekst"
                      onChange={this.handleNodeConfigChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={this.props.handleClose}
            >
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
