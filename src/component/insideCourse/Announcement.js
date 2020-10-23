import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Image, Form, Row} from "react-bootstrap";
import firebase from "firebase";
import deleteIcon from "../../asset/icon/delete.svg"
import editIcon from "../../asset/icon/edit.svg"
import '../../asset/css/announcement.css';

class Announcement extends Component {
    constructor({}) {
        super();
        this.state={
            loading:true,
            announcementView:""
        }
    }

    componentDidMount() {
        this.getAnnouncementList()
    }

    getAnnouncementList(){
        const db = firebase.database();
        db.ref("Courses/"+this.props.courseId+"/announcements").once("value" )
            .then(snapshot =>{

                const announcements = snapshot.val();
                console.log(announcements)
                const announcementId = []
                for (var key in announcements){
                    announcementId.push(key)
                }

                const view = announcementId.map(announcementId => {
                    return (
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col sm={10} md={10} lg={10} className="a_title">
                                        {announcements[announcementId]["title"]}
                                    </Col>
                                    <Col sm={1} md={1} lg={1}>
                                        <Image src={editIcon} height="40" width="40"/>
                                    </Col>
                                    <Col sm={1} md={1} lg={1}>
                                        <Image src={deleteIcon} height="40" width="40"/>
                                    </Col>

                                </Row>
                            </Card.Header>
                            <Card.Body className="a_description">{announcements[announcementId]["description"]}</Card.Body>
                            <Card.Footer><a href={"https://"+announcements[announcementId]["link"]} target="#">{announcements[announcementId]["link"]}</a></Card.Footer>
                        </Card>
                    )
                })
                this.setState({announcementView:view, loading:false})
            })
    }

    loadingAnimation = () => {
        if (this.state.loading === true)
            return <div class="loader"></div>
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <Card className="noticeCard">
                                <Card.Title style={{textAlign:"center", fontWeight:600, fontSize:32}}>Announcement Section</Card.Title>
                                <Form>
                                    <Form.Group>
                                        <Form.Control id="header" type="text" placeholder="Header" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control id="des" type="text" placeholder="Description" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control id="link" type="text" placeholder="Link (Optional)" />
                                    </Form.Group>
                                </Form>
                                <Button onClick={() => this.postAssignment()} variant="primary">
                                    Post
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12} sm={12} style={{alignContent:"center"}}>
                            {this.loadingAnimation()}
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