import React, {useContext, useState} from 'react';
import {Button, Form, Image} from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import {Context} from "../Layout";
function CreateComment(props) {

    const {postId, refresh} = props
    const user = getUser();
    const {setToaster} = useContext(Context);
    const [form, setForm] = useState({
        author: "",
        body: "",
    });
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const createCommentForm = event.currentTarget;

        if (createCommentForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);

        const data = {
            author: user.id,
            body: form.body,
            post: postId,
        }
        axiosService
            .post(`/posts/${postId}/comments/`, data)
            .then(res => {
                setToaster({
                    title: "Comment!",
                    show: true,
                    message: "Comment posted successfully 🚀",
                    type: "success",
                });
                setForm({author: "", body: "", post: ""});
                refresh();
            })
            .catch(err => {
                setToaster({
                    title: "Error!",
                    show: true,
                    message: "An error occurred.",
                    type: "danger",
                });
            })
        setValidated(false);
    };

    return (
        <Form className="d-flex flex-row justify-content-between"
              noValidate validated={validated} onSubmit={handleSubmit} data-testid="create-comment-test">
            <Image
                src={user.avatar}
                roundedCircle
                width={48}
                height={48}
                className="my-2"
            />
            <Form.Group className="m-3 w-75">
                <Form.Control
                    type="text"
                    placeholder="Write your comment"
                    value={form.body}
                    name="body"
                    className="py-2 rounded-pill border-primary"
                    data-testid="comment-body-field"
                    onChange={(event) =>setForm({...form, body: event.target.value})}
                />
            </Form.Group>
            <div className="m-auto">
                <Button type="primary" onClick={handleSubmit}
                        size="small" disabled={!form.body} data-testid="create-comment-submit">Comment</Button>
            </div>
        </Form>
    );
}

export default CreateComment;
