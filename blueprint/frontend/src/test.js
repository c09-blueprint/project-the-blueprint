import "reactflow/dist/style.css";
import "./drawing.css";
// import "./draw.js";
import "./drawFabric.js";

import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from "reactflow";

import { updateNode } from "./reducers/nodeReducer";
import { updateEdge } from "./reducers/edgeReducer";

const TestReactFlow = () => {
  const dispatch = useDispatch();
  const panOnDrag = [1, 2];

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

  useEffect(() => {
    dispatch(updateNode(nodes));
  }, [dispatch, nodes]);

  useEffect(() => {
    dispatch(updateEdge(edges));
  }, [dispatch, edges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div>
      <button id="reset">Reset</button>
      <button id="restore">Restore</button>
      <button id="save">Save</button>
      <button id="red">Add textbox</button>
      <button id="drawON">Drawing ON</button>
      <button id="drawOFF">Drawing OFF</button>
      <button id="reactON">Use React-Flow ON</button>
      <button id="reactOFF">Use React-Flow OFF</button>
      <div className="container">
        <div id="react-layer" className="box">
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            panOnDrag={panOnDrag}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div id="canvas-overlay" className="box overlay">
          <canvas id="canvas" className=""></canvas>
        </div>
      </div>
    </div>
  );
};

export default TestReactFlow;