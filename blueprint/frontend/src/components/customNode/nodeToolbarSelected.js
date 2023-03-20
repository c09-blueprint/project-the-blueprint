import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { NodeToolbar } from "reactflow";
import { removeNode, duplicateNodeById } from "../../reducers/nodeReducer";

const NodeToolbarSelected = ({ id }) => {
  const dispatch = useDispatch();

  const onNodeDelete = useCallback(() => {
    console.log("delete node");
    dispatch(removeNode(id));
  }, [dispatch, id]);

  const onNodeDuplicate = useCallback(() => {
    console.log("duplicate node");
    dispatch(duplicateNodeById(id));
  }, [dispatch, id]);

  return (
    <NodeToolbar>
      <div className="toolbar-wrapper bg-dark">
        <button onClick={onNodeDelete}>delete</button>
        <button onClick={onNodeDuplicate}>duplicate</button>
      </div>
    </NodeToolbar>
  );
};

export default NodeToolbarSelected;
