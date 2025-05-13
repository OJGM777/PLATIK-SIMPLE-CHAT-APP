import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {persistStore} from "redux-persist"
// import 'emoji-mart/css/emoji-mart.css'; CHANGE STYLES
// import 'emoji-mart/css/'; 

import "./index.css";
import App from "./App.jsx";
import { store } from "./store/index.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>
);
