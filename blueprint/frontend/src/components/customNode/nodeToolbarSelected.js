import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { NodeToolbar } from "reactflow";
import {
  removeNode,
  duplicateNodeById,
  changeBackgroundColor,
} from "../../reducers/nodeReducer";

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
      <div className="toolbar-wrapper bg-dark">
        <button onClick={onNodeDelete}>delete</button>
        <button onClick={onNodeDuplicate}>duplicate</button>
        <input onChange={onBackgroundColorChange} type="color" />
      </div>
    </NodeToolbar>
  );
};

export default NodeToolbarSelected;
