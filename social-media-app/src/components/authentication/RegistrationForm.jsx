import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {useUserActions} from "../../hooks/user.actions";

function RegistrationForm() {
    const userActions = useUserActions();
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        bio: "",
    });
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const registrationForm = event.currentTarget;
        if (registrationForm.checkValidity() === false){
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            username: form.username,
            password: form.password,
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name,
            bio: form.bio,
        };
        userActions.register(data)
            .catch(err => {
                if (err.response) {
                    setError(err.request.response);
                }
            });
    };

    return (
        <Form id="registration-form" className="border p-4 rounded" noValidate validated={validated}
              onSubmit={handleSubmit} data-testid="registration-form">
            <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    value={form.first_name}
                    onChange={(event) => setForm({...form, first_name: event.target.value})}
                    required
                    type="text"
                    placeholder="Enter first name"
                    data-testid="first-name-field"
                />
                <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                    value={form.last_name}
                    onChange={(e) => setForm({...form, last_name: e.target.value})}
                    required
                    type="text"
                    placeholder="Enter last name"
                    data-testid="last-name-field"
                />
                <Form.Control.Feedback type="invalid">
                    This field is required.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})}
                    required
                    type="text"
                    placeholder="Enter username"
                    data-testid="username-field"
                />
                <Form.Control.Feedback type="invalid">
                    This field is required.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required
                    type="email"
                    placeholder="Enter email"
                    data-testid="email-field"
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    value={form.password}
                    minLength="8"
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    required
                    type="password"
                    placeholder="Password"
                    data-testid="password-field"
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                    value={form.bio}
                    onChange={(e) => setForm({...form, bio: e.target.value})}
                    as="textarea"
                    rows={3}
                    placeholder="A simple bio ... (Optional)"
                    data-testid="bio-field"
                />
            </Form.Group>

            <div className="text-content text-danger">{error && <p>{error}</p>}</div>
            <div className="d-flex justify-content-center">
                <Button className="align-content-center" variant="primary" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    );
}

export default RegistrationForm;