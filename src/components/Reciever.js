import React from "react";
import { Container, Row, Col, Jumbotron, Tabs, Tab } from 'react-bootstrap';


var json = {
    databaseID: 'SADKFJHBSD238SDFKJLB234',
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
        address: 'Hvidsværmervej 161',
        zipcode: '2610',
        city: 'Rødovre',
        phone: '44522200'
    },
    addressInfo: {
        cord: '12.23423, 56.744345'
    }
}


/*
function Loop() {
    var res = Object.keys(json).map((key) =>
        <Tab eventKey={key} title={key}>
            <p>{key}</p>
        </Tab>
    );

    return res
}
*/

function Test() {

    return (
        <>
            <Jumbotron>
                <h5>Besked id: {json.databaseID}</h5>
                <Tabs defaultActiveKey="log" id="uncontrolled-tab-example">
                    {Object.keys(json).map((key) =>
                        <Tab key={key} eventKey={key} title={key}>
                            <p>{key}</p>
                        </Tab>)}
                </Tabs>
            </Jumbotron>
            <Jumbotron>
                <h5>Besked id: {json.databaseID}</h5>
                <Tabs defaultActiveKey="log" id="uncontrolled-tab-example">
                    {Object.keys(json).map((key) =>
                        <Tab key={key} eventKey={key} title={key}>
                            <p>{key}</p>
                        </Tab>)}
                </Tabs>
            </Jumbotron>
        </>
    );
}



function Reciever() {
    return (
        <Container>
            <Row>
                <Col>
                    <Jumbotron><h3>Modtag beskeder her:</h3></Jumbotron>
                    <Test />
                </Col>
            </Row>
        </Container>
    )
}

export default Reciever;