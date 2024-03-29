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
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  const [remakePeer, setRemakePeer] = useState(false);
  const [dataConnection, setDataConnection] = useState(null);

  let callList = [];
  const [videoMap, setVideoMap] = useState(new Map());

  let uuid = crypto.randomUUID();
  let peerName = "";
  let email = user.email.split("@")[0];
  let name = email.match(/[a-zA-Z0-9]+/g).join("");
  if (user.given_name === undefined && user.family_name === undefined) {
    peerName = uuid + "_" + name;
  } else if (user.family_name === undefined) {
    peerName = uuid + "_" + user.given_name;
  } else {
    peerName = uuid + "_" + user.given_name + " " + user.family_name;
  }

  const createVideoPlayer = (stream, call) => {
    let remoteUserVideoWrapper = document.getElementById("remote-user-videos");
    let singleVideoWrapper = document.createElement("div");
    singleVideoWrapper.setAttribute("id", call.peer);

    let remoteVideo = document.createElement("video");
    remoteVideo.setAttribute("class", "remote-video mb-4");
    remoteVideo.setAttribute("autoplay", "true");
    remoteVideo.muted = false;
    remoteVideo.srcObject = stream;

    let remoteIdText = document.createElement("p");
    remoteIdText.setAttribute("class", "remote-id-text");
    let name = call.peer.split("_");
    if (name.length > 1) {
      remoteIdText.innerHTML = name[1];
    } else {
      remoteIdText.innerHTML = name[0];
    }
    remoteIdText.setAttribute("id", call.peer + "-text");
    let muteWrapper = document.createElement("div");
    muteWrapper.setAttribute("class", "mute-wrapper");
    let muteText = document.createElement("p");
    muteText.setAttribute("class", "mute-text hidden");
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

    setVideoMap((videoMap) => videoMap.set(call.peer, stream));
  };

  useEffect(() => {
    const peer = new Peer(peerName);
    peer.on("open", function (id) {
      setPeerId(id);
    });

    // When a remote peer connects to this peer
    peer.on("connection", (connection) => {
      setDataConnection(connection);
    });

    // When a remote peer calls this peer
    peer.on("call", (call) => {
      let getUserMedia =
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
          }
        });
      });
    });
    peerInstance.current = peer;
  }, [remakePeer]);

  const call = (remotePeerIds) => {
    turnOnCamera();
    // disconnect call button appear using css hidden
    let disconnectCallButton = document.getElementById(
      "disconnect-call-button"
    );
    disconnectCallButton.classList.remove("hidden");
    // make call button disappear using css hidden
    let callButton = document.getElementById("call-button");
    callButton.classList.add("hidden");

    let users = elementMap.get("users");
    if (users === undefined) {
      users = [];
    }
    if (!users.includes(peerId)) {
      users.push(peerId);
    }
    elementMap.set("users", users);

    let getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        let remoteUserVideoWrapper =
          document.getElementById("remote-user-videos");

        //clear
        remoteUserVideoWrapper.innerHTML = "";

        if (!remotePeerIds) remotePeerIds = [];

        for (let i = 0; i < remotePeerIds.length; i++) {
          if (remotePeerIds[i] === peerId) {
            continue;
          }
          let call = peerInstance.current.call(remotePeerIds[i], stream);
          let connect = peerInstance.current.connect(remotePeerIds[i]);
          setDataConnection(connect);
          call.on("stream", (remoteStream) => {
            if (callList.includes(call.peer)) {
              return;
            } else {
              createVideoPlayer(remoteStream, call);
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
    turnOffCamera();
    let onCamera = document.getElementById("on-camera-button");
    onCamera.classList.add("hidden");

    let peers = peerToRemove.get("peers");
    if (peers === undefined) {
      peers = [];
    }
    if (!peers.includes(peerId)) {
      peers.push(peerId);
    }
    peerToRemove.set("peers", peers);

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
    const index = users.indexOf(peerId);
    if (index > -1) {
      users.splice(index, 1);
    }
    elementMap.set("users", users);

    let remoteUserVideoWrapper = document.getElementById("remote-user-videos");
    remoteUserVideoWrapper.innerHTML = "";

    let remoteVideos = document.getElementsByClassName("remote-video");
    for (let i = 0; i < remoteVideos.length; i++) {
      remoteVideos[i].pause();
      remoteVideos[i].srcObject = null;
    }

    peerInstance.current.destroy();
    dataConnection && dataConnection.close();
    setRemakePeer(!remakePeer);
  };

  const turnOnCamera = () => {
    // disconnect call button appear using css hidden
    let offCamera = document.getElementById("off-camera-button");
    offCamera.classList.remove("hidden");
    // make call button disappear using css hidden
    let onCamera = document.getElementById("on-camera-button");
    onCamera.classList.add("hidden");

    let getUserMedia =
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

    let peersVideoDisabled = peerVideoToDisable.get("peersVideoDisabled");
    if (peersVideoDisabled === undefined) {
      peersVideoDisabled = [];
    }
    if (!peersVideoDisabled.includes(peerId)) {
      peersVideoDisabled.push(peerId);
    }
    peerVideoToDisable.set("peersVideoDisabled", peersVideoDisabled);
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

    websockerProvider.on("status", (event) => {});

    const elMap = ydoc.getMap("element-map");
    setElementMap(elMap);
    const peerMap = ydoc.getMap("peer-to-remove");
    setPeerToRemove(peerMap);
    const peerVideoDisabledMap = ydoc.getMap("peer-video-disabled");
    setPeerVideoToDisable(peerVideoDisabledMap);

    peerMap.observe((event) => {
      let peersInMap = peerMap.get("peers");

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

    peerVideoDisabledMap.observe(() => {
      let remoteUserVideoWrapper =
        document.getElementById("remote-user-videos");
      for (const child of remoteUserVideoWrapper.children) {
        for (let [key, value] of videoMap) {
          let remoteUserVideo = child.querySelector(".remote-video");
          if (child.id === key && remoteUserVideo.srcObject === null) {
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
        let remoteUserVideo =
          remoteUserVideoWrapper.querySelector(".remote-video");
        remoteUserVideo.pause();
        remoteUserVideo.srcObject = null;
      }
    });

    // set up observer
    elMap.observe(() => {
      dispatch(setNodes(elMap.get("nodes")));
      dispatch(setEdges(elMap.get("edges")));
    });

    // cleanup function to disconnect from websocket when unmount
    return () => {
      websockerProvider.destroy();
    };
  }, [dispatch, roomId]);

  window.addEventListener("beforeunload", () => {
    hangUp();
  });

  /*
    Publishers. 
    Only publish if this user made changes.
  */
  useEffect(() => {
    // todo
    if (userModifiedNodes && elementMap) {
      elementMap.set("nodes", nodes);
      dispatch(setUserModifiedNodes(false));
    }
  }, [dispatch, nodes, userModifiedNodes, elementMap]);

  useEffect(() => {
    // todo
    if (userModifiedEdges && elementMap) {
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

      const type = event.dataTransfer.getData("nodeType");
      const style = event.dataTransfer.getData("style");
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

  const isEmailValid = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  // const { user, getAccessTokenSilently } = useAuth0();
  const addUser = async () => {
    if (isEmailValid(emailInput)) {
      const accessToken = await getAccessTokenSilently();
      await boardServices.addCollaborator(
        user.email,
        accessToken,
        roomId,
        emailInput,
        "collaborator" // hardcode for now
      );
      sendEmail();
    } else {
      setIsVisibleFail(true);
      setTimeout(() => {
        setIsVisibleFail(false);
      }, 3000);
    }
  };

  const sendEmail = async () => {
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
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  const [emailInput, setEmailInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleFail, setIsVisibleFail] = useState(false);

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
        <div className="col-xl-3 col-12 col-md-3 d-flex flex-column flex-shrink-0 p-3 text-color bg-light">
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
              className="drop-icon btn-outline-secondary"
            >
              Input
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
              className="drop-icon btn-outline-secondary"
            >
              Output
            </button>
            <button
              onClick={() => onClickAddNode("splitterNode", resizableStyle)}
              onDragStart={(event) =>
                onDragStart(event, "splitterNode", resizableStyle)
              }
              draggable
              id="splitter-node"
              className="drop-icon btn-outline-primary"
            >
              2-Split
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
              className="drop-icon btn-outline-primary"
            >
              Default
            </button>
            <button
              onClick={() =>
                onClickAddNode("resizableText", resizableTextStyle)
              }
              onDragStart={(event) =>
                onDragStart(event, "resizableText", resizableTextStyle)
              }
              draggable
              className="drop-icon btn-outline-primary"
            >
              Free Text
            </button>
            <button
              onClick={() => onClickAddNode("circleNode", resizableTextStyle)}
              onDragStart={(event) =>
                onDragStart(event, "circleNode", resizableTextStyle)
              }
              draggable
              className="drop-icon btn-outline-warning"
              id="circle-node"
            >
              Circle
            </button>
            <button
              onClick={() => onClickAddNode("diamondNode", resizableTextStyle)}
              onDragStart={(event) =>
                onDragStart(event, "diamondNode", resizableTextStyle)
              }
              draggable
              className="drop-icon btn-outline-warning"
              id="diamond-node"
            >
              Diamond
            </button>
            <button
              onClick={() => onClickAddNode("triangleNode", resizableTextStyle)}
              onDragStart={(event) =>
                onDragStart(event, "triangleNode", resizableTextStyle)
              }
              draggable
              className="drop-icon btn-outline-warning"
              id="triangle-node"
            >
              Triangle
            </button>
          </div>
          <div className="spacer"></div>
          <h4>Change Edge Type</h4>
          <div className="two-grid">
            <button
              onClick={() => changeEdgeType("defaultEdge")}
              style={{ marginBottom: "20px" }}
              id="default-edge"
              className="drop-icon btn-outline-success"
            ></button>
            <button
              onClick={() => changeEdgeType("straightEdge")}
              style={{ marginBottom: "20px" }}
              id="straight-edge"
              className="drop-icon btn-outline-success"
            ></button>

            <button
              onClick={() => changeEdgeType("stepEdge")}
              style={{ marginBottom: "20px" }}
              id="step-edge"
              className="drop-icon btn-outline-success"
            ></button>
          </div>
          <div className="spacer"></div>
          <h4>Share the Board</h4>
          <div className="input-group mb-3 email-input">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Email
              </span>
            </div>
            <input
              type="text"
              className="form-control form-input"
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
            className="btn btn-info share-button text-white"
          >
            Share
          </button>
          <div
            className={`alert alert-success ${isVisible ? "" : "hidden"}`}
            role="alert"
          >
            Board was shared successfully!
          </div>
          <div
            className={`alert alert-danger ${isVisibleFail ? "" : "hidden"}`}
            role="alert"
          >
            Board was not shared. Please check if email is valid.
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
            <MiniMap zoomable pannable />
          </ReactFlow>
        </div>
        <div className="col-xl-2 col-12 col-md-3 d-flex flex-column flex-shrink-0 p-3 text-color bg-light">
          <h3>Current Caller: {peerName.split("_")[1]}</h3>
          <button
            id="on-camera-button"
            class="hidden btn btn-light mb-2"
            onClick={turnOnCamera}
          >
            Turn On Camera
          </button>
          <button
            id="off-camera-button"
            class="hidden btn btn-danger mb-3"
            onClick={turnOffCamera}
          >
            Turn Off Camera
          </button>
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
            Disconnect
          </button>
          <video ref={currentUserVideoRef} />
          <div id="remote-user-videos"></div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardReactFlow;
