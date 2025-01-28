import React, {useContext, useState} from "react";
import {Context} from "../Layout";
import axiosService from "../../helpers/axios";
import {Button, Dropdown, Form, Modal} from "react-bootstrap";


function UpdateComment(props) {

    const {setToaster} = useContext(Context);
    const {comment, postId, refresh} = props;
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        author: comment.author.id,
        body: comment.body,
        post: postId,
    });
    const handleShow = () => {setShow(true)};
    const handleClose = () => {setShow(false);};

    const handleSubmit = (event) => {
        event.preventDefault();
        const updateCommentForm = event.currentTarget;

        if (updateCommentForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            author: form.author,
            body: form.body,
            post: postId,
        }

        axiosService
            .put(`posts/${postId}/comments/${comment.id}/`, data)
            .then(res => {
                handleClose();
                setToaster({
                    title: "Success!",
                    show: true,
                    message: "Comment updated 🚀",
                    type: "success",
                });
                setForm({...form});
                refresh();
            })
            .catch(()=>{
                setToaster({
                    title: "Error!",
                    show: true,
                    message: "An error occurred",
                    type: "danger",
                });
            });
        setValidated(false);
    };

    return (
        <>
            <Dropdown.Item className="text-info" onClick={handleShow} data-testid="show-modal-form">Modify</Dropdown.Item>
            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Update comment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0" >
                    <Form noValidate validated={validated} onSubmit={handleSubmit} data-testid="update-comment-test">
                        <Form.Group className="mb-3">
                            <Form.Control
                                name="body"
                                value={form.body}
                                onChange={(e) => setForm({...form, body: e.target.value})}
                                as="textarea"
                                data-testid="comment-body-field"
                                rows={3}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" data-testid="update-comment-submit" onClick={handleSubmit}>Modify</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpdateComment;