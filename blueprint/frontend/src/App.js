import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { createUser, getMe } from "./reducers/userReducer";

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
    <div>
      <button onClick={dispatchCreateUser}>Create User</button>
    </div>
  );
}

export default App;
