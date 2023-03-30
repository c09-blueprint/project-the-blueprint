import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { CallbackPage } from "./components/auth0/emptyCallback";
import { AuthGuard } from "./components/auth0/authGuard";

import { PAGES, SENDGRID } from "./routes";
import NotFound from "./components/page/NotFoundPage";
import Dashboard from "./components/page/dashboard/dashboard";
import ReactFlowPage from "./components/page/reactFlow/ReactFlowPage";
import SGTest from "./SendGrid/sendGridTest.js";
import LandingPage from "./components/page/landingPage/landingPage.js";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path={PAGES.homePath} element={<LandingPage />} />
        <Route path={PAGES.auth0CallbackPath} element={<CallbackPage />} />
        <Route path={SENDGRID.pagePath} element={<SGTest />} />

        <Route
          path={PAGES.dashboardPath}
          element={<AuthGuard component={Dashboard} />}
        />
        <Route
          path={PAGES.pagePath}
          element={<AuthGuard component={ReactFlowPage} />}
        />
      </Routes>
    </div>
  );
}

export default App;
