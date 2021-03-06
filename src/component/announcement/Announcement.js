import React, { Component, Fragment } from 'react';
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import firebase from "firebase";
import '../../asset/css/announcement.css';
import { auth } from "../../firebase";
import SingleAnnouncement from "./SingleAnnouncement";
import Loader from '../common/Loader';
import { getKeys } from '../../functions/JSON';

class Announcement extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            announcementView: "",
            uid:""
        }
    }

    async componentDidMount() {
        let user = JSON.parse(await sessionStorage.getItem("classtantUser"))
        if (user !== null) {
            this.setState({ uid: user.uid })
        }
        this.getAnnouncementList()
    }

    getAnnouncementList() {
        this.setState({ announcementView: "", loading: true })
        const db = firebase.database();
        db.ref("Courses/" + this.props.courseId + "/announcements").once("value")
            .then(snapshot => {

                const announcements = snapshot.val();
                const announcementId = getKeys(announcements)

                const view = announcementId.slice(0).reverse().map((announcementId, index) => {
                    return (
                        <SingleAnnouncement
                            key={index}
                            id={announcementId}
                            courseId={this.props.courseId}
                            title={announcements[announcementId]["title"]}
                            description={announcements[announcementId]["description"]}
                            link={announcements[announcementId]["link"]}
                            postedBy={announcements[announcementId]["postedBy"]}
                            postTime={announcements[announcementId]["postTime"]}
                            authorId={announcements[announcementId]["authorId"]}
                            currentUserId={this.state.uid}
                        />
                    )
                })
                this.setState({ announcementView: view, loading: false })
            })
    }

    loadingAnimation = () => {
        if (this.state.loading === true)
            return <div class="loader"></div>
    }

    postAnnouncement() {
        this.setState({loading: true})
        const db = firebase.database();
        const time = new Date().getTime().toString();
        if (this.validation()) {
            db.ref("Courses/" + this.props.courseId + "/announcements/" + time)
                .update(
                    {
                        "authorId": auth.currentUser.uid,
                        "description": document.getElementById("des").value,
                        "link": document.getElementById("link").value,
                        "postTime": time,
                        "postedBy": auth.currentUser.displayName,
                        "title": document.getElementById("header").value,
                    },
                    function (error) {
                        if (error)
                            alert("failed")  
                    }).then(()=>this.getAnnouncementList())
        }
    }

    validation() {
        if (document.getElementById("header").value.length < 1) {
            alert("Title can not be empty!")
            return false
        } else
            return true
    }


    render() {
        return (
            <Fragment>
                <Container>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <Card className="topCardDesign">
                                <Card.Title style={{ textAlign: "center", fontWeight: 600, fontSize: 32 }}>Announcement
                                    Section</Card.Title>
                                <Form>
                                    <Form.Group>
                                        <Form.Control id="header" type="text" placeholder="Title" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control id="des" as="textarea" rows={3} placeholder="Description" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control id="link" type="text" placeholder="Link (Optional)" />
                                    </Form.Group>
                                </Form>
                                <Button onClick={() => this.postAnnouncement()} variant="primary">
                                    Post
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12} sm={12} style={{ alignContent: "center" }}>
                            {this.state.loading ? <Loader/> : <span></span>}
                        </Col>
                        <Col lg={12} md={12} sm={12}>
                            {this.state.announcementView}
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default Announcement;