import "./dashboard.css";
import "../styles/cols.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getMe } from "../../../reducers/userReducer";
import Navbar from "../navbar/navbar";
import { createBoard } from "../../../reducers/boardReducer";

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

const DashbordBase = (props) => {
  return (
    <div>
      <CreateBoardForm></CreateBoardForm>
      <Navbar></Navbar>
      <div id="board-card-wrapper" className="card-deck cards-spacing">
        {props.boards &&
          props.boards.map((board) => (
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

export default DashbordBase;
