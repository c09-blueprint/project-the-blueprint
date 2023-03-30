import "./navbar.css";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../../buttons/logoutButton";
import { LoginButton } from "../../buttons/loginButton";
import { SignupButton } from "../../buttons/signupButton";

import axios from "axios";

const NavbarHome = () => {
  /* Conditionally rendering signin/login/logout button */
  const { isAuthenticated } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();

  const handleTestAuthorize = async () => {
    const accessToken = await getAccessTokenSilently();
    console.log(accessToken);
    const res = await axios.get("http://localhost:3001/authorized", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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

export default NavbarHome;
