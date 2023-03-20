import React, { memo, useCallback } from "react";
import { EdgeLabelRenderer, getSmoothStepPath } from "reactflow";

import { useDispatch } from "react-redux";

import "@reactflow/node-resizer/dist/style.css";
import { updateEdgeLabel } from "../../reducers/edgeReducer";
import "./globalEdge.css";

export default memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  }) => {
    const dispatch = useDispatch();
    const onChange = useCallback(
      (evt) => dispatch(updateEdgeLabel(id, evt.target.value)),
      [dispatch, id]
    );

    const [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <path id={id} className="react-flow__edge-path" d={edgePath} />
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              fontWeight: 700,
              pointerEvents: "all",
              backgroundColor: "none",
            }}
            className="nodrag nopan"
          >
            <input
              placeholder="-"
              onChange={onChange}
              value={data?.label}
            ></input>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }
);
