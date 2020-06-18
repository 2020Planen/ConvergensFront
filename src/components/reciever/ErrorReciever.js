import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Form,
  InputGroup,
  Button,
  Tab,
  Tabs,
} from "react-bootstrap";
import SendJson from "../../fetch/SendJson";

//const url =process.env.REACT_APP_COUCH_URL + "failed/_design/by_producerReference/_view/view";

class RecieverForm extends Component {
  constructor(props) {
    super(props);
    this.state = { producerReference: "", responseData: [] };
  }

  componentDidMount() {
    this.getJson();
  }

  /*
  getRoutingSlipUrl = producerReference => {
    if (producerReference !== "") {
      return url + "?key=%22" + producerReference + "%22";
    } else return url;
  };
*/

  getJson = async (evt) => {
    const dbUrl = process.env.REACT_APP_COUCH_TARGET + "/getFailed/realm";
    let response = await SendJson.SendWithToken(dbUrl, "GET");
    this.setState({ responseData: response.rows });
  };

  onChange = (evt) => {
    this.setState({ [evt.target.id]: evt.target.value });
  };

  CreateTab({ obj }) {
    return (
      <Jumbotron>
        <h5>Besked id: {obj.id}</h5>
        <Tabs defaultActiveKey="data" id="uncontrolled-tab">
          {Object.keys(obj.value).map((key) => (
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
      return <h3> Antal fejlbeskeder: {this.state.responseData.length} </h3>;
    } else {
      return <h3>Modtag fejlbeskeder her:</h3>;
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
              Søg efter en specifik producer reference, eller lad feltet stå
              tomt for at søge efter alle
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

        {Object.keys(this.state.responseData).map((obj) => (
          <this.CreateTab key={obj} obj={this.state.responseData[obj]} />
        ))}
      </>
    );
  }
}

function ErrorReciever() {
  return (
    <Container>
      <Row>
        <Col>
          <RecieverForm />
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorReciever;
