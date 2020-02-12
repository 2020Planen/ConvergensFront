import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Tabs,
  Tab,
  InputGroup,
  Form,
  Button
} from "react-bootstrap";
import SendJson from "../../fetch/SendJson";

const url =
  "http://cis-x.convergens.dk:5984/finished/_design/by_producerReference/_view/view";

class Main extends Component {
  constructor(props) {
    super(props);
    //this.eventSource = new EventSource('http://cis-x.convergens.dk:5984/finished/_changes/_design/by_producerReference/_view/view?feed=continuous');
    this.state = { responseData: [], producerReference: "" };
  }
/*
  componentDidMount() {
    this.startEventSource();
  }

  startEventSource() {
    var source = new EventSource(
      "http://cis-x.convergens.dk:5984/finished/_changes?feed=continuous"
    );
    source.onerror = function(e) {
      console.log("EEERRROOORR");
      console.log(e);
    };
    
        source.onmessage = e => {
            this.updateJson(JSON.parse(e.data));
            console.log(this.state.inputJson)
        }
        
    var results = [];
    var sourceListener = function(e) {
      var data = JSON.parse(e.data);
      results.push(data);
    };

    source.addEventListener("message", sourceListener, false);
  }

  updateJson(jsonInput) {
    var jsonList = this.state.inputJson;
    const newList = jsonList.push(jsonInput);

    this.setState({ inputJson: newList });
    console.log(this.state.inputJson);
  }

  */

  getRoutingSlipUrl = producerReference => {
    if (producerReference !== "") {
      return url + "?key=%22" + producerReference + "%22";
    } else return url;
  };

  getJson = async () => {
    
    const dbUrl = this.getRoutingSlipUrl(this.state.producerReference);

    let response = await SendJson.SendJson(dbUrl, "GET");
    this.setState({ responseData: response.rows });
  };

  onChange = evt => {
    this.setState({ [evt.target.id]: evt.target.value });
  };

  CreateTab({ obj }) {
    return (
      <Jumbotron>
        <h5>Besked id: {obj.id}</h5>
        <Tabs defaultActiveKey="data" id="uncontrolled-tab">
          {Object.keys(obj.value).map(key => (
            <Tab key={key + obj} eventKey={key} title={key}>
              <div>
                <pre>{JSON.stringify(obj.value[key], null, 2)}</pre>
              </div>
            </Tab>
          ))}
          <Tab key="full" eventKey="full" title="Full Json">
            <div>
              <pre>{JSON.stringify(obj, null, 2)}</pre>
            </div>
          </Tab>
        </Tabs>
      </Jumbotron>
    );
  }

  header = () => {
    if (this.state.responseData.length > 0) {
      return (
        <h3> Antal beskeder modtaget: {this.state.responseData.length} </h3>
      );
    } else {
      return <h3>Modtag beskeder her:</h3>;
    }
  };

  render() {
    return (
      <>
        <Jumbotron>
          <this.header />
          <br />
          <br />
          <Form.Group>
            <Form.Label>
              Lyt efter en specifik producer reference, eller lad feltet stå
              tomt for at lytte på alt
            </Form.Label>
            <InputGroup>
              <Form.Control
                id="producerReference"
                required
                placeholder="producer reference navn"
                onChange={this.onChange}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={this.getJson}>
                  Søg
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Jumbotron>

        {Object.keys(this.state.responseData).map(obj => (
          <this.CreateTab key={obj} obj={this.state.responseData[obj]} />
        ))}
      </>
    );
  }
}

function Reciever() {
  return (
    <Container>
      <Row>
        <Col>
          <Main />
        </Col>
      </Row>
    </Container>
  );
}

export default Reciever;
