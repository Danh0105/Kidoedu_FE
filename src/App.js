
import React from "react";
import UserAppRoutes from "./routes/UserAppRoutes";
import AdminAppRoutes from "./routes/AdminAppRoutes";
import useAutoLogout from "./hooks/useAutoLogout";
import { CartProvider } from "./hooks/CartContext";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function App() {


  return (

    <React.StrictMode>
      {/*  <MobileBlocker /> */}
      {useAutoLogout()}
      <CartProvider>
        <UserAppRoutes />
      </CartProvider>

      <AdminAppRoutes />
    </React.StrictMode>


  );
}

export default App;
