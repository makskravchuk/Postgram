import React, {useContext, useState} from 'react';
import {Button, Dropdown, Form, Modal} from "react-bootstrap";
import axiosService from "../../helpers/axios";
import {Context} from "../Layout";


function UpdatePost(props){

    const {setToaster} = useContext(Context);
    const {post, refresh} = props;
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        author: post.author.id,
        body: post.body,
    });
    const [validated, setValidated] = useState(false);


    const handleClose = () => {setShow(false);};
    const handleShow = () => {setShow(true);};

    const handleSubmit = (event)=>{
        event.preventDefault();
        const updatePostForm = event.currentTarget;
        if (updatePostForm.checkValidity() === false){
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            author: form.author,
            body: form.body,
        };
        axiosService.put(`/posts/${post.id}/`, data)
            .then(res => {
                handleClose();
                setToaster({
                    title: "Success!",
                    show: true,
                    message: "Post updated 🚀",
                    type: "success",
                });
                setForm({...form});
                refresh();
            })
            .catch(err => {
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

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="border-0">
                <Modal.Title>Update Post</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border-0">
            <Form noValidate validated={validated} onSubmit={handleSubmit} data-testid="update-post-form">
                <Form.Group className="mb-3">
                    <Form.Control
                        name="body"
                        value={form.body}
                        onChange={(e) => setForm({...form, body: e.target.value})}
                        as="textarea"
                        rows={3}
                        data-testid="post-body-field"
                    />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit} data-testid="update-post-submit">Modify</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default UpdatePost;