import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";


// =====================================
// Toast Notifications
// =====================================
import { Toaster }
from "./components/ui/sonner";


// =====================================
// Redux
// =====================================
import { Provider }
from "react-redux";

import {
  store,
  persistor,
} from "./redux/store";


// =====================================
// Redux Persist
// =====================================
import {
  PersistGate,
} from "redux-persist/integration/react";



// =====================================
// Render App
// =====================================
createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    {/* Redux Provider */}
    <Provider store={store}>

      {/* Persist Redux State */}
      <PersistGate
        loading={null}
        persistor={persistor}
      >

        {/* Toast Notifications */}
        <Toaster richColors />

        {/* Main App */}
        <App />

      </PersistGate>

    </Provider>

  </StrictMode>
);