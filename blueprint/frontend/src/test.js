import "reactflow/dist/style.css";

import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from "reactflow";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

// this specifies the websocket server
const HOST = "localhost";
const PORT = "3002";
const WEBSOCKET_URL = "ws://" + HOST + ":" + PORT;

// initial document
const ydoc = new Y.Doc();

// ymap
const elementMap = ydoc.getMap("element-map");

// *HARD CODED FOR NOW* unique room id
const roomId = "test-id";

const TestReactFlow = () => {
  /*
    Initial document setup.
  */
  const initialNodes = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "Hello" },
      type: "input",
    },
    {
      id: "2",
      position: { x: 100, y: 100 },
      data: { label: "World" },
    },
  ];
  const initialEdges = [];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodesChanged, setNodesChanged] = useState(false);
  const [edgesChanged, setEdgesChanged] = useState(false);

  /* 
    Connect to y-websocket provider with YJS document and unique room id.
    Set up observer
  */
  useEffect(() => {
    // make websocket server connection on mount
    const websockerProvider = new WebsocketProvider(
      WEBSOCKET_URL,
      roomId,
      ydoc
    );
    console.log("Connected to YJS websocket provider.");

    // set up observer
    elementMap.observe((event) => {
      console.log("observed");
      setNodes(elementMap.get("nodes"));
      setEdges(elementMap.get("edges"));
    });

    // cleanup function to disconnect from websocket when unmount
    return () => {
      websockerProvider.destroy();
    };
  }, []);

  /*
    Publishers. 
    Only publish if this user made changes.
  */
  useEffect(() => {
    if (nodesChanged) {
      elementMap.set("nodes", nodes);
      setNodesChanged(false);
    }
  }, [nodesChanged, nodes]);

  useEffect(() => {
    if (edgesChanged) {
      elementMap.set("edges", edges);
      setEdgesChanged(false);
    }
  }, [edgesChanged, edges]);

  /*
    Callbacks to handle changes made by this user.
  */
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    setNodesChanged(true);
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    setEdgesChanged(true);
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    setEdgesChanged(true);
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TestReactFlow;
