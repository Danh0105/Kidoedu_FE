import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from './hooks/ModalContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ModalProvider>
      <App />
    </ModalProvider>

  </BrowserRouter>

);
