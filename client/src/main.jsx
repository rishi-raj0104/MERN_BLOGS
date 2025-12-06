import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { initCSRF } from "./helpers/csrf";

// Initialize CSRF token on app load
initCSRF();

createRoot(document.getElementById("root")).render(

    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ToastContainer position="top-right" autoClose={3000} />
        <App />
      </PersistGate>
    </Provider>
);
