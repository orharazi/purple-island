import React, {useState} from 'react'
import logo from '../logo.svg';
import '../App.css';
import { Navbar, Container, Nav } from 'react-bootstrap'
import {
  useSelector
} from 'react-redux'
import {
  Link
} from 'react-router-dom'

const NavbarComponent = () => {
  const user = useSelector(state => state.user)
  console.log(user)
  return (
    <Navbar className="navbarStyled">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="/static/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
        Hello {user.username ? user.username : "Guest! Please choose charecter." }
        </Navbar.Brand>
        <Nav>
          <Nav.Item>
            <Nav.Link href="/users">users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/profile">profile</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent
