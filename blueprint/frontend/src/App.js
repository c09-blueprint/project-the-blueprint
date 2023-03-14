import "./App.css";
import { createUser, getMe } from "./reducers/userReducer";
import TestReactFlow from "./test";

import { ReactFlowProvider } from "reactflow";

function App() {
  return (
    <div className="test-react">
      <ReactFlowProvider>
        <TestReactFlow></TestReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
