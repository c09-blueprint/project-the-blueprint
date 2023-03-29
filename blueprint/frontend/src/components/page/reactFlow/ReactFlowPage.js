import "./reactFlowPage.css";
import WhiteboardReactFlow from "./whiteboardEdit";
import Navbar from "../navbar/navbar.js";

import { ReactFlowProvider } from "reactflow";
const ReactFlowPage = () => {
  return (
    <div className="react-flow-page">
      <Navbar />
      <ReactFlowProvider>
        <WhiteboardReactFlow />
      </ReactFlowProvider>
    </div>
  );
};

export default ReactFlowPage;
