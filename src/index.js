import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { AuthContextProvider, MaterialUIControllerProvider } from "context";
import { store } from './redux/store';
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthContextProvider>
        <MaterialUIControllerProvider>
          <App />
        </MaterialUIControllerProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </Provider>
);