import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

import { PAGES } from "../../routes";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: process.env.REACT_APP_BASE_URL + PAGES.homePath,
      },
    });
  };

  return (
    <button type="button" className="btn btn-danger" onClick={handleLogout}>
      Log Out
    </button>
  );
};
