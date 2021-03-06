import React, { Component, Fragment } from 'react'
import {Container, Row, Col, Card, Image} from 'react-bootstrap'
import firebase from "firebase";

export default class Profile extends Component {
    constructor() {
        super();
        this.state={
            name:"null",
            photoUrl:"",
            email:""
        }
    }

    async componentDidMount() {
        const user = await sessionStorage.getItem("classtantUser")
        this.getInfo(JSON.parse(user).uid)
    }

    getInfo(uid){
        const db = firebase.database();
        db.ref("Users/" + uid).once("value")
            .then(snapshot => {

                const info = snapshot.val();

                this.setState({
                    name:info["name"],
                    photoUrl:info["photoUrl"],
                    email:info["email"]
                })
            })
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <Row>
                        <Col className="text-center p-3">
                            <Image src={this.state.photoUrl} alt="Profile Picture" height="150"/>
                        </Col>
                        <Col sm={12} md={12} lg={12}>
                            <Card>
                                <Card.Header>
                                    <Card.Title className="profileText">{this.state.name}</Card.Title>
                                    <Card.Title className="profileText">{this.state.email}</Card.Title>
                                </Card.Header>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}
