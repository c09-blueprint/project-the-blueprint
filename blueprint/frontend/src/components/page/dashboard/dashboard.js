import "./dashboard.css";
import "../styles/cols.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { getMe } from "../../../reducers/userReducer";
import DashbordBase from "./dashboardBase";
import { setEdges } from "../../../reducers/edgeReducer";
import { setNodes } from "../../../reducers/nodeReducer";

const Dashbord = () => {
  const dispatch = useDispatch();

  const { user, getAccessTokenSilently } = useAuth0();

  const board = useSelector((state) => state.board);

  /* Reset redux store on go back and forward */
  window.onpopstate = function () {
    dispatch(setEdges([]));
    dispatch(
      setNodes({
        currentId: 1,
        nodes: [],
      })
    );
  };

  /* On initial, get me */
  useEffect(() => {
    const dispatchGetMe = async () => {
      const accessToken = await getAccessTokenSilently();
      dispatch(getMe(user.email, accessToken));
    };
    dispatchGetMe();
  }, [dispatch]);

  return <DashbordBase boards={board && board.owned} />;
};

export default Dashbord;
