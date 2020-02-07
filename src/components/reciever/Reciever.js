import React, { Component } from "react";
import { Container, Row, Col, Jumbotron, Tabs, Tab } from 'react-bootstrap';

//import SendJson from "../../fetch/SendJson"
//const url = "http://cis-x.convergens.dk:5984/failed/_design/by_producerReference/_view/view?key="



class Test extends Component {
    constructor(props) {
        super(props);
        this.eventSource = new EventSource('http://localhost:8081/consumer/stream');
        this.state = { inputJson: json }
    }


    componentDidMount() {
        this.startEventSource()
    }


    startEventSource() {
        this.eventSource.onmessage = e => {
            this.updateJson(JSON.parse(e.data));
            console.log(this.state.inputJson)
        }

    }

    updateJson(jsonInput) {
        var jsonList = this.state.inputJson
        const newList = jsonList.push(jsonInput)

        this.setState({ inputJson: newList });
    }


    CreateTab({ obj }) {
        console.log(obj)
        return (
            <Jumbotron>
                <h5>Besked id: {obj.databaseID}</h5>
                <Tabs defaultActiveKey="" id="uncontrolled-tab">
                    {Object.keys(obj).map((key) =>
                        <Tab key={key + obj} eventKey={key} title={key}>
                            <div><pre>{JSON.stringify(obj[key], null, 2)}</pre></div>
                        </Tab>)}
                    <Tab key="full" eventKey="full" title="Full Json">
                        <div><pre>{JSON.stringify(obj, null, 2)}</pre></div>
                    </Tab>
                </Tabs>
            </Jumbotron>
        )
    }

    header = () => {
        if (this.state.inputJson.length > 0) {
            return <h3> Antal beskeder modtaget: {this.state.inputJson.length} </h3>
        } else {
            return <h3>Modtag beskeder her:</h3>
        }
    }

    render() {
        return (
            <>
                <Jumbotron>
                    <this.header/>
                </Jumbotron>
                {Object.keys(this.state.inputJson).map((obj) => <this.CreateTab key={obj} obj={this.state.inputJson[obj]} />)}
            </>
        )
    }
}


function Reciever() {
    return (
        <Container>
            <Row>
                <Col>
                    <Test />
                </Col>
            </Row>
        </Container>
    )
}











var json = [{
    databaseID: 'b1211417-e2df-4416-82e9-985e7e4d9952',
    log: [
        {
            moduleName: 'ReceiverAPIModule',
            timeStamp: 'Fri Jan 31 10:45:05 CET 2020'
        },
        {
            moduleName: 'entry',
            timeStamp: 'Fri Jan 31 10:45:06 CET 2020'
        },
        {
            moduleName: 'routing',
            timeStamp: 'Fri Jan 31 10:45:06 CET 2020'
        },
        {
            moduleName: 'cvr-enricher',
            timeStamp: 'Fri Jan 31 10:45:06 CET 2020'
        },
        {
            moduleName: 'cvr-enricher',
            timeStamp: 'Fri Jan 31 10:45:08 CET 2020'
        },
        {
            moduleName: 'address-enrichment',
            timeStamp: 'Fri Jan 31 10:45:09 CET 2020'
        }
    ],
    data: {},
    producerReference: 'address',
    conditions: [
        {
            field: 'number',
            action: 'greater than',
            value: '111',
            topic: 'exit',
            priority: 1
        }
    ],
    cvrInfo: {
        name: 'CONVERGENS A/S',
        address: 'Hvidsvaermervej 161',
        zipcode: '2610',
        city: 'Roedovre',
        phone: '44522200'
    },
    addressInfo: {
        cord: '12.23423, 56.744345'
    }
},
{
    databaseID: 'b1211417-e2df-4416-82e9-985e7e4d9952',
    log: [
        {
            moduleName: 'ReceiverAPIModule',
            timeStamp: 'Fri Jan 31 10:45:05 CET 2020'
        },
        {
            moduleName: 'entry',
            timeStamp: 'Fri Jan 31 10:45:06 CET 2020'
        },
        {
            moduleName: 'routing',
            timeStamp: 'Fri Jan 31 10:45:06 CET 2020'
        },
        {
            moduleName: 'cvr-enricher',
            timeStamp: 'Fri Jan 31 10:45:06 CET 2020'
        },
        {
            moduleName: 'cvr-enricher',
            timeStamp: 'Fri Jan 31 10:45:08 CET 2020'
        },
        {
            moduleName: 'address-enrichment',
            timeStamp: 'Fri Jan 31 10:45:09 CET 2020'
        }
    ],
    data: {},
    producerReference: 'address',
    conditions: [
        {
            field: 'number',
            action: 'greater than',
            value: '111',
            topic: 'exit',
            priority: 1
        }
    ],
    cvrInfo: {
        name: 'CONVERGENS A/S',
        address: 'Hvidsvaermervej 161',
        zipcode: '2610',
        city: 'Roedovre',
        phone: '44522200'
    },
    addressInfo: {
        cord: '12.23423, 56.744345'
    }
}]




/*
class RecieverForm extends Component {
    constructor(props) {
        super(props);
        this.state = { producerReference: "" }
    }

    getRoutingSlipUrl = producerReference => {

        return url + '%22' + producerReference + '%22'
    }

    sendJson = async evt => {
        const dbUrl = this.getRoutingSlipUrl(this.state.producerReference)

        console.log(this.state)
        let response = await SendJson.SendJson(dbUrl, "GET")
        console.log(response)
    }

    onChange = evt => {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    messageList = () => {
        return <Jumbotron> <h5>TEST</h5></Jumbotron>
    }



    render() {
        return (
            <>
                <Jumbotron>
                    <h3>Modtag beskeder her:</h3>
                    <br />
                    <br />
                    <Form.Group>
                        <Form.Label>Lyt efter en producer reference</Form.Label>
                        <InputGroup>
                            <Form.Control id="producerReference" required placeholder="producer reference navn" onChange={this.onChange} />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.sendJson}>Send</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Jumbotron>

                <this.messageList />

            </>
        )
    }

}
*/


export default Reciever;
