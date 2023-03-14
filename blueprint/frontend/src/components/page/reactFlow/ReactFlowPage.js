import "./reactFlowPage.css";
import TestReactFlow from "./test";

import { ReactFlowProvider } from "reactflow";

const ReactFlowPage = () => {
  return (
    <div className="react-flow-page">
      <ReactFlowProvider>
        <TestReactFlow></TestReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default ReactFlowPage;
