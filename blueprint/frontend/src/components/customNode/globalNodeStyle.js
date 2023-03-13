import { useCallback } from "react";
import { updateNodeLabel } from "../../reducers/nodeReducer";
import { useDispatch } from "react-redux";

export const handleStyle = { padding: 3 };

export const useUpdateNodeLabel = (id) => {
  const dispatch = useDispatch();

  const onChange = useCallback(
    (evt) => dispatch(updateNodeLabel(id, evt.target.value)),
    [dispatch, id]
  );
  return { onChange };
};

export function resizeLabel() {
  const textarea = document.getElementsByTagName("textarea");

  function OnInput() {
    this.style.height = 0;
    this.style.height = this.scrollHeight + "px";
  }

  window.addEventListener("load", function () {
    for (let i = 0; i < textarea.length; i++) {
      textarea[i].setAttribute(
        "style",
        "height:" + textarea[i].scrollHeight + "px;"
      );
    }
  });

  for (let i = 0; i < textarea.length; i++) {
    textarea[i].setAttribute(
      "style",
      "height:" + textarea[i].scrollHeight + "px;"
    );
    textarea[i].addEventListener("input", OnInput, false);
  }
}
