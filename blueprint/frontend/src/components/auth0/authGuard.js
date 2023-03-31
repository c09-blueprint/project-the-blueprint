import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

export const AuthGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div>
        <p>Loading...</p>
      </div>
    ),
  });

  return <Component />;
};
