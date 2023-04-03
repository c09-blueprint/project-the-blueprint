import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { CallbackPage } from "./components/auth0/emptyCallback";
import { AuthGuard } from "./components/auth0/authGuard";
import { PAGES } from "./routes";
import { getMe } from "./reducers/userReducer";
import NotFound from "./components/page/NotFoundPage";
import Dashboard from "./components/page/dashboard/dashboard";
import DashbordShared from "./components/page/dashboard/dashboardShared";
import ReactFlowPage from "./components/page/reactFlow/ReactFlowPage";
import LandingPage from "./components/page/landingPage/landingPage";

// test workflows
function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<LandingPage />} />
        <Route path={PAGES.auth0CallbackPath} element={<CallbackPage />} />
        <Route
          path={PAGES.dashboardPath}
          element={<AuthGuard component={Dashboard} />}
        />
        <Route
          path={PAGES.dashboardSharedPath}
          element={<AuthGuard component={DashbordShared} />}
        />
        <Route
          path={PAGES.pagePath}
          element={<AuthGuard component={VerifyCollaborator} />}
        />
      </Routes>
    </div>
  );
}

const VerifyCollaborator = () => {
  const dispatch = useDispatch();

  const { roomId } = useParams();
  const boards = useSelector((state) => state.board);

  /* On refresh, on redirect on page, get me */
  const { user, getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const dispatchGetMe = async () => {
      const accessToken = await getAccessTokenSilently();
      dispatch(getMe(user.email, accessToken));
    };
    dispatchGetMe();
  }, [dispatch]);

  const boardExists = (boards, boardId) => {
    for (let i = 0; i < boards.length; i++) {
      if (boards[i].id === parseInt(boardId)) {
        return true;
      }
    }
    return false;
  };

  /* Check if user has access to the baord. */
  const isCollaborator =
    boards &&
    (boardExists(boards.owned, roomId) || boardExists(boards.shared, roomId));

  if (isCollaborator) {
    return <ReactFlowPage />;
  }

  return <NotFound />;
};

export default App;
