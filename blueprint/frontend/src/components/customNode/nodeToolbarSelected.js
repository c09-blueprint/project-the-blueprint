import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { NodeToolbar } from "reactflow";
import {
  removeNode,
  duplicateNodeById,
  changeBackgroundColor,
} from "../../reducers/nodeReducer";
import "./globalNode.css";

const NodeToolbarSelected = ({ id, type }) => {
  const dispatch = useDispatch();

  const onNodeDelete = useCallback(() => {
    console.log("delete node");
    dispatch(removeNode(id));
  }, [dispatch, id]);

  const onNodeDuplicate = useCallback(() => {
    console.log("duplicate node");
    dispatch(duplicateNodeById(id));
  }, [dispatch, id]);

  const onBackgroundColorChange = useCallback(
    (event) => {
      console.log("change node color: ", event.target.value);
      dispatch(changeBackgroundColor(id, type, event.target.value));
    },
    [dispatch, id, type]
  );

  return (
    <NodeToolbar>
      <div
        className="btn-group"
        role="group"
        aria-label="Button group with nested dropdown"
      >
        <button className="btn  btn-danger" onClick={onNodeDelete}>
          Delete
        </button>
        <button className="btn btn-secondary" onClick={onNodeDuplicate}>
          Duplicate
        </button>

        <div className="btn-group" role="group">
          <button
            id="btnGroupDrop1"
            type="button"
            className="btn btn-secondary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Colour Change
          </button>
          <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
            <a className="dropdown-item" href="#">
              <input
                className="btn-margins"
                onChange={onBackgroundColorChange}
                type="color"
              />
              Background
            </a>
            {/* <a className="dropdown-item" href="#">
              <input
                className="btn-margins"
                onChange={onBackgroundColorChange}
                type="color"
              />
              Text
            </a> */}
          </div>
        </div>
      </div>
    </NodeToolbar>
  );
};

export default NodeToolbarSelected;
