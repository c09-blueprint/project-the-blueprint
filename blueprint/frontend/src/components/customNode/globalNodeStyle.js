import { useCallback } from "react";
import { updateNodeLabel } from "../../reducers/nodeReducer";
import { useDispatch } from "react-redux";
import "./globalNode.css";

export const handleStyle = { padding: 3 };

export const useUpdateNodeLabel = (id) => {
  const dispatch = useDispatch();

  const onChange = useCallback(
    (evt) => dispatch(updateNodeLabel(id, evt.target.value)),
    [dispatch, id]
  );
  return { onChange };
};
