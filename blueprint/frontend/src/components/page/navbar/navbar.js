import "./navbar.css";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../../buttons/logoutButton";
import { LoginButton } from "../../buttons/loginButton";
import { SignupButton } from "../../buttons/signupButton";
import { getAuthHeader } from "../../../utils/authService";

import axios from "axios";

const Navbar = () => {
  /* Conditionally rendering signin/login/logout button */
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleTestAuthorize = async () => {
    const accessToken = await getAccessTokenSilently();
    const res = await axios.get(
      "http://localhost:3001/authorized",
      getAuthHeader(user.email, accessToken)
    );
    console.log(res.data);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark menubar">
      <a className="navbar-brand mb-0 h1 bp-logo" href="#">
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
        <ul className="navbar-nav menu-item-padding">
          <li className="nav-item active">
            <a className="nav-link" href="#">
              My Workspace
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
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
              <a className="dropdown-item" href="#">
                Board
              </a>
            </div>
          </li>
        </ul>
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
        {isAuthenticated && (
          <ul className="navbar-nav ms-auto menu-item-padding">
            <li className="nav-item">
              <LogoutButton />
            </li>
          </ul>
        )}
        <ul className="navbar-nav ms-auto menu-item-padding">
          <button onClick={handleTestAuthorize}>Test authorize</button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
