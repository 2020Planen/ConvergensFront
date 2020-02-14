import React from "react";
import { Row, Col, Jumbotron } from "react-bootstrap";
/*
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app

function isExpanded(value) {
  console.log("expanded " + value);
  if (value === "expanded") return true;

  return false;
}

function removeEmptyFields(input) {
  if (Array.isArray(input)) {
    for (var index = input.length - 1; index >= 0; index--) {
      if (typeof input[index] == "object") {
        removeEmptyFields(input[index]);
      }
      if (isExpanded(index)) {
        input.splice(index, 1);
      }
    }
  } else {
    for (var jndex in input) {
      if (typeof input[jndex] == "object") {
        removeEmptyFields(input[jndex]);
      }
      if (isExpanded(jndex)) {
        delete input[jndex];
      }
    }
  }
  return input;
}

class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputNode: "",
      treeData: [
        {
          title: 'Hvis "data" indeholder "firmaNavn" -> Send til cvr-beriger',
          children: [
            {
              title: 'Hvis "data.cvr" -> send til "anden-beriger"',
              children: [
                {
                  title: 'Hvis "data.cpr" -> send til "cpr-beriger"',
                  children: [
                    {
                      title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                      children: [
                        {
                          title: 'Hvis "data.cpr" -> send til "cpr-beriger"',
                          children: []
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Hvis "data.cvr" -> send til "anden-beriger"',
          children: [
            { title: 'Hvis "data.cpr" -> send til "cpr-beriger"', childen: [] }
          ]
        }
      ]
    };
  }
  onChange = evt => {
    this.setState({ [evt.target.id]: evt.target.value });
  };

  seeJson = () => {
    var oldJson = {};
    oldJson = JSON.parse(JSON.stringify(this.state.treeData));

    var newJson = removeEmptyFields(oldJson);

    alert(JSON.stringify(newJson));
  };

  createNode = () => {
    return (
      <>
        <br />
        <br />
        <Form.Group>
          <Form.Label>Opret et nyt node til træet her</Form.Label>
          <InputGroup>
            <Form.Control
              id="inputNode"
              required
              defaultValue="JSON"
              onChange={this.onChange}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={this.seeJson}>
                Opret
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </>
    );
  };
  */

/*
  seeState = () => {
    var oldJson = {};
    oldJson.data = this.state.treeData;
    console.log("OLD" + oldJson);

    var newJson = removeEmptyFields(oldJson);
    console.log("NEW" + newJson);

    return <p>{JSON.stringify(newJson)}</p>;
  };
*/

/*
  render() {
    return (
      <>
        <Jumbotron>
          <h3>Test af regel mulighed:</h3>
        </Jumbotron>
        <Jumbotron>
          <h5>Sortable Tree:</h5>
          <this.createNode />
          <div style={{ height: 1200 }}>
            <SortableTree
              treeData={this.state.treeData}
              onChange={treeData => this.setState({ treeData })}
            />
          </div>
        </Jumbotron>
        <Jumbotron></Jumbotron>
      </>
    );
  }
}

*/
function Demo() {
  return (
    <Row>
      <Col>
        <Jumbotron></Jumbotron>
      </Col>
    </Row>
  );
}
export default Demo;
