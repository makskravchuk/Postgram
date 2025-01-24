import React, {useContext} from 'react';
import {Button, Modal, Form} from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import {Context} from "../Layout";
function CreatePost(props) {
    const {refresh} = props;
    const [show, setShow] = React.useState(false);
    const handleClose = () => {setShow(false)};
    const handleShow = () => {setShow(true);};
    const [validated, setValidated] = React.useState(false);
    const [form, setForm] = React.useState({
        author: "",
        body : "",
    });
    const user = getUser();

    const {setToaster} = useContext(Context);

    const handleSubmit = (event) => {
      event.preventDefault();
      const createPostForm = event.currentTarget;

      if (createPostForm.checkValidity() === false) {
          event.stopPropagation();
      }
      setValidated(true);
      const data = {
          author: user.id,
          body: form.body,
      };
      axiosService
          .post("/posts/", data)
          .then(() => {
              handleClose();
              setToaster({
                  title: "Post!",
                  show: true,
                  message: "Post created 🚀",
                  type: "success",
              });
              setForm({author: "", body: ""});
              refresh();
          })
          .catch((error) => {
              setToaster({
                  title: "Post error",
                  show: true,
                  message: "An error occurred.",
                  type: "danger",
              });
          });
      setValidated(false);
    };


    return (
        <>
            <Form.Group className="my-3 w-75">
                <Form.Control className="py-2 rounded-pill border-primary text-primary"
                type="text"
                placeholder="Write a post"
                onClick={handleShow}
                data-testid="show-modal-form"
                />
            </Form.Group>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0">
                    <Form noValidate validated={validated} onSubmit={handleSubmit} data-testid="create-post-form">
                        <Form.Group className="mb-3">
                            <Form.Control name="body" value={form.body}
                                          onChange={(e) => setForm({...form, body: e.target.value})}
                                          as="textarea"
                                          rows={6}
                                          data-testid="post-body-field"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary"
                            onClick={handleSubmit}
                            disabled={!form.body}
                            data-testid="create-post-submit">Post</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreatePost;
