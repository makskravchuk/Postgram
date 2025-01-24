import React from 'react';
import {Navbar, Container, Image, NavDropdown, Nav} from 'react-bootstrap';
import {getUser, useUserActions} from "../hooks/user.actions";
import {Link} from "react-router-dom";

function NavigationBar() {
    const userActions = useUserActions();
    const handleLogout = () => {
       userActions.logout();
    };
    const user = getUser();

    return (
        <Navbar variant="dark" bg="primary">
            <Container>
                <Navbar.Brand as={Link} to={"/"} className="fw-bold">Postagram</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <NavDropdown title={<Image src={user.avatar} roundedCircle width={36} height={36}/>}>
                        <NavDropdown.Item as={Link} to={`/profile/${user.id}/`}>Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleLogout} href="#">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;