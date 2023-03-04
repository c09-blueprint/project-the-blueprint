import { memo, FC } from "react";
import { Handle, Position, NodeProps } from "reactflow";

import { NodeResizer } from "@reactflow/node-resizer";

import "@reactflow/node-resizer/dist/style.css";

const handleStyle = { padding: 3 };

const resizableDefaultNode = ({ data, selected }) => {
  return (
    <div className="text-updater-node" style={handleStyle}>
      <NodeResizer
        color="#2495ff"
        isVisible={selected}
        minWidth={150}
        minHeight={100}
        handleStyle={handleStyle}
      />
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10, wordWrap: "break-word" }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(resizableDefaultNode);
