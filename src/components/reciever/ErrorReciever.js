import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, Form, InputGroup, Button, Tab, Tabs } from 'react-bootstrap';
import SendJson from "../../fetch/SendJson"

const url = "http://cis-x.convergens.dk:5984/failed/_design/by_producerReference/_view/view"

/*
const CreateTab = ({ obj }) => {
    return (
        <h5>{obj}</h5>
    )
}
*/

const MessageTab = ({ obj }) => {

    return (
        <Jumbotron>

            <h5>Besked ID: {obj._id}</h5>
            {//Object.keys(obj).map((key) => <CreateTab key={key} obj={key}/> )
            }

            <Tabs defaultActiveKey="data" id="uncontrolled-tab">

                <Tab key="rev" eventKey="rev" title="Rev">
                    <div><pre>{JSON.stringify(obj._rev, null, 2)}</pre></div>
                </Tab>
                <Tab key="log" eventKey="log" title="Log">
                    <div><pre>{JSON.stringify(obj.log, null, 2)}</pre></div>
                </Tab>
                <Tab key="full" eventKey="full" title="Full Json">
                    <div><pre>{JSON.stringify(obj, null, 2)}</pre></div>
                </Tab>
            </Tabs>
        </Jumbotron>
    )

    /*
    return (
        
        <Jumbotron>

            <h5>Besked ID: {obj._id}</h5>
            <Tabs defaultActiveKey="data" id="uncontrolled-tab">

                {Object.keys(obj).map((key) => { return <MakeTab key={obj._id+key} obj={key}/> })}

                <Tab key="full" eventKey="full" title="Full Json">
                    <div><pre>{JSON.stringify(obj, null, 2)}</pre></div>
                </Tab>
            </Tabs>
        </Jumbotron>
        
    )
    */

}



class RecieverForm extends Component {
    constructor(props) {
        super(props);
        this.state = { producerReference: "", responseData: [] }
    }

    getRoutingSlipUrl = producerReference => {
        if (producerReference !== "") {
            return url + '?key=%22' + producerReference + '%22'
        } else return url
    }

    getJson = async evt => {
        const dbUrl = this.getRoutingSlipUrl(this.state.producerReference)

        let response = await SendJson.SendJson(dbUrl, "GET")
        this.setState({ responseData: response.rows })
    }

    onChange = evt => {
        this.setState({ [evt.target.id]: evt.target.value });
    }
    /*
        tabList = (obj) => {
            console.log(obj)
            Object.keys(obj).map((key) => {
                <Tab key={key} eventkey={key} title={key}>
                    <div><pre>{JSON.stringify(obj.value[key], null, 2)}</pre></div>
                </Tab>
                )
        }
    }
    */



    //<FlightItem key={e.id} e={e} />

    messageList = () => {
        if (this.state.responseData.length === 0) {
            //console.log(this.state.responseData)
            return <h5>In if</h5>
        } else if (this.state.responseData.length > 0) {
            //console.log(this.state.responseData)
            return this.state.responseData.map((obj) => <MessageTab key={obj.value._id} obj={obj.value} />)
        }
        //console.log(this.state.responseData)
        return <h5>out of if</h5>
    }


    header = () => {
        if (this.state.responseData.length > 0) {
            return <h3> Antal beskeder: {this.state.responseData.length} </h3>
        } else {
            return <h3>Modtag fejlbeskeder her:</h3>
        }
    }

    /*
                    <Jumbotron>
                    <h5>Besked ID: </h5>
                    <Tabs defaultActiveKey="data" id="uncontrolled-tab">
    
                        {Object.keys(this.state.responseData[0].value).map((key) =>
                            <Tab key={key} eventKey={key} title={key}>
                                <div><pre>{JSON.stringify(this.state.responseData[0].value[key], null, 2)}</pre></div>
                            </Tab>)}
                        <Tab key="full" eventKey="full" title="Full Json">
                            <div><pre>{JSON.stringify(this.state.responseData[0].value, null, 2)}</pre></div>
                        </Tab>
                    </Tabs>
                </Jumbotron>
                */


    render() {
        return (
            <>
                <Jumbotron>

                    <this.header />
                    <br />
                    <br />
                    <Form.Group>
                        <Form.Label>Lyt efter en producer reference</Form.Label>
                        <InputGroup>
                            <Form.Control id="producerReference" required placeholder="producer reference navn" onChange={this.onChange} />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.getJson}>Send</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Jumbotron>

                <this.messageList />

            </>
        )
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
    )
}

export default ErrorReciever;