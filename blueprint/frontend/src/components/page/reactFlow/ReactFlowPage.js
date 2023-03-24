import "./reactFlowPage.css";
import WhiteboardReactFlow from "./whiteboardEdit";

import { ReactFlowProvider } from "reactflow";
const ReactFlowPage = () => {
  return (
    <div className="react-flow-page">
      <ReactFlowProvider>
        <WhiteboardReactFlow />
      </ReactFlowProvider>
    </div>
  );
};

export default ReactFlowPage;
