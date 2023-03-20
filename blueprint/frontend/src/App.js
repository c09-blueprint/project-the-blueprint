import React from "react";
import { Routes, Route } from "react-router-dom";

import { PAGES, DASHBOARD } from "./routes";
import NotFound from "./components/page/NotFoundPage";
import Dashboard from "./components/page/dashboard/dashboard";
import ReactFlowPage from "./components/page/reactFlow/ReactFlowPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path={PAGES.pagePath} element={<ReactFlowPage />} />
        <Route path={DASHBOARD.pagePath} element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
