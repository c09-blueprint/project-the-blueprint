import "./dashboard.css";
import React, { useEffect } from "react";
import "../styles/cols.css";
import Navbar from "../navbar/navbar";

import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function DocCard() {
  return (
    <div className="card doc-card cols-1">
      <div className="card-body">
        <h5 className="card-title">Document Title</h5>
        <p className="card-text">
          [Document description] This is a wider card with supporting text below
          as a natural lead-in to additional content.
        </p>
      </div>
      <div className="btn-group edit-btn algin-right">
        <button
          type="button"
          className="btn  dropdown-toggle btn-outline-info"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Edit
        </button>
        <div className="dropdown-menu dropdown-menu-right">
          <button className="dropdown-item" type="button">
            Rename
          </button>
          <button className="dropdown-item" type="button">
            Duplicate
          </button>
          <button className="dropdown-item" type="button">
            Delete
          </button>
        </div>
      </div>
      <div className="card-footer">
        <small className="text-muted">Last updated 3 mins ago</small>
      </div>
    </div>
  );
}

const WorkspaceCard = () => {
  return (
    <div className="card text-white bg-info mb-3">
      <div className="card-header">Workspace</div>
      <div className="card-body">
        <h5 className="card-title">Workspace Name</h5>
        <p className="card-text">Description here</p>
      </div>
    </div>
  );
};

function BoardCard(props) {
  const navigate = useNavigate();
  const name = props.name;
  const id = props.id;

  // add event listener to the button
  // when button is clicked, redirect to the board page
  const handleClick = () => {
    console.log("button clicked");
  };

  return (
    <div className="card text-white bg-info mb-3">
      <div className="card-header">id: {id}</div>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <button onClick={() => navigate(`/page/${id}`)}>
          Go to work space Button should be whole card but whatever
        </button>
      </div>
    </div>
  );
}

const Dashbord = () => {
  const { user } = useAuth0();

  console.log(user);

  let dispatch = useDispatch();
  let board = useSelector((state) => state.board);
  console.log("board: ", board);

  useEffect(() => {
    var boardCardWrapper = document.getElementById("board-card-wrapper");
    // map new board cards to the board card wrapper
    board.map((board) => {
      console.log(board.name);
    });
  }, [board]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar></Navbar>
      <div id="board-card-wrapper" className="card-deck cards-spacing">
        <DocCard></DocCard>
        <DocCard></DocCard>
        {/* <WorkspaceCard></WorkspaceCard> */}
        {board.map((board) => (
          <BoardCard id={board.id} name={board.name}></BoardCard>
        ))}
      </div>
    </div>
  );
};

export default Dashbord;
