import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import { Provider } from "@/components/ui/provider";
import { AuthProvider } from "@/context/AuthContext";

window.onerror = function (message, source, lineno, colno, error) {
  console.log("ONERROR:", message);
  console.log("SOURCE:", source);
  console.log("LINE:", lineno);
  console.log("COLUMN:", colno);
  console.log("ERROR OBJ:", error);
};

window.addEventListener("unhandledrejection", function (event) {
  console.log("UNHANDLED PROMISE:", event.reason);
});

const queryClient = new QueryClient();

console.log("[BOOT] main.tsx start");

window.addEventListener("error", (e: ErrorEvent) => {
  console.log("[BOOT] window error:", e.message, e.error);
});
window.addEventListener("error", (e) => {
  console.log("GLOBAL ERROR:", e);
});

window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
  console.log("[BOOT] unhandledrejection:", e.reason);
});

console.log("[BOOT] before render");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
console.log("[BOOT] after render");
