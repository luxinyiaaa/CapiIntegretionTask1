import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { setOnUnauthorizedHandler } from "@/api/axios";
import { useAuth } from "@/context/useAuth";
import { useCurrentUserQuery } from "@/hooks/useCurrentUserQuery";
import { AppRoutes } from "@/routes/AppRoutes";
import { RouteLoadingScreen } from "@/components/ui/RouteLoadingScreen";

const App: FC = () => {
  const navigate = useNavigate();
  const { loading, logout, isAuthed } = useAuth();
  const shouldFetchCurrentUser = !loading && isAuthed;

  useCurrentUserQuery({
    enabled: shouldFetchCurrentUser,
    firebaseLoading: loading,
  });

  useEffect(() => {
    setOnUnauthorizedHandler(() => {
      void logout();
      navigate("/login", {
        replace: true,
        state: { reason: "session_expired" },
      });
    });
  }, [logout, navigate]);

  if (loading) {
    return <RouteLoadingScreen message="Loading application..." />;
  }

  return <AppRoutes />;
};

export default App;
