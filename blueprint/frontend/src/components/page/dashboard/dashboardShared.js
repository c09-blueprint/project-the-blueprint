import "./dashboard.css";
import "../styles/cols.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getMe } from "../../../reducers/userReducer";
import Navbar from "../navbar/navbar";
import { createBoard } from "../../../reducers/boardReducer";

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

const CreateBoardForm = () => {
  const dispatch = useDispatch();
  const { user, getAccessTokenSilently } = useAuth0();
  const [boardName, setBoardName] = useState("");

  const submitCreateBoard = (e) => {
    e.preventDefault();
    const dispatchGetBoard = async () => {
      const accessToken = await getAccessTokenSilently();
      dispatch(createBoard(user.email, accessToken, boardName));
    };
    dispatchGetBoard();
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

  return (
    <div onClick={handleClick} className="card text-white bg-info mb-3">
      <div className="card-header">id: {id}</div>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
      </div>
    </div>
  );
}

const DashbordShared = () => {
  const dispatch = useDispatch();

  const { user, getAccessTokenSilently } = useAuth0();

  const board = useSelector((state) => state.board);

  /* On initial, get me */
  useEffect(() => {
    const dispatchGetMe = async () => {
      const accessToken = await getAccessTokenSilently();
      dispatch(getMe(user.email, accessToken));
    };
    dispatchGetMe();
  }, [dispatch]);

  return (
    <div>
      <CreateBoardForm></CreateBoardForm>
      <Navbar></Navbar>
      <div id="board-card-wrapper" className="card-deck cards-spacing">
        {board &&
          board.shared.map((board) => (
            <BoardCard
              key={board.id}
              id={board.id}
              name={board.name}
            ></BoardCard>
          ))}
      </div>
    </div>
  );
};

export default DashbordShared;
