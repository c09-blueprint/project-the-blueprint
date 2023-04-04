import "./dashboard.css";
// import "../styles/cols.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../navbar/navbar";
import { createBoard, deleteBoard } from "../../../reducers/boardReducer";
import { useLocation } from "react-router-dom";

const CreateBoardForm = () => {
  const dispatch = useDispatch();
  const { user, getAccessTokenSilently } = useAuth0();
  const [boardName, setBoardName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const submitCreateBoard = (e) => {
    e.preventDefault();
    const dispatchGetBoard = async () => {
      const accessToken = await getAccessTokenSilently();
      dispatch(createBoard(user.email, accessToken, boardName));
    };
    dispatchGetBoard();
    setBoardName("");

    if (location.pathname !== "/dashboard") {
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Create Board
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form id="create-board-form">
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Board Name
                </label>
                <input
                  type="text"
                  className="form-control form-input"
                  id="input-board-name"
                  aria-describedby="emailHelp"
                  value={boardName}
                  onChange={(e) => {
                    setBoardName(e.target.value);
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={submitCreateBoard}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
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
    navigate(`/page/${id}`);
  };

  const location = useLocation();

  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const handleDeleteBoard = async () => {
    const accessToken = await getAccessTokenSilently();
    dispatch(deleteBoard(user.email, accessToken, id));
  };

  return (
    <div className="card doc-card card-spacing text-white bg-info col-lg-3 col-md-5 col-sm-11 mb-11">
      <div className="card-header header-font">Board ID: {id}</div>
      <div className="card-body">
        <h5 className="card-title title-spacing">{name}</h5>
        <button
          type="button"
          className="btn btn-warning btn-spacing"
          onClick={handleClick}
        >
          Enter Board
        </button>
        <div
          className={`btn-group btn-spacing${
            location.pathname === "/dashboard/shared" ? "hidden-btn" : ""
          }`}
        >
          <button
            type="button"
            className="btn dropdown-toggle btn-secondary"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Edit
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <button
              type="button"
              className="dropdown-item highlight"
              onClick={handleDeleteBoard}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashbordBase = (props) => {
  const location = useLocation();
  return (
    <div>
      <CreateBoardForm></CreateBoardForm>
      <Navbar></Navbar>
      <div className="container">
        <h3
          className={` header-spacing ${
            location.pathname === "/dashboard/shared" ? "hidden-btn" : ""
          }`}
        >
          My Workspace
        </h3>
        <h3
          className={` header-spacing ${
            location.pathname === "/dashboard" ? "hidden-btn" : ""
          }`}
        >
          Shared With Me
        </h3>
        <div className="deck-spacing">
          <div id="board-card-wrapper" className="row">
            {Array.isArray(props.boards) && props.boards.length === 0 && (
              <div className="col-12">
                <p class="h5">There are no boards.</p>
              </div>
            )}
            {Array.isArray(props.boards) &&
              props.boards.length > 0 &&
              props.boards.map((board) => (
                <BoardCard
                  key={board.id}
                  id={board.id}
                  name={board.name}
                ></BoardCard>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashbordBase;
