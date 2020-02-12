import React, { Component } from "react";
import {
  Container,
  //Row,
  //Col,
  Jumbotron,
  //Accordion,
  //Card,
  //Button
} from "react-bootstrap";
import {
  Query,
  Builder,
  BasicConfig,
  Utils as QbUtils
} from "react-awesome-query-builder";
import "antd/dist/antd.css";
import "react-awesome-query-builder/css/styles.scss";
//import "react-awesome-query-builder/css/compact_styles.scss"; //optional, for more compact styles

// You need to provide your own config. See below 'Config format'
const config = {
  ...BasicConfig,
  fields: {
    qty: {
      label: "Qty",
      type: "number",
      fieldSettings: {
        min: 0
      },
      valueSources: ["value"],
      preferWidgets: ["number"]
    },
    price: {
      label: "Price",
      type: "number",
      valueSources: ["value"],
      fieldSettings: {
        min: 10,
        max: 100
      },
      preferWidgets: ["slider", "rangeslider"]
    },
    color: {
      label: "Color",
      type: "select",
      valueSources: ["value"],
      listValues: [
        { value: "yellow", title: "Yellow" },
        { value: "green", title: "Green" },
        { value: "orange", title: "Orange" }
      ]
    },
    is_promotion: {
      label: "Promo?",
      type: "boolean",
      operators: ["equal"],
      valueSources: ["value"]
    }
  }
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = { id: QbUtils.uuid(), type: "group" };

class DemoQueryBuilder extends Component {
  state = {
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config: config
  };

  render = () => (
    <Container>
      <Jumbotron>
        <div>
          <Query
            {...config}
            value={this.state.tree}
            onChange={this.onChange}
            renderBuilder={this.renderBuilder}
          />
          {//this.renderResult(this.state)
          }
        </div>
      </Jumbotron>
    </Container>
  );

  renderBuilder = props => (
    <div className="query-builder-container" style={{ padding: "10px" }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  );

  renderResult = ({ tree: immutableTree, config }) => (
    <div className="query-builder-result">
      <div>
        Query string:{" "}
        <pre>{JSON.stringify(QbUtils.queryString(immutableTree, config))}</pre>
      </div>
      <div>
        MongoDb query:{" "}
        <pre>
          {JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}
        </pre>
      </div>
      <div>
        SQL where:{" "}
        <pre>{JSON.stringify(QbUtils.sqlFormat(immutableTree, config))}</pre>
      </div>
      <div>
        JsonLogic:{" "}
        <pre>
          {JSON.stringify(QbUtils.jsonLogicFormat(immutableTree, config))}
        </pre>
      </div>
    </div>
  );

  onChange = (immutableTree, config) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    this.setState({ tree: immutableTree, config: config });

    const jsonTree = QbUtils.getTree(immutableTree);
    console.log(jsonTree);
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  };
}

/*
function About() {
  return (
    <Container>
      <Row>
        <Col>
          <Jumbotron></Jumbotron>
          <Jumbotron>
            <h5> TEST </h5>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Click me!
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Click me!
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
  );
}
*/

export default DemoQueryBuilder;
