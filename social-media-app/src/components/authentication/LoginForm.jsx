import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import { useUserActions } from "../../hooks/user.actions";
function LoginForm() {
    const userActions = useUserActions();
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
       event.preventDefault();
       const loginForm = event.currentTarget;

       if (loginForm.checkValidity() === false) {
           event.stopPropagation();
       }
       setValidated(true);

       const data = {
           username: form.username,
           password: form.password,
       }

       userActions.login(data)
           .catch(err => {
               if (err.response) {
                   setError(err.request.response);
               }
           });

    };

    return (
        <Form id="login-form" data-testid="login-form" noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
                data-testid="username-field"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                type="text"
                placeholder="Enter username"
            />
            <Form.Control.Feedback type="invalid">
                This field is required.
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                data-testid="password-field"
                value={form.password}
                minLength="8"
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                </Form.Control.Feedback>
            </Form.Group>
            <div className="text-content text-danger">
                {error && <p>{error}</p>}
            </div>
            <Button type="submit" variant="primary">Submit</Button>
        </Form>
    );
}
export default LoginForm