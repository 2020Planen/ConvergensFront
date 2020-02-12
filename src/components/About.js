import React, { Component } from "react";
import { /*Container,*/ Row, Col, Jumbotron, Button, InputGroup, Form } from "react-bootstrap";

import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app

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
              children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
              children: [
                {
                  title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                  children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
                  children: [
                    {
                      title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                      children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
                      children: [
                        {
                          title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                          children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
                          children: [
                            {
                              title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                              children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
                              children: [
                                {
                                  title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                                  children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
                                  children: [
                                    {
                                      title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                                      children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
                                      children: [
                                        {
                                          title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                                          children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
                                          children: [
                                            {
                                              title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                                              children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' ,
                                              children: [
                                                {
                                                  title: 'Hvis "data.cvr" -> send til "anden-beriger"',
                                                  children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' }]
                                                }
                                              ]}]
                                            }
                                          ]}]
                                        }
                                      ]}]
                                    }
                                  ]}]
                                }
                              ]}]
                            }
                          ]}]
                        }
                      ]}]
                    }
                  ]}]
                }
              ]}]
            }
          ]
        },
        {
          title: 'Hvis "data.cvr" -> send til "anden-beriger"',
          children: [{ title: 'Hvis "data.cpr" -> send til "cpr-beriger"' }]
        }
      ]
    };
  }
  onChange = evt => {
    this.setState({ [evt.target.id]: evt.target.value });
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
            <Button variant="outline-secondary" onClick={this.getJson}>
              Opret
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
      </>
    )
  };

  seeState = () => {
    console.log(this.state);
    return(
      <p>{JSON.stringify(this.state)}</p>
    )
  };

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
        <Jumbotron>
          <this.seeState />
        </Jumbotron>
      </>
    );
  }
}

function Demo() {
  return (

      <Row>
        <Col>
          <Tree />
        </Col>
      </Row>

  );
}
export default Demo;


