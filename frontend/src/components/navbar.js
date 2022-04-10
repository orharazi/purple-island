import React from 'react'
import '../App.css';
import { Navbar, Container, Nav, Image, NavDropdown } from 'react-bootstrap'
import {
  useSelector
} from 'react-redux'

const NavbarComponent = () => {
  const user = useSelector(state => state.user)
  return (
    <Navbar className="navbarStyled">
      <Container>
        <Navbar.Brand href="/">
          Purple Island
        </Navbar.Brand>
        <Nav className="me-auto">
          <NavDropdown title="navigate" id="basic-nav-dropdown">
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="/users">users</NavDropdown.Item>
            <NavDropdown.Item href="/">Trades</NavDropdown.Item>
        </NavDropdown>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Brand href="/profile">
            {user.avatar !== "" ? 
              <Image
                roundedCircle
                alt=""
                src={'http://localhost:3000/' + user.avatar }
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
            : null} {' '}
            Hello {user.username ? user.username : "Guest! Please choose charecter." }
          </Navbar.Brand>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent
