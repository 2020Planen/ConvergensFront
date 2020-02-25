import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Tabs,
  Tab,
  //InputGroup,
  //Form,
  Button,
  Badge,
  Card,
  Accordion
} from "react-bootstrap";
import SendJson from "../../fetch/SendJson";
import ReactJson from 'react-json-view';

const url =
  "http://cis-x.convergens.dk:5984/finished/_design/by_producerReference/_view/view";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseData: [],
      producerReference: "",
      eventData: []
    };
  }

  componentDidMount() {
    this.startEventSource();
  }

  startEventSource() {
    var source = new EventSource(
      "http://cis-x.convergens.dk:5984/finished/_changes?feed=eventsource&since=now&include_docs=true"
    );
    source.onerror = function (e) {
      console.log("EEERRROOORR");
      console.log(e);
    };

    source.onmessage = e => {
      this.updateJson(JSON.parse(e.data));
      console.log(this.state.eventData)
    }

    var results = [];
    var sourceListener = function (e) {
      var data = JSON.parse(e.data);
      results.push(data);
    };

    source.addEventListener("message", sourceListener, false);
  }

  updateJson(jsonInput) {
    var jsonList = this.state.eventData;
    const newList = jsonList.concat(jsonInput);

    this.setState({ eventData: newList });
    console.log(this.state.eventData.length);
  }



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
        <h5><Badge variant="secondary"> Besked id:</Badge> {obj.id}</h5>
        <Tabs defaultActiveKey="" id="uncontrolled-tab">
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
        {/*
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
      </Jumbotron> */}
          
        <Jumbotron>
          <h3>Antal beskeder modtaget: {this.state.eventData.length}</h3>

            {this.state.eventData.length > 0 ? (
              <Accordion >
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Data
                         </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <>
                    {this.state.eventData.map((e, index) =>
                      <Card.Body key={index}> <ReactJson src={e.doc} collapsed={true} name={null} enableClipboard={false} displayDataTypes={false} /> </Card.Body>)}
                  </>
                  </Accordion.Collapse>
                </Card>
              </Accordion>) : null}

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
