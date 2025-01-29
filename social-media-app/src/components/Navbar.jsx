import React, {useContext} from 'react';
import {Navbar, Container, Image, NavDropdown, Nav} from 'react-bootstrap';
import {getUser, useUserActions} from "../hooks/user.actions";
import {Link} from "react-router-dom";
import {Context} from "./Layout";


function NavigationBar() {
    const userActions = useUserActions();
    const {setToaster} = useContext(Context);
    const user = getUser();

    const handleLogout = () => {
       userActions.logout()
           .catch((err) => {
               setToaster({
                   type: 'danger',
                   message: "Logout failed",
                   show: true,
                   title: err.data?.detail | "An error occurred",
               });
           });
    };

    return (
        <Navbar variant="dark" bg="primary">
            <Container>
                <Navbar.Brand as={Link} to={"/"} className="fw-bold">Postagram</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <NavDropdown title={<Image src={user.avatar} roundedCircle width={36} height={36}/>}>
                        <NavDropdown.Item as={Link} to={`/profile/${user.id}/`}>Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;