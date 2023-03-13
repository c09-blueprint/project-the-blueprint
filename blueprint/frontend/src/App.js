import React from "react";
import { Routes, Route } from "react-router-dom";

import { PAGES } from "./routes";
import NotFound from "./components/page/NotFoundPage";
import ReactFlowPage from "./components/page/reactFlow/ReactFlowPage";

function App() {

  return (
    <div>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path={PAGES.pagePath} element={<ReactFlowPage />} />
      </Routes>
    </div>
  );
}

export default App;
