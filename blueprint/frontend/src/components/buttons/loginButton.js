import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { PAGES } from "../../routes";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: PAGES.dashboardPath,
      },
    });
  };

  return (
    <button type="button" class="btn btn-light" onClick={handleLogin}>
      Log In
    </button>
  );
};
