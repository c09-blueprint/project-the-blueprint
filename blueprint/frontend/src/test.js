import "reactflow/dist/style.css";
import "./test.css";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactFlow, { Controls, Background, useReactFlow } from "reactflow";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import { setNodes, updateNodes, addNewNode } from "./reducers/nodeReducer";
import { setEdges, updateEdges, addNewEdge } from "./reducers/edgeReducer";
import {
  setUserModifiedNodes,
  setUserModifiedEdges,
} from "./reducers/userStateReducer";

import splitterNode from "./components/customNode/splitterNode";
import resizableDefaultNode from "./components/customNode/resizableDefaultNode";
import resizableInputNode from "./components/customNode/resizableInputNode";
import resizableOutputNode from "./components/customNode/resizableOutputNode";

/* Custom Node Types */
const customNodeTypes = {
  splitterNode,
  resizableDefaultNode,
  resizableInputNode,
  resizableOutputNode,
};

/* For setting up yjs connection */
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
  const dispatch = useDispatch();

  const reactFlowInstance = useReactFlow();
  const connectionLineStyle = { stroke: "#2495ff" };

  const nodes = useSelector((state) => state.nodes);
  const edges = useSelector((state) => state.edges);
  const userModifiedNodes = useSelector(
    (state) => state.userState.modifiedNodes
  );
  const userModifiedEdges = useSelector(
    (state) => state.userState.modifiedEdges
  );

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
      dispatch(setNodes(elementMap.get("nodes")));
      dispatch(setEdges(elementMap.get("edges")));
    });

    // cleanup function to disconnect from websocket when unmount
    return () => {
      websockerProvider.destroy();
    };
  }, [dispatch]);

  /*
    Publishers. 
    Only publish if this user made changes.
  */
  useEffect(() => {
    // todo
    if (userModifiedNodes) {
      console.log("user changed nodes");
      elementMap.set("nodes", nodes);
      dispatch(setUserModifiedNodes(false));
    }
  }, [dispatch, nodes, userModifiedNodes]);

  useEffect(() => {
    // todo
    if (userModifiedEdges) {
      console.log("user changed edges");
      elementMap.set("edges", edges);
      dispatch(setUserModifiedEdges(false));
    }
  }, [dispatch, edges, userModifiedEdges]);

  /* Callback functions to handle user-made changes. */
  const onNodesChange = useCallback(
    (changes) => dispatch(updateNodes(changes)),
    [dispatch]
  );

  const onEdgesChange = useCallback(
    (changes) => dispatch(updateEdges(changes)),
    [dispatch]
  );

  const onConnect = useCallback(
    (params) => dispatch(addNewEdge(params)),
    [dispatch]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

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

      // setup new node
      const newNode = {
        type,
        position,
        data: { label: `${type} node` },
      };
      if (style !== "undefined") {
        newNode.style = JSON.parse(style);
      }

      // add node
      dispatch(addNewNode(newNode));
    },
    [dispatch, reactFlowInstance]
  );

  const onDragStart = (event, nodeType, style) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("style", style);
    event.dataTransfer.effectAllowed = "move";
  };

  const resizableStyle =
    '{ "background": "#fff", "border": "1px solid black", "borderRadius": 15, "fontSize": 12 }';

  return (
    <div style={{ height: "100%" }} className="container-fluid">
      <div className="row" style={{ height: "100%", width: "100%" }}>
        <div
          className="col d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
          style={{ width: 280 }}
        >
          <button
            onDragStart={(event) =>
              onDragStart(event, "resizableInputNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add input node
          </button>
          <button
            onDragStart={(event) =>
              onDragStart(event, "resizableOutputNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add output node
          </button>
          <button
            onDragStart={(event) =>
              onDragStart(event, "splitterNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add splitter node
          </button>
          <button
            onDragStart={(event) =>
              onDragStart(event, "resizableDefaultNode", resizableStyle)
            }
            draggable
            id="btn-add"
          >
            add DefaultNode node
          </button>
        </div>

        <div className="col-11">
          <ReactFlow
            nodes={nodes.nodes}
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
