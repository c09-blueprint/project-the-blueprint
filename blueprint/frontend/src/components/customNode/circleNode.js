import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useDispatch } from "react-redux";
import { NodeResizer } from "@reactflow/node-resizer";
import { updateNodeLabel } from "../../reducers/nodeReducer";

import "@reactflow/node-resizer/dist/style.css";
import { handleStyle } from "./globalNodeStyle";
import NodeToolbarSelected from "./nodeToolbarSelected";

export default memo(({ data, id, selected, type }) => {
  const dispatch = useDispatch();
  const onChange = useCallback(
    (evt) => dispatch(updateNodeLabel(id, evt.target.value)),
    [dispatch, id]
  );

  return (
    <div className="node-shape">
      <NodeResizer
        color="#2495ff"
        isVisible={selected}
        minWidth={100}
        minHeight={100}
        handleStyle={handleStyle}
      />
      <NodeToolbarSelected id={id} type={type} />
      <svg
        style={{ display: "block", overflow: "visible" }}
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="50%"
          cy="50%"
          rx="50%"
          ry="50%"
          fill={data?.shapeFill || "red"}
          stroke="black"
        />
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
        <div className="circle-text-area-wrapper">
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
