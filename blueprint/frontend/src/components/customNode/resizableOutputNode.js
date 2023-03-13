import React, { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useDispatch } from "react-redux";
import { NodeResizer } from "@reactflow/node-resizer";
import { updateNodeLabel } from "../../reducers/nodeReducer";

import "@reactflow/node-resizer/dist/style.css";
import { handleStyle, resizeLabel } from "./globalNodeStyle";

export default memo(({ data, id, selected }) => {
  const dispatch = useDispatch();
  const onChange = useCallback(
    (evt) => dispatch(updateNodeLabel(id, evt.target.value)),
    [dispatch, id]
  );

  resizeLabel();

  return (
    <div className="text-updater-node">
      <NodeResizer
        color="#2495ff"
        isVisible={selected}
        minWidth={100}
        minHeight={100}
        handleStyle={handleStyle}
      />
      <Handle type="target" position={Position.Top} />
      <div class="text-area-wrapper">
        <textarea
          onChange={onChange}
          placeholder="Enter text"
          className="nodrag"
        >
          {data.label}
        </textarea>
      </div>
    </div>
  );
});
