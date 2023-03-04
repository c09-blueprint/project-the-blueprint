import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "./App.css";

import { createUser, getMe } from "./reducers/userReducer";
import TestReactFlow from "./test";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    user && console.log(user);
  }, [user]);

  function dispatchCreateUser() {
    dispatch(
      createUser({
        username: "test",
      })
    );
  }

  ///////////////////////////////////////
  const ydoc = new Y.Doc();

  // Sync clients with the y-websocket provider
  const websocketProvider = new WebsocketProvider(
    "ws://localhost:3002",
    "test-room",
    ydoc
  );

  // array of numbers which produce a sum
  const yarray = ydoc.getArray("count");

  // observe changes of the sum
  yarray.observe((event) => {
    // print updates when the data changes
    console.log("new sum: " + yarray.toArray().reduce((a, b) => a + b));
  });

  // add 1 to the sum
  yarray.push([1]); // => "new sum: 1"

  return (
    <div class="test-react">
      <ReactFlowProvider>
        <TestReactFlow></TestReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
