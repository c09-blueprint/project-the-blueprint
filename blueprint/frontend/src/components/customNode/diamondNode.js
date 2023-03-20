import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useDispatch } from "react-redux";
import { NodeResizer } from "@reactflow/node-resizer";
import { updateNodeLabel } from "../../reducers/nodeReducer";

import "@reactflow/node-resizer/dist/style.css";
import { handleStyle } from "./globalNodeStyle";

export default memo(({ data, id, selected }) => {
  const dispatch = useDispatch();
  const onChange = useCallback(
    (evt) => dispatch(updateNodeLabel(id, evt.target.value)),
    [dispatch, id]
  );

  return (
    <div className="text-updater-node">
      <NodeResizer
        color="#2495ff"
        isVisible={selected}
        minWidth={100}
        minHeight={100}
        handleStyle={handleStyle}
      />
      <svg
        style={{ display: "block", overflow: "visible" }}
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <polygon points="0 50,50 100,100 50,50 0" fill="blue" stroke="black" />
      </svg>
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <div className="diamond-text-area-wrapper">
          <textarea
            value={data.label}
            onChange={onChange}
            placeholder="Enter text"
            className="nodrag "
          />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
