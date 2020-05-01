import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import JWT from "jwt-decode";

function Header({ keycloak }) {
  const [userInfo, setInfo] = useState({
    username: "",
    email: "",
    email_verified: false
  });

  useEffect(() => {
    keycloak.loadUserInfo().then(userInfo => {
      setInfo({
        username: userInfo.preferred_username,
        email: userInfo.email,
        email_verified: userInfo.email_verified
      });
    });
  }, [keycloak]);

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="sm"
        bg="dark"
        variant="dark"
        sticky="top"
      >
        <Navbar.Brand href="#home">Convergens</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {localStorage.getItem("keycloak-token") ? (
            <>
              <Nav className="mr-auto">
                {JWT(
                  localStorage.getItem("keycloak-token")
                ).realm_access.roles.includes("superuser") ||
                JWT(
                  localStorage.getItem("keycloak-token")
                ).realm_access.roles.includes("user") ? (
                  <>
                    <Nav.Link href="#send">Send Besked</Nav.Link>
                    <NavDropdown
                      title="Routing Slips"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item href="#createSimpleRoutingSlip">
                        Opret simpel routing slip
                      </NavDropdown.Item>
                      {JWT(
                        localStorage.getItem("keycloak-token")
                      ).realm_access.roles.includes("superuser") ? (
                        <>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#createRoutingSlip">
                            Opret routing slip
                          </NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#editRoutingSlip">
                            Ændring af routing slips
                          </NavDropdown.Item>
                        </>
                      ) : null}
                    </NavDropdown>

                    <NavDropdown
                      title="Modtag beskeder"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item href="#reciever">
                        Modtag Beskeder
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="#errorReciever">
                        Modtag Fejlbeskeder
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : null}
              </Nav>
              <Nav>
                {JWT(
                  localStorage.getItem("keycloak-token")
                ).realm_access.roles.includes("admin") ? (
                  <Nav.Link href="#test">Test</Nav.Link>
                ) : null}

                <NavDropdown
                  drop="left"
                  title={userInfo.username}
                  id="user-nav-dropdown"
                >
                  {userInfo.email !== undefined ? (
                    <>
                      <NavDropdown.Item>{userInfo.email}</NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  ) : null}
                  <NavDropdown.Item
                    href={
                      JWT(localStorage.getItem("keycloak-token")).iss +
                      "/account/"
                    }
                  >
                    Rediger bruger
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      keycloak.logout();
                      localStorage.clear();
                    }}
                  >
                    log ud
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav>
              <Nav.Link
                onClick={() => {
                  keycloak.logout();
                  localStorage.clear();
                }}
              >
                log ind igen
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Header;
