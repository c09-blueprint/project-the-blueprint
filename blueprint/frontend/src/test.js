import "reactflow/dist/style.css";
import "./test.css";

import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  useReactFlow,
} from "reactflow";

import { updateNode } from "./reducers/nodeReducer";
import { updateEdge } from "./reducers/edgeReducer";

import splitterNode from "./components/customNode/splitterNode";
import resizableDefaultNode from "./components/customNode/resizableDefaultNode";
import resizableInputNode from "./components/customNode/resizableInputNode";
import resizableOutputNode from "./components/customNode/resizableOutputNode";

const customNodeTypes = {
  splitterNode,
  resizableDefaultNode,
  resizableInputNode,
  resizableOutputNode,
};

const TestReactFlow = () => {
  const reactFlowInstance = useReactFlow();
  const dispatch = useDispatch();

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
      //   data: { label: "World" },
    },
    // {
    //   id: "3",
    //   type: "splitterNode",
    //   position: { x: 300, y: 50 },
    // },
    // {
    //   id: "4",
    //   type: "resizableDefaultNode",
    //   data: { label: "NodeResizer when selected" },
    //   position: { x: 100, y: 300 },
    //   style: {
    //     background: "#fff",
    //     border: "1px solid black",
    //     borderRadius: 15,
    //     fontSize: 12,
    //   },
    // },
  ];
  const initialEdges = [];

  let nodeId = initialNodes.length;
  const connectionLineStyle = { stroke: "#2495ff" };

  let [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  //dispatch(updateNode(initialNodes)); // Infinite loop when this is uncommented...
  let nodesStore = useSelector((state) => state.node);
  useEffect(() => {
    dispatch(updateNode(nodes));
    console.log("USEEFFECT NODES STORE 1", nodesStore);
    console.log("USEEFFECT NODES", nodes);
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

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      nodeId++;

      // const id = `${++nodeId}`;
      console.log("nodeIdDrop", nodeId);

      const type = event.dataTransfer.getData("application/reactflow");
      const style = event.dataTransfer.getData("style");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - 50,
        y: event.clientY - 50,
      });
      const newNode = {
        id: `${nodeId}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      console.log("STYLE ", style);
      console.log(typeof style);
      if (style !== "undefined") {
        newNode.style = JSON.parse(style);
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodeId, setNodes]
  );

  // const addDefaultNode = useCallback(() => {
  //   console.log("nodeIdDrag", nodeId);
  //   let currentNodes = reactFlowInstance.getNodes();
  //   nodeId++;
  //   const newNode = {
  //     id: `${nodeId}`,
  //     position: {
  //       x: window.innerWidth / 2,
  //       y: window.innerHeight / 2,
  //     },
  //     data: {
  //       label: `Node ${nodeId}`,
  //     },
  //   };
  //   console.log("newNode", nodeId);
  //   setNodes((nds) => nds.concat(newNode));
  // }, [nodeId]);

  // export function SetNodeLabel(nodeId, label) {
  //   setNodes((nds) => {
  //     nds.forEach((node) => {
  //       if (node.id === nodeId) {
  //         node.data.label = label;
  //       }
  //     });
  //     return nds;
  //   });
  // }

  const onDragStart = (event, nodeType, style) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("style", style);
    event.dataTransfer.effectAllowed = "move";
  };

  const logCurrentState = useCallback(() => {
    console.log(reactFlowInstance);
    console.log(reactFlowInstance.getNodes());
    console.log(reactFlowInstance.getEdges());
  }, []);

  const resizableStyle =
    '{ "background": "#fff", "border": "1px solid black", "borderRadius": 15, "fontSize": 12 }';

  return (
    <div style={{ height: "100%" }} class="container-fluid">
      {/* <button
            //onClick={addDefaultNode}
            onDragStart={(event) =>
              onDragStart(event, "resizableInputNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add input node
          </button>
          <button
            //onClick={addDefaultNode}
            onDragStart={(event) =>
              onDragStart(event, "resizableOutputNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add output node
          </button>
          <button
            //onClick={addDefaultNode}
            onDragStart={(event) =>
              onDragStart(event, "splitterNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add splitter node
          </button>
          <button
            //onClick={addDefaultNode}
            onDragStart={(event) =>
              onDragStart(event, "resizableDefaultNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add resizableDefaultNode node
          </button>

          <button onClick={logCurrentState} className="btn-add">
            log current state
          </button> */}

      <div class="row" style={{ height: "100%", width: "100%" }}>
        <div
          class="col d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
          style={{ width: 280 }}
        >
          <button
            //onClick={addDefaultNode}
            onDragStart={(event) =>
              onDragStart(event, "resizableInputNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add input node
          </button>
          <button
            //onClick={addDefaultNode}
            onDragStart={(event) =>
              onDragStart(event, "resizableOutputNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add output node
          </button>
          <button
            //onClick={addDefaultNode}
            onDragStart={(event) =>
              onDragStart(event, "splitterNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add splitter node
          </button>
          <button
            //onClick={addDefaultNode}
            onDragStart={(event) =>
              onDragStart(event, "resizableDefaultNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add DefaultNode node
          </button>
          <button onClick={logCurrentState} className="btn-add">
            log current state
          </button>
        </div>

        <div class="col-11">
          <ReactFlow
            nodes={nodesStore}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            connectionLineStyle={connectionLineStyle}
            nodeTypes={customNodeTypes}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default TestReactFlow;
