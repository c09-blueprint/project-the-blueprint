import "./navbar.css";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../../buttons/logoutButton";
import { LoginButton } from "../../buttons/loginButton";
import { SignupButton } from "../../buttons/signupButton";
import React from "react";

const Navbar = () => {
  /* Conditionally rendering signin/login/logout button */
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark menubar">
      <a className="navbar-brand mb-0 h1 bp-logo" href="\home">
        Blueprint
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        {isAuthenticated && (
          <ul className="navbar-nav menu-item-padding">
            <li className="nav-item active">
              <a className="nav-link" href="\dashboard">
                My Workspace
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/dashboard/shared">
                Shared With Me
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Create New
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <a className="dropdown-item" href="#">
                  Workspace
                </a>
                <button
                  type="button"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  className="dropdown-item"
                >
                  Board
                </button>
              </div>
            </li>
          </ul>
        )}
        {!isAuthenticated && (
          <>
            <ul className="navbar-nav ms-auto menu-item-padding">
              <li className="nav-item">
                <SignupButton />
              </li>
            </ul>
            <ul className="navbar-nav ms-auto menu-item-padding">
              <li className="nav-item">
                <LoginButton />
              </li>
            </ul>
          </>
        )}
        <ul className="navbar-nav ms-auto menu-item-padding">
          {isAuthenticated && (
            <ul className="navbar-nav ms-auto menu-item-padding">
              <li className="nav-item">
                <LogoutButton />
              </li>
            </ul>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
