import "reactflow/dist/style.css";
import "./whiteboardEdit.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReactFlow, { Controls, Background, useReactFlow } from "reactflow";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Peer } from "peerjs";

import {
  setNodes,
  updateNodes,
  addNewNode,
} from "../../../reducers/nodeReducer";
import {
  setEdges,
  updateEdges,
  addNewEdge,
} from "../../../reducers/edgeReducer";
import {
  setUserModifiedNodes,
  setUserModifiedEdges,
} from "../../../reducers/userStateReducer";

import splitterNode from "../../customNode/splitterNode";
import resizableDefaultNode from "../../customNode/resizableDefaultNode";
import resizableInputNode from "../../customNode/resizableInputNode";
import resizableOutputNode from "../../customNode/resizableOutputNode";
import resizableText from "../../customNode/resizableText";
import circleNode from "../../customNode/circleNode";
import diamondNode from "../../customNode/diamondNode";
import triangleNode from "../../customNode/triangleNode";
import defaultEdge from "../../customEdge/defaultEdge";
import straightEdge from "../../customEdge/straightEdge";
import stepEdge from "../../customEdge/stepEdge";

import UserVideo from "../userVideo/userVideo";

/* Custom Node Types */
const customNodeTypes = {
  splitterNode,
  resizableDefaultNode,
  resizableInputNode,
  resizableOutputNode,
  resizableText,
  circleNode,
  diamondNode,
  triangleNode,
};

const customEdgeTypes = {
  defaultEdge,
  straightEdge,
  stepEdge,
};

/* For setting up yjs connection */
const HOST = "localhost";
const PORT = "3002";
const WEBSOCKET_URL = "ws://" + HOST + ":" + PORT;

// initial document
const ydoc = new Y.Doc();

// ymap
const elementMap = ydoc.getMap("element-map");

const WhiteboardReactFlow = () => {
  const { userId, roomId } = useParams();

  const [edgeType, setEdgeType] = useState("defaultEdge");
  const [edgeTypeStyle, setEdgeTypeStyle] = useState("default");
  const reactFlowInstance = useReactFlow();

  const reactFlowWrapper = useRef(null);

  const dispatch = useDispatch();

  const connectionLineStyle = { stroke: "#2495ff" };

  const nodes = useSelector((state) => state.nodes);
  const edges = useSelector((state) => state.edges);
  const userModifiedNodes = useSelector(
    (state) => state.userState.modifiedNodes
  );
  const userModifiedEdges = useSelector(
    (state) => state.userState.modifiedEdges
  );

  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  const [remakePeer, setRemakePeer] = useState(false);
  // const [dataConnection, setDataConnection] = useState(null);
  // const remoteVideoRef = useRef(null);
  const allConnections = [];
  useEffect(() => {
    const peer = new Peer(userId);

    peer.on("open", function (id) {
      setPeerId(id);
      console.log("My peer ID is: " + id);
    });

    peer.on("connection", (connection) => {
      //setDataConnection(connection);
      allConnections.push(connection);
      console.log("connection", allConnections);
      console.log(
        "!!!!!!@@@@@@@@@@@@@@@@@@@@@ connection id" + connection.peer
      );
      connection.on("close", () => {
        // Clear the video element of the remote user
        // const remoteVideo = document.getElementById('remote-video');
        // remoteVideo.srcObject = null;
        console.log(
          "HELLOOOOOOOOOOO @@@@@@@@@@@@@@@@@@@@@ connection id" +
            connection.peer
        );
        console.log(
          "WORLD              @@@@@@@@@@@@@@@@@@@@@@@@@@@ connection" +
            connection
        );

        var remoteUserVideoWrapper = document.getElementById(connection.peer);
        remoteUserVideoWrapper.remove();
      });

      connection.on("error", () => {
        // Clear the video element of the remote user
        // const remoteVideo = document.getElementById('remote-video');
        // remoteVideo.srcObject = null;
        console.log(
          "HELLOOOOOOOOOOO @@@@@@@@@@@@@@@@@@@@@ connection id" +
            connection.peer
        );
        console.log(
          "WORLD              @@@@@@@@@@@@@@@@@@@@@@@@@@@ connection" +
            connection
        );

        var remoteUserVideoWrapper = document.getElementById(connection.peer);
        remoteUserVideoWrapper.remove();
      });
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", (remoteStream) => {
          var remoteUserVideoWrapper =
            document.getElementById("remote-user-videos");
          var singleVideoWrapper = document.createElement("div");
          singleVideoWrapper.setAttribute("id", call.peer);

          var remoteVideo = document.createElement("video");
          remoteVideo.setAttribute("class", "remote-video");
          remoteVideo.setAttribute("autoplay", "true");
          remoteVideo.setAttribute("muted", "true");
          remoteVideo.srcObject = remoteStream;

          var remoteIdText = document.createElement("p");
          remoteIdText.setAttribute("class", "remote-id-text");
          remoteIdText.innerHTML = call.peer;
          singleVideoWrapper.appendChild(remoteVideo);
          singleVideoWrapper.appendChild(remoteIdText);
          remoteUserVideoWrapper.appendChild(singleVideoWrapper);
        });
      });
    });
    peerInstance.current = peer;
  }, [remakePeer]);

  const call = (remotePeerIds) => {
    console.log("peer", peerInstance.current);

    let users = elementMap.get("users");
    if (users === undefined) {
      users = [];
    }
    console.log("users open: ", users);
    if (!users.includes(peerId)) {
      users.push(peerId);
    }
    elementMap.set("users", users);

    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    console.log("remotePeerIds!!!!!!!!!!!!!!!!!!!: ", remotePeerIds);
    getUserMedia(
      { video: true },
      function (stream) {
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play();

        var remoteUserVideoWrapper =
          document.getElementById("remote-user-videos");

        console.log(
          "remotePeerIds!!!!!!!!!!!!!!!!!!@@@@@@@@@@@!: ",
          remotePeerIds
        );

        for (let i = 0; i < remotePeerIds.length; i++) {
          if (remotePeerIds[i] === peerId) {
            console.log("same peer id");
            continue;
          }
          var call = peerInstance.current.call(remotePeerIds[i], stream);
          var connect = peerInstance.current.connect(remotePeerIds[i]);
          allConnections.push(connect);
          call.on("stream", (remoteStream) => {
            var remoteVideo = document.createElement("video");
            remoteVideo.setAttribute("id", remotePeerIds[i]);
            remoteVideo.setAttribute("class", "remote-video");
            remoteVideo.setAttribute("autoplay", "true");
            remoteVideo.setAttribute("muted", "true");
            remoteVideo.srcObject = remoteStream;

            var remoteIdText = document.createElement("p");
            remoteIdText.setAttribute("class", "remote-id-text");
            remoteIdText.innerHTML = remotePeerIds[i];
            remoteUserVideoWrapper.appendChild(remoteIdText);
            remoteUserVideoWrapper.appendChild(remoteVideo);

            console.log("remote stream *****************:", remoteStream);
            console.log("remote video ref:", remotePeerIds[i]);
          });
        }

        connect.on("close", () => {
          console.log(
            "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& current user just connection closed"
          );
          var remoteUserVideoWrapper = document.getElementById(connect.peer);
          remoteUserVideoWrapper.remove();
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  };

  const hangUp = () => {
    let users = elementMap.get("users");
    if (users === undefined) {
      users = [];
    }
    console.log("users open: ", users);
    const index = users.indexOf(peerId);
    if (index > -1) {
      users.splice(index, 1);
    }
    elementMap.set("users", users);

    var remoteVideos = document.getElementsByClassName("remote-video");
    for (let i = 0; i < remoteVideos.length; i++) {
      remoteVideos[i].pause();
      remoteVideos[i].srcObject = null;
    }
    peerInstance.current.destroy();
    console.log(
      "************************* peerInstance.current: ",
      peerInstance.current
    );
    for (let i = 0; i < allConnections.length; i++) {
      allConnections[i].close();
    }
    setRemakePeer(!remakePeer);
  };

  const logCallState = () => {
    console.log("ALL CONNECTIONS: ", allConnections);

    console.log("peerInstance.current: ", peerInstance.current);
    console.log(
      "peerInstance.current.connections: ",
      peerInstance.current.connections
    );
    console.log(
      "peerInstance.current.destroyed: ",
      peerInstance.current.destroyed
    );
    console.log(
      "peerInstance.current.disconnected: ",
      peerInstance.current.disconnected
    );
    console.log("peerInstance.current.open: ", peerInstance.current.open);
    console.log(
      "peerInstance.current.reliable: ",
      peerInstance.current.reliable
    );
  };
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

    // set up observer
    elementMap.observe((event) => {
      console.log("observed");
      dispatch(setNodes(elementMap.get("nodes")));
      dispatch(setEdges(elementMap.get("edges")));
      console.log("NODES", elementMap.get("nodes"));
      console.log("USERS:", elementMap.get("users"));
    });

    // cleanup function to disconnect from websocket when unmount
    return () => {
      websockerProvider.destroy();
    };
  }, [dispatch, roomId]);

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
    (params) => dispatch(addNewEdge({ ...params, type: edgeType })),
    [dispatch, edgeType]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onClickAddNode = useCallback(
    (type, style, data) => {
      const reactFlowBoundry = reactFlowWrapper.current.getBoundingClientRect();

      if (typeof type === "undefined" || !type) {
        return;
      }

      const newNode = {
        type,
        position: {
          x: window.innerWidth / 2 - reactFlowBoundry.left,
          y: window.innerHeight / 2 - reactFlowBoundry.top,
        },
        data: { label: `${type} node`, shape: data },
      };
      if (style !== "undefined") {
        newNode.style = JSON.parse(style);
        console.log("style: ", newNode.style);
      }
      dispatch(addNewNode(newNode));
    },
    [dispatch]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      // get the reactflow bounds so we can calculate the correct position
      const reactFlowBoundry = reactFlowWrapper.current.getBoundingClientRect();
      console.log("reactFlowBounds: ", reactFlowBoundry);

      const type = event.dataTransfer.getData("nodeType");
      const style = event.dataTransfer.getData("style");
      const data = event.dataTransfer.getData("data");
      console.log("DATA **************: ", data);
      // check if the dropped node is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBoundry.left,
        y: event.clientY - reactFlowBoundry.top,
      });

      // setup new node
      const newNode = {
        type,
        position,
        data: { label: `${type}` },
      };
      if (style !== "undefined") {
        newNode.style = JSON.parse(style);
        console.log("style: ", newNode.style);
      }

      // add node
      dispatch(addNewNode(newNode));
    },
    [dispatch, reactFlowInstance]
  );

  const onDragStart = (event, nodeType, style, data) => {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.setData("style", style);
    event.dataTransfer.setData("data", data);
    event.dataTransfer.effectAllowed = "move";
  };

  const logCurrentState = useCallback(() => {
    console.log(reactFlowInstance);
    console.log(reactFlowInstance.getNodes());
    console.log(reactFlowInstance.getEdges());
  }, [reactFlowInstance]);

  const changeEdgeType = (edge) => {
    setEdgeType(edge);
    if (edge === "defaultEdge") {
      setEdgeTypeStyle("default");
    } else if (edge === "straightEdge") {
      setEdgeTypeStyle("straight");
    } else if (edge === "stepEdge") {
      setEdgeTypeStyle("smoothstep");
    }
  };

  const resizableStyle =
    '{ "background": "#fff", "border": "1px solid black", "borderRadius": 3, "fontSize": 12}';

  const resizableTextStyle =
    '{ "background": "rgba(0, 0, 0, 0)", "fontSize": 12 }';

  return (
    <div style={{ height: "100%" }} className="container-fluid overflow-auto">
      <div
        className="row no-padding-margin"
        style={{ height: "95%", width: "100%" }}
      >
        <div className="col-xl-3 col-12 col-md-3 d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
          <button
            onClick={logCurrentState}
            className="btn-add"
            style={{ marginBottom: "20px" }}
          >
            log state
          </button>
          <h4>Add Node</h4>
          <div className="two-grid">
            <button
              onClick={() =>
                onClickAddNode("resizableInputNode", resizableStyle)
              }
              onDragStart={(event) =>
                onDragStart(event, "resizableInputNode", resizableStyle)
              }
              draggable
              id="input-node"
              className="drop-icon"
            >
              input
            </button>
            <button
              onClick={() =>
                onClickAddNode("resizableOutputNode", resizableStyle)
              }
              onDragStart={(event) =>
                onDragStart(event, "resizableOutputNode", resizableStyle)
              }
              draggable
              id="output-node"
              className="drop-icon"
            >
              output
            </button>
            <button
              onClick={() => onClickAddNode("splitterNode", resizableStyle)}
              onDragStart={(event) =>
                onDragStart(event, "splitterNode", resizableStyle)
              }
              draggable
              id="splitter-node"
              className="drop-icon"
            >
              2-split
            </button>
            <button
              onClick={() =>
                onClickAddNode("resizableDefaultNode", resizableStyle)
              }
              onDragStart={(event) =>
                onDragStart(event, "resizableDefaultNode", resizableStyle)
              }
              draggable
              id="default-node"
              className="drop-icon"
            >
              default
            </button>
            <button
              onClick={() =>
                onClickAddNode("resizableText", resizableTextStyle)
              }
              onDragStart={(event) =>
                onDragStart(event, "resizableText", resizableTextStyle)
              }
              draggable
              className="drop-icon"
            >
              text
            </button>
            <button
              onClick={() => onClickAddNode("circleNode", resizableTextStyle)}
              onDragStart={(event) =>
                onDragStart(event, "circleNode", resizableTextStyle)
              }
              draggable
              className="drop-icon"
            >
              circle
            </button>
            <button
              onClick={() => onClickAddNode("diamondNode", resizableTextStyle)}
              onDragStart={(event) =>
                onDragStart(event, "diamondNode", resizableTextStyle)
              }
              draggable
              className="drop-icon"
            >
              diamond
            </button>
            <button
              onClick={() => onClickAddNode("triangleNode", resizableTextStyle)}
              onDragStart={(event) =>
                onDragStart(event, "triangleNode", resizableTextStyle)
              }
              draggable
              className="drop-icon"
            >
              triangle
            </button>
          </div>
          <h4>Change Edge Type</h4>
          <div className="two-grid">
            <button
              onClick={() => changeEdgeType("defaultEdge")}
              style={{ marginBottom: "20px" }}
              id="default-edge"
              className="drop-icon"
            ></button>
            <button
              onClick={() => changeEdgeType("straightEdge")}
              style={{ marginBottom: "20px" }}
              id="straight-edge"
              className="drop-icon"
            ></button>

            <button
              onClick={() => changeEdgeType("stepEdge")}
              style={{ marginBottom: "20px" }}
              id="step-edge"
              className="drop-icon"
            ></button>
          </div>
        </div>

        <div
          className="col-xl-7 col-12 col-md-9 no-padding-margin"
          style={{ height: "100%" }}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes.nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            connectionLineStyle={connectionLineStyle}
            edgeTypes={customEdgeTypes}
            connectionLineType={edgeTypeStyle}
            nodeTypes={customNodeTypes}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="col-xl-2 col-12 col-md-3 d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
          <h1>Current user id is {peerId}</h1>
          <button
            onClick={logCallState}
            className="btn-add"
            style={{ marginBottom: "20px" }}
          >
            log state
          </button>
          <input
            type="text"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
          />
          <button
            onClick={() => call(elementMap.get("users"))}
            style={{ marginBottom: "20px" }}
          >
            Call
          </button>
          <button onClick={hangUp}>disconnect</button>

          {/* <UserVideo ref={currentUserVideoRef} />
          <UserVideo ref={remoteVideoRef} /> */}
          {/* <video ref={remoteVideoRef} /> */}
          <video ref={currentUserVideoRef} />
          <div id="remote-user-videos"></div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardReactFlow;
