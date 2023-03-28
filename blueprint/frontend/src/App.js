import React from "react";
import { Routes, Route } from "react-router-dom";

import { PAGES, DASHBOARD, SENDGRID, HOME } from "./routes";
import NotFound from "./components/page/NotFoundPage";
import Dashboard from "./components/page/dashboard/dashboard";
import ReactFlowPage from "./components/page/reactFlow/ReactFlowPage";
import SGTest from "./SendGrid/sendGridTest.js";
import LandingPage from "./components/page/landingPage/landingPage.js";

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path={PAGES.pagePath} element={<ReactFlowPage />} />
        <Route path={DASHBOARD.pagePath} element={<Dashboard />} />
        <Route path={SENDGRID.pagePath} element={<SGTest />} />
        <Route path={HOME.pagePath} element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
