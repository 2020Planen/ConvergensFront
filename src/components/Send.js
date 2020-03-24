import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Form,
  InputGroup
} from "react-bootstrap";
import SendJson from "../fetch/SendJson";

var example = `{"data": {"test1": "tesæt","test2": "testø","test3": "testå"},"metaData": {"name": "Elvira Powell","address": "Nørrebrogade 155","zip": 2200}}`;
const url = process.env.REACT_APP_RECEIVER_URL;
class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputJson: example,
      inputURL: url,
      inputProducer: "address",
      amount: "1",
      files: []
    };
  }
  onChange = evt => {
    this.setState({ [evt.target.id]: evt.target.value });
  };

  onFileChange = evt => {
    var files = [];
    for (var i = 0; i < evt.target.files.length; i++) {
      files.push(evt.target.files[i]);
    }
    this.setState({ files: files });
  };

  sendJson = async() => {
    const response = await SendJson.uploadFiles(
      this.state.inputURL + "/message/" + this.state.inputProducer,
      this.state.inputJson,
      this.state.files
    );
    alert(JSON.stringify(response));
  };
  multiSendJson = async() => {
    var jsonArray = [];
    for (var i = 0; i < parseInt(this.state.amount); i++) {
      jsonArray.push(JSON.parse(this.state.inputJson));
    }
    const body = JSON.stringify(jsonArray);
    //for (var i = 0; i < parseInt(this.state.amount); i++) {
    const response = await SendJson.uploadFiles(
      this.state.inputURL + "/bulk/" + this.state.inputProducer,
      body,
      this.state.files
    );
    alert(JSON.stringify(response));
    //  }
  };

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
                    defaultValue={this.state.inputProducer}
                    onChange={this.onChange}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group as={Row}>
                <Form.Label column>
                  Send besked antal gange
                  <Form.Control
                    id="amount"
                    type="number"
                    defaultValue={this.state.amount}
                    onChange={this.onChange}
                  />
                </Form.Label>

                <Form.Label column>
                  Tilføj filer
                  <Form.Control
                    id="files"
                    type="file"
                    onChange={this.onFileChange}
                    multiple
                  />
                </Form.Label>
              </Form.Group>

              <br />
              <Form.Label>JSON Body</Form.Label>
              <InputGroup>
                <Form.Control
                  id="inputJson"
                  defaultValue={example}
                  as="textarea"
                  rows="5"
                  onChange={this.onChange}
                />
                <InputGroup.Append>
                  <Button
                    variant="outline-secondary"
                    onClick={
                      this.state.amount === "1"
                        ? this.sendJson
                        : this.multiSendJson
                    }
                  >
                    Send
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Send;
