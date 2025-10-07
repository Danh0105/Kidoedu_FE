
import React from "react";
import UserAppRoutes from "./routes/UserAppRoutes";
import AdminAppRoutes from "./routes/AdminAppRoutes";
import useAutoLogout from "./hooks/useAutoLogout";
import { CartProvider } from "./hooks/CartContext";
import MobileBlocker from "./hooks/MobileBlocker";
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
