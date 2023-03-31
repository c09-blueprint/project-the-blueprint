import "./dashboard.css";
import "../styles/cols.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { getMe } from "../../../reducers/userReducer";
import DashbordBase from "./dashboardBase";

const DashbordShared = () => {
  const dispatch = useDispatch();

  const { user, getAccessTokenSilently } = useAuth0();

  const board = useSelector((state) => state.board);

  /* On initial, get me */
  useEffect(() => {
    const dispatchGetMe = async () => {
      const accessToken = await getAccessTokenSilently();
      dispatch(getMe(user.email, accessToken));
    };
    dispatchGetMe();
  }, [dispatch]);

  return <DashbordBase boards={board && board.shared} />;
};

export default DashbordShared;
