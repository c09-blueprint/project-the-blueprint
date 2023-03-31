import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

import { PAGES } from "../../routes";

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: PAGES.dashboardPath,
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <button
      type="button"
      className="btn btn-primary mr-3"
      onClick={handleSignUp}
    >
      Sign Up
    </button>
  );
};
