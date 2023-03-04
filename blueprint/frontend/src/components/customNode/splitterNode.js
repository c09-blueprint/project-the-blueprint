import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { border: "1px solid #777", padding: 10 };

export default memo(({ data, isConnectable }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node" style={handleStyle}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
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
        style={{ left: 188 }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
