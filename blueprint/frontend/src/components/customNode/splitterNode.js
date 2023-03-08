import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { updateNodeLabel } from "../../reducers/nodeReducer";
import { useDispatch } from "react-redux";
import { NodeResizer } from "@reactflow/node-resizer";

const handleStyle = { padding: 3 };

// the argument is the props of the node
export default memo(({ data, id, isConnectable, selected }) => {
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
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <div id={"label-" + id} style={{ padding: 10, wordWrap: "break-word" }}>
          {data.label}
        </div>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
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
