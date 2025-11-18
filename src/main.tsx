import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "flowbite/dist/flowbite.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { App } from "./App";

const container = document.getElementById("root")!;

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
