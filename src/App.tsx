import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SafeArea } from "capacitor-plugin-safe-area";

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
    const loadSafeAreaInsets = async () => {
      try {
        const { insets } = await SafeArea.getSafeAreaInsets();
        console.log("SafeArea insets:", insets);

        document.documentElement.style.setProperty("--safe-area-inset-top", `${insets.top}px`);
        document.documentElement.style.setProperty("--safe-area-inset-right", `${insets.right}px`);
        document.documentElement.style.setProperty("--safe-area-inset-bottom", `${insets.bottom}px`);
        document.documentElement.style.setProperty("--safe-area-inset-left", `${insets.left}px`);
      } catch (error) {
        console.error("Failed to load SafeArea insets:", error);
      }
    };

    void loadSafeAreaInsets();
  }, []);

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
