import "reactflow/dist/style.css";
import "./whiteboardEdit.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Controls,
  Background,
  useReactFlow,
  MiniMap,
} from "reactflow";
import ReactDOM from "react-dom";

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
import { useAuth0 } from "@auth0/auth0-react";
import { boardServices } from "../../../services/boardService";
import { getAuthHeader } from "../../../utils/authService";
import axios from "axios";

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
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

// initial document
// const ydoc = new Y.Doc();

// ymap
// const elementMap = ydoc.getMap("element-map");

const WhiteboardReactFlow = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  const { roomId } = useParams();

  const [elementMap, setElementMap] = useState(null);
  const [peerToRemove, setPeerToRemove] = useState(null);
  const [peerVideoToDisable, setPeerVideoToDisable] = useState(null);

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
  const [dataConnection, setDataConnection] = useState(null);

  let callList = [];
  const [videoMap, setVideoMap] = useState(new Map());

  // const PeerVideo = ({ stream, call }) => {
  //   //attach to element with id "remote-user-videos"

  //   return (
  //     <div id={call.peer}>
  //       <p id={call.peer + "-text"}>{call.peer}</p>
  //       <video
  //         className="remote-video mb-4"
  //         autoPlay
  //         muted
  //       />
  //     </div>
  //   );
  // };

  const createVideoPlayer = (stream, call) => {
    var remoteUserVideoWrapper = document.getElementById("remote-user-videos");
    var singleVideoWrapper = document.createElement("div");
    singleVideoWrapper.setAttribute("id", call.peer);

    var remoteVideo = document.createElement("video");
    remoteVideo.setAttribute("class", "remote-video mb-4");
    remoteVideo.setAttribute("autoplay", "true");
    remoteVideo.muted = true;
    remoteVideo.srcObject = stream;

    var remoteIdText = document.createElement("p");
    remoteIdText.setAttribute("class", "remote-id-text");
    remoteIdText.innerHTML = call.peer;
    remoteIdText.setAttribute("id", call.peer + "-text");
    let muteWrapper = document.createElement("div");
    muteWrapper.setAttribute("class", "mute-wrapper");
    let muteText = document.createElement("p");
    muteText.setAttribute("class", "mute-text");
    muteText.innerHTML = "Muted";
    let muteButton = document.createElement("button");
    muteButton.setAttribute("class", "mute-button btn btn-light");
    muteButton.innerHTML = "Toggle Mute";
    muteButton.addEventListener("click", () => {
      if (remoteVideo.muted) {
        remoteVideo.muted = false;
        muteText.classList.add("hidden");
      } else {
        remoteVideo.muted = true;
        muteText.classList.remove("hidden");
      }
    });

    muteWrapper.appendChild(muteButton);
    muteWrapper.appendChild(muteText);
    singleVideoWrapper.appendChild(remoteIdText);
    singleVideoWrapper.appendChild(muteWrapper);
    singleVideoWrapper.appendChild(remoteVideo);
    remoteUserVideoWrapper.appendChild(singleVideoWrapper);
    callList.push(call.peer);

    console.log("CREATE VIDEO WORKS: ", call.peer);
    setVideoMap((videoMap) => videoMap.set(call.peer, stream));
  };

  function createUUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  useEffect(() => {
    const options = {
      label: user.nickname,
    };
    const peer = new Peer(createUUID(), options);
    console.log("peer: ", peer);
    peer.on("open", function (id) {
      setPeerId(id);
      console.log("My peer ID is: " + id);
    });

    // When a remote peer connects to this peer
    peer.on("connection", (connection) => {
      setDataConnection(connection);
      console.log(
        "!!!!!!@@@@@@@@@@@@@@@@@@@@@ connection id" + connection.peer
      );
    });

    // When a remote peer calls this peer
    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        call.answer(mediaStream);
        call.on("stream", (remoteStream) => {
          if (callList.includes(call.peer)) {
            return;
          } else {
            createVideoPlayer(remoteStream, call);
            // ReactDOM.render(
            //   <PeerVideo stream={remoteStream} call={call} />,
            //   document.getElementById("remote-user-videos")
            // );
          }
        });
      });
    });
    peerInstance.current = peer;
  }, [remakePeer]);

  const call = (remotePeerIds) => {
    // disconnect call button appear using css hidden
    let disconnectCallButton = document.getElementById(
      "disconnect-call-button"
    );
    disconnectCallButton.classList.remove("hidden");
    // make call button disappear using css hidden
    let callButton = document.getElementById("call-button");
    callButton.classList.add("hidden");

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
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        var remoteUserVideoWrapper =
          document.getElementById("remote-user-videos");

        //clear
        remoteUserVideoWrapper.innerHTML = "";

        for (let i = 0; i < remotePeerIds.length; i++) {
          if (remotePeerIds[i] === peerId) {
            continue;
          }
          let call = peerInstance.current.call(remotePeerIds[i], stream);
          var connect = peerInstance.current.connect(remotePeerIds[i]);
          setDataConnection(connect);
          call.on("stream", (remoteStream) => {
            if (callList.includes(call.peer)) {
              return;
            } else {
              createVideoPlayer(remoteStream, call);
              // ReactDOM.render(
              //   <PeerVideo stream={remoteStream} call={call} />,
              //   document.getElementById("remote-user-videos")
              // );
            }
          });
        }
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  };

  const hangUp = () => {
    //START
    let peers = peerToRemove.get("peers");
    if (peers === undefined) {
      peers = [];
    }
    console.log("peers TO REMOVE: ", peers);
    if (!peers.includes(peerId)) {
      peers.push(peerId);
    }
    peerToRemove.set("peers", peers);

    console.log("peerToRemove: AFTER", peerToRemove.get("peers"));
    console.log("peerInstance.current: ", peerInstance.current);
    //END

    // disconnect call button disappear using css hidden
    let disconnectCallButton = document.getElementById(
      "disconnect-call-button"
    );
    disconnectCallButton.classList.add("hidden");
    // make call button appear using css hidden
    let callButton = document.getElementById("call-button");
    callButton.classList.remove("hidden");

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
    var remoteIdtexts = document.getElementsByClassName("remote-id-text");
    for (let i = 0; i < remoteIdtexts.length; i++) {
      remoteIdtexts[i].remove();
    }
    peerInstance.current.destroy();
    console.log(
      "************************* peerInstance.current: ",
      peerInstance.current
    );
    dataConnection.close();
    setRemakePeer(!remakePeer);
  };

  const turnOnCamera = () => {
    // disconnect call button appear using css hidden
    let offCamera = document.getElementById("off-camera-button");
    offCamera.classList.remove("hidden");
    // make call button disappear using css hidden
    let onCamera = document.getElementById("on-camera-button");
    onCamera.classList.add("hidden");

    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play();
        currentUserVideoRef.current.muted = true;
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );

    let peersVideoDisabled = peerVideoToDisable.get("peersVideoDisabled");
    if (peersVideoDisabled === undefined) {
      peersVideoDisabled = [];
    }
    const index = peersVideoDisabled.indexOf(peerId);
    if (index > -1) {
      peersVideoDisabled.splice(index, 1);
    }
    peerVideoToDisable.set("peersVideoDisabled", peersVideoDisabled);
  };

  const turnOffCamera = () => {
    let offCamera = document.getElementById("off-camera-button");
    offCamera.classList.add("hidden");
    let onCamera = document.getElementById("on-camera-button");
    onCamera.classList.remove("hidden");

    currentUserVideoRef.current.pause();
    currentUserVideoRef.current.srcObject = null;

    //START
    let peersVideoDisabled = peerVideoToDisable.get("peersVideoDisabled");
    if (peersVideoDisabled === undefined) {
      peersVideoDisabled = [];
    }
    if (!peersVideoDisabled.includes(peerId)) {
      peersVideoDisabled.push(peerId);
    }
    peerVideoToDisable.set("peersVideoDisabled", peersVideoDisabled);

    console.log(
      "peerToDISABLE VIDEO: AFTER",
      peerVideoToDisable.get("peersVideoDisabled")
    );
    //END
  };

  const logCallState = () => {
    console.log("Element Map: ", elementMap);
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

  useEffect(() => {
    console.log("CHANGED peerToRemove: ", peerToRemove);
  }, [peerToRemove]);

  const testHello = () => {
    console.log("hello WORK");
  };

  /* 
    Connect to y-websocket provider with YJS document and unique room id.
    Set up observer
  */
  useEffect(() => {
    const ydoc = new Y.Doc();
    // make websocket server connection on mount
    const websockerProvider = new WebsocketProvider(
      WEBSOCKET_URL,
      roomId,
      ydoc
    );

    // log connection status
    websockerProvider.on("status", (event) => {
      console.log(event.status);
    });

    const elMap = ydoc.getMap("element-map");
    setElementMap(elMap);
    const peerMap = ydoc.getMap("peer-to-remove");
    setPeerToRemove(peerMap);
    const peerVideoDisabledMap = ydoc.getMap("peer-video-disabled");
    setPeerVideoToDisable(peerVideoDisabledMap);

    peerMap.observe((event) => {
      console.log("peer to remove observed");
      let peersInMap = peerMap.get("peers");

      console.log("peer to remove: ", peersInMap);
      testHello();
      if (peersInMap === undefined) {
        peersInMap = [];
      }

      for (let i = 0; i < peersInMap.length; i++) {
        let peer = peersInMap[i];
        let remoteUserVideoWrapper = document.getElementById(peer);
        if (remoteUserVideoWrapper === null) {
          continue;
        }
        remoteUserVideoWrapper.remove();
        let remoteUserText = document.getElementById(peer + "-text");
        if (remoteUserText === null) {
          continue;
        }
        remoteUserText.remove();
      }
    });

    peerVideoDisabledMap.observe((event) => {
      console.log("peer to disable observed");
      console.log("video map: ", videoMap);
      let remoteUserVideoWrapper =
        document.getElementById("remote-user-videos");
      for (const child of remoteUserVideoWrapper.children) {
        console.log("child: ", child);
        for (let [key, value] of videoMap) {
          let remoteUserVideo = child.querySelector(".remote-video");
          if (child.id === key && remoteUserVideo.srcObject === null) {
            console.log("remoteUserVideo VALUE: ", value);
            remoteUserVideo.srcObject = value;
            remoteUserVideo.play();
          }
        }
      }

      let peerMapVideoDisabled = peerVideoDisabledMap.get("peersVideoDisabled");
      if (peerMapVideoDisabled === undefined) {
        peerMapVideoDisabled = [];
      }
      for (let i = 0; i < peerMapVideoDisabled.length; i++) {
        let peer = peerMapVideoDisabled[i];
        let remoteUserVideoWrapper = document.getElementById(peer);
        if (remoteUserVideoWrapper === null) {
          continue;
        }
        console.log("remoteUserVideoWrapper: ", remoteUserVideoWrapper);
        let remoteUserVideo =
          remoteUserVideoWrapper.querySelector(".remote-video");
        console.log("remoteUserVideo: ", remoteUserVideo);
        remoteUserVideo.pause();
        remoteUserVideo.srcObject = null;
      }
    });

    // set up observer
    elMap.observe((event) => {
      console.log("observed");
      dispatch(setNodes(elMap.get("nodes")));
      dispatch(setEdges(elMap.get("edges")));
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
    if (userModifiedNodes && elementMap) {
      console.log("user changed nodes");
      elementMap.set("nodes", nodes);
      dispatch(setUserModifiedNodes(false));
    }
  }, [dispatch, nodes, userModifiedNodes, elementMap]);

  useEffect(() => {
    // todo
    if (userModifiedEdges && elementMap) {
      console.log("user changed edges");
      elementMap.set("edges", edges);
      dispatch(setUserModifiedEdges(false));
    }
  }, [dispatch, edges, userModifiedEdges, elementMap]);

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

  const addUser = async () => {
    console.log("share clicked");
    console.log("email: ", emailInput);
    const accessToken = await getAccessTokenSilently();
    await boardServices.addCollaborator(
      user.email,
      accessToken,
      roomId,
      emailInput,
      "collaborator" // hardcode for now
    );
    sendEmail();
  };

  const sendEmail = async () => {
    console.log("Sending email via SendGrid");
    const accessToken = await getAccessTokenSilently();
    const res = await axios.post(
      process.env.REACT_APP_BASE_URL + "/api/invite/",
      {
        email: emailInput,
        url: process.env.REACT_APP_BASE_URL + "/page/" + roomId,
      },
      getAuthHeader(user.email, accessToken)
    );
    setEmailInput("");
    console.log(res.data);
  };

  const [emailInput, setEmailInput] = useState("");

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

          <div className="input-group mb-3 email-input">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Email
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
              }}
            ></input>
          </div>
          <button
            onClick={addUser}
            style={{ marginBottom: "10px" }}
            id="invite-btn"
            className="share-button"
          >
            Share Your Board
          </button>
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
            <MiniMap zoomable pannable />
          </ReactFlow>
        </div>
        <div className="col-xl-2 col-12 col-md-3 d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
          <h3>Current caller id: {peerId}</h3>
          <button
            onClick={logCallState}
            className="btn-add"
            style={{ marginBottom: "20px" }}
          >
            log call state
          </button>

          <button
            id="on-camera-button"
            class="btn btn-light mb-2"
            onClick={turnOnCamera}
          >
            turn on camera
          </button>
          <button
            id="off-camera-button"
            class="hidden btn btn-danger"
            onClick={turnOffCamera}
          >
            turn off camera
          </button>
          <input
            type="text"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
          />
          <button
            id="call-button"
            onClick={() => call(elementMap.get("users"))}
            class="btn btn-success mb-2"
          >
            Call
          </button>
          <button
            type="button"
            id="disconnect-call-button"
            class="hidden btn btn-danger mb-2"
            onClick={hangUp}
          >
            disconnect
          </button>

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
