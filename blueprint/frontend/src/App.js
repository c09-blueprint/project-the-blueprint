import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "./App.css";

import { createUser, getMe } from "./reducers/userReducer";
import TestReactFlow from "./test";
import Draw from "./canvas";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    user && console.log(user);
  }, [user]);

  function dispatchCreateUser() {
    dispatch(
      createUser({
        username: "test",
      })
    );
  }

  return (
    <div class="test-react">
      {/* <Draw></Draw> */}
      <TestReactFlow></TestReactFlow>
    </div>
  );
}

export default App;
