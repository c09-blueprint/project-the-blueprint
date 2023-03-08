import { memo, FC } from "react";
import { Handle, Position, NodeProps } from "reactflow";

import { NodeResizer } from "@reactflow/node-resizer";

import "@reactflow/node-resizer/dist/style.css";

const handleStyle = { padding: 3 };

const resizableInputNode = ({ data, selected }) => {
  return (
    <div className="text-updater-node" style={handleStyle}>
      <NodeResizer
        color="#2495ff"
        isVisible={selected}
        minWidth={100}
        minHeight={100}
        handleStyle={handleStyle}
      />
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10, wordWrap: "break-word" }}>{data.label}</div>
    </div>
  );
};

export default memo(resizableInputNode);
