import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { updateNodeLabel } from "../../reducers/nodeReducer";
import { useDispatch } from "react-redux";
import { NodeResizer } from "@reactflow/node-resizer";
import {
  handleStyle,
  useUpdateNodeLabel,
  resizeLabel,
} from "./globalNodeStyle";
import "./splitterNode.css";

// the argument is the props of the node
export default memo(({ data, id, isConnectable, selected }) => {
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
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div class="text-area-wrapper">
        <textarea
          onChange={onChange}
          placeholder="Enter text"
          className="nodrag"
        >
          {data.label}
        </textarea>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="left"
        style={{ left: 10 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="right"
        style={{ left: 95 + "%" }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
