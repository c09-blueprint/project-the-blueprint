import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useDispatch } from "react-redux";
import { NodeResizer } from "@reactflow/node-resizer";
import { updateNodeLabel } from "../../reducers/nodeReducer";
import NodeToolbarSelected from "./nodeToolbarSelected";

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
      <NodeToolbarSelected id={id} />
      <Handle type="source" position={Position.Bottom} />
      <div className="text-area-wrapper">
        <textarea
          value={data.label}
          onChange={onChange}
          placeholder="Enter text"
          className="nodrag"
        />
      </div>
    </div>
  );
});
